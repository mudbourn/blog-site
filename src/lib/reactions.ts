import crypto from "node:crypto"

import { and, eq, gt, sql } from "drizzle-orm"

import { db } from "@/db"
import { reactions } from "@/db/schema"

export const SURFACE_TYPES = ["status", "media_block", "track", "exhibition"]

const RATE_LIMIT = 10

const WINDOW = "60 seconds"

// Sums reactions per emoji for one surface
export async function getReactionCounts(
  surfaceType: string,
  surfaceId: string
): Promise<Record<string, number>> {
  const rows = await db
    .select({
      emoji: reactions.emoji,
      count: sql<number>`count(*)::int`
    })
    .from(reactions)
    .where(
      and(
        eq(reactions.surfaceType, surfaceType),
        eq(reactions.surfaceId, surfaceId)
      )
    )
    .groupBy(reactions.emoji)

  const counts: Record<string, number> = {}

  for (const row of rows) {
    counts[row.emoji] = row.count
  }

  return counts
}

// Hashes an IP for rate limiting, never stored or returned in the clear
function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip).digest("hex")
}

// Records a reaction unless the IP is over its per-surface window budget
export async function addReaction(input: {
  surfaceType: string
  surfaceId: string
  emoji: string
  ip: string
}): Promise<boolean> {
  const ipHash = hashIp(input.ip)

  const recent = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(reactions)
    .where(
      and(
        eq(reactions.ipHash, ipHash),
        eq(reactions.surfaceType, input.surfaceType),
        eq(reactions.surfaceId, input.surfaceId),
        gt(reactions.createdAt, sql`now() - interval '${sql.raw(WINDOW)}'`)
      )
    )

  if ((recent[0]?.n ?? 0) >= RATE_LIMIT) {
    return false
  }

  await db.insert(reactions).values({
    surfaceType: input.surfaceType,
    surfaceId: input.surfaceId,
    emoji: input.emoji,
    ipHash
  })

  return true
}

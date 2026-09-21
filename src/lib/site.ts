import { asc, desc, eq } from "drizzle-orm"

import { db } from "@/db"
import {
  exhibitions,
  hamburgerLinks,
  mediaBlocks,
  siteConfig,
  statuses
} from "@/db/schema"

export interface SiteIdentity {
  handle: string
  tagline: string
  avatarUrl: string
}

export interface HamburgerLink {
  id: string
  zone: string
  label: string
  url: string
  description: string | null
  newTab: boolean
}

export interface OpenExhibition {
  id: string
  title: string
  slug: string
}

async function loadConfig(): Promise<Map<string, unknown>> {
  const rows = await db.select().from(siteConfig)

  const map = new Map<string, unknown>()

  for (const row of rows) {
    map.set(row.key, row.value)
  }

  return map
}

function readString(map: Map<string, unknown>, key: string): string {
  const value = map.get(key)

  return typeof value === "string" ? value : ""
}

export async function getSiteIdentity(): Promise<SiteIdentity> {
  const map = await loadConfig()

  return {
    handle: readString(map, "owner_handle"),
    tagline: readString(map, "owner_tagline"),
    avatarUrl: readString(map, "owner_avatar_url")
  }
}

export async function getMusicQueueSource(): Promise<string> {
  const rows = await db
    .select()
    .from(siteConfig)
    .where(eq(siteConfig.key, "music_queue_source"))

  const value = rows[0]?.value

  return typeof value === "string" ? value : "random"
}

export async function getReactionEmojiSet(): Promise<string[]> {
  const rows = await db
    .select()
    .from(siteConfig)
    .where(eq(siteConfig.key, "reaction_emoji_set"))

  const value = rows[0]?.value

  if (Array.isArray(value)) {
    return value as string[]
  }

  return []
}

export async function getLiveStatus() {
  const rows = await db
    .select()
    .from(statuses)
    .where(eq(statuses.isLive, true))
    .orderBy(desc(statuses.createdAt))
    .limit(1)

  return rows[0] ?? null
}

export async function getHamburgerLinks(): Promise<HamburgerLink[]> {
  const rows = await db
    .select()
    .from(hamburgerLinks)
    .orderBy(asc(hamburgerLinks.zone), asc(hamburgerLinks.position))

  return rows.map((row) => ({
    id: row.id,
    zone: row.zone,
    label: row.label,
    url: row.url,
    description: row.description,
    newTab: row.newTab
  }))
}

export async function getOpenExhibitions(): Promise<OpenExhibition[]> {
  const rows = await db
    .select({
      id: exhibitions.id,
      title: exhibitions.title,
      slug: exhibitions.slug
    })
    .from(exhibitions)
    .where(eq(exhibitions.status, "open"))
    .orderBy(desc(exhibitions.openedAt))

  return rows
}

export interface ExhibitionTarget {
  slug: string
  status: string
}

export async function getExhibitionTargets(): Promise<
  Map<string, ExhibitionTarget>
> {
  const rows = await db
    .select({
      id: exhibitions.id,
      slug: exhibitions.slug,
      status: exhibitions.status
    })
    .from(exhibitions)

  const map = new Map<string, ExhibitionTarget>()

  for (const row of rows) {
    map.set(row.id, { slug: row.slug, status: row.status })
  }

  return map
}

export type FeedBlock = typeof mediaBlocks.$inferSelect

export async function getPublishedBlocks(): Promise<FeedBlock[]> {
  const rows = await db
    .select()
    .from(mediaBlocks)
    .where(eq(mediaBlocks.isPublished, true))
    .orderBy(asc(mediaBlocks.position))

  return rows
}

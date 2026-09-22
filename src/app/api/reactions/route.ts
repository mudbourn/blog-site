import { NextRequest, NextResponse } from "next/server"

import { addReaction, SURFACE_TYPES } from "@/lib/reactions"
import { getReactionEmojiSet } from "@/lib/site"

export const dynamic = "force-dynamic"

// Resolves the client IP from proxy headers, falling back to a shared bucket
function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")

  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }

  return req.headers.get("x-real-ip") ?? "0.0.0.0"
}

export async function POST(req: NextRequest) {
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "invalid body", code: "invalid_body" },
      { status: 422 }
    )
  }

  const { surface_type, surface_id, emoji } = (body ?? {}) as Record<
    string,
    unknown
  >

  if (
    typeof surface_type !== "string" ||
    !SURFACE_TYPES.includes(surface_type) ||
    typeof surface_id !== "string" ||
    surface_id.length === 0 ||
    typeof emoji !== "string" ||
    emoji.length === 0
  ) {
    return NextResponse.json(
      { error: "invalid fields", code: "invalid_fields" },
      { status: 422 }
    )
  }

  const emojiSet = await getReactionEmojiSet()

  if (!emojiSet.includes(emoji)) {
    return NextResponse.json(
      { error: "unknown emoji", code: "invalid_emoji" },
      { status: 422 }
    )
  }

  const allowed = await addReaction({
    surfaceType: surface_type,
    surfaceId: surface_id,
    emoji,
    ip: clientIp(req)
  })

  if (!allowed) {
    return NextResponse.json(
      { error: "rate limited", code: "rate_limited" },
      { status: 429 }
    )
  }

  return NextResponse.json({ ok: true })
}

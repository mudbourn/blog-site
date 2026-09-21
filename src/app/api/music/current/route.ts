import { NextResponse } from "next/server"

import { getQueue, isConfigured } from "@/lib/navidrome/client"
import { getMusicQueueSource } from "@/lib/site"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ track: null, queue_index: 0, queue_length: 0 })
  }

  const source = await getMusicQueueSource()

  const tracks = await getQueue(source)

  return NextResponse.json({
    track: tracks[0] ?? null,
    queue_index: 0,
    queue_length: tracks.length
  })
}

import { NextResponse } from "next/server"

import { getQueue, isConfigured } from "@/lib/navidrome/client"
import { getMusicQueueSource } from "@/lib/site"

export const dynamic = "force-dynamic"

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ tracks: [], source: "random" })
  }

  const source = await getMusicQueueSource()

  const tracks = await getQueue(source)

  return NextResponse.json({ tracks, source })
}

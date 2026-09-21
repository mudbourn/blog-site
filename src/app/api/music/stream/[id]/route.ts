import { NextRequest, NextResponse } from "next/server"

import { buildRestUrl, isConfigured } from "@/lib/navidrome/client"

export const dynamic = "force-dynamic"

const UNAVAILABLE = "[STREAM UNAVAILABLE]"

// Range-aware audio proxy that never buffers the whole file
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!isConfigured()) {
    return new NextResponse(UNAVAILABLE, { status: 503 })
  }

  const upstreamHeaders = new Headers()

  const range = req.headers.get("range")

  if (range) {
    upstreamHeaders.set("range", range)
  }

  try {
    const upstream = await fetch(
      buildRestUrl("stream", { id, maxBitRate: "320" }),
      {
        headers: upstreamHeaders,
        cache: "no-store"
      }
    )

    if (!upstream.ok && upstream.status !== 206) {
      return new NextResponse(UNAVAILABLE, { status: 502 })
    }

    const outHeaders = new Headers()

    const passthrough = [
      "content-type",
      "content-length",
      "accept-ranges",
      "content-range"
    ]

    for (const name of passthrough) {
      const value = upstream.headers.get(name)

      if (value) {
        outHeaders.set(name, value)
      }
    }

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: outHeaders
    })
  } catch {
    return new NextResponse(UNAVAILABLE, { status: 503 })
  }
}

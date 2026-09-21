import { NextResponse } from "next/server"

import { buildRestUrl, isConfigured } from "@/lib/navidrome/client"

export const dynamic = "force-dynamic"

// Proxies player-sized cover art, 404 so the browser collapses on failure
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  const { albumId } = await params

  if (!isConfigured()) {
    return new NextResponse(null, { status: 404 })
  }

  try {
    const upstream = await fetch(
      buildRestUrl("getCoverArt", { id: albumId, size: "64" }),
      { cache: "no-store" }
    )

    if (!upstream.ok) {
      return new NextResponse(null, { status: 404 })
    }

    const outHeaders = new Headers()

    const contentType = upstream.headers.get("content-type")

    if (contentType) {
      outHeaders.set("content-type", contentType)
    }

    outHeaders.set("cache-control", "public, max-age=3600")

    return new NextResponse(upstream.body, {
      status: 200,
      headers: outHeaders
    })
  } catch {
    return new NextResponse(null, { status: 404 })
  }
}

import { NextResponse } from "next/server"

import { getReactionCounts, SURFACE_TYPES } from "@/lib/reactions"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ surfaceType: string; surfaceId: string }> }
) {
  const { surfaceType, surfaceId } = await params

  if (!SURFACE_TYPES.includes(surfaceType)) {
    return NextResponse.json(
      { error: "unknown surface type", code: "invalid_surface" },
      { status: 422 }
    )
  }

  const counts = await getReactionCounts(surfaceType, surfaceId)

  return NextResponse.json({ counts })
}

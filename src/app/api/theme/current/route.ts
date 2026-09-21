import { NextResponse } from "next/server"

import { getActiveTheme } from "@/lib/theme/active"

export const dynamic = "force-dynamic"

export async function GET() {
  const theme = await getActiveTheme()

  return NextResponse.json({
    preset_id: theme.presetId,
    css_tokens: theme.cssTokens,
    animation_classes: theme.animationClasses
  })
}

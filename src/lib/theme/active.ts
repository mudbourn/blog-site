import { eq } from "drizzle-orm"

import { db } from "@/db"
import { fontRegistry, siteConfig, themePresets } from "@/db/schema"
import {
  buildFontFaces,
  buildThemeClasses,
  buildThemeTokens
} from "@/lib/theme/engine"
import { XEROX_BRUTAL } from "@/lib/theme/presets"
import type { FontVariant, ThemePresetConfig } from "@/lib/theme/types"

export interface ActiveTheme {
  presetId: string | null
  config: ThemePresetConfig
  cssTokens: string
  fontFaces: string
  animationClasses: string[]
}

async function loadFontRegistry(): Promise<Map<string, FontVariant[]>> {
  const rows = await db.select().from(fontRegistry)

  const map = new Map<string, FontVariant[]>()

  for (const row of rows) {
    map.set(row.familyName, row.variants as FontVariant[])
  }

  return map
}

export async function getActiveTheme(): Promise<ActiveTheme> {
  const registry = await loadFontRegistry()

  const activeRows = await db
    .select()
    .from(siteConfig)
    .where(eq(siteConfig.key, "active_theme_preset_id"))

  const activeId = activeRows[0]?.value as string | undefined

  let presetId: string | null = null
  let config: ThemePresetConfig = XEROX_BRUTAL.config

  if (activeId) {
    const presetRows = await db
      .select()
      .from(themePresets)
      .where(eq(themePresets.id, activeId))

    const preset = presetRows[0]

    if (preset) {
      presetId = preset.id
      config = preset.config as ThemePresetConfig
    }
  }

  return {
    presetId,
    config,
    cssTokens: buildThemeTokens(config),
    fontFaces: buildFontFaces(config, registry),
    animationClasses: buildThemeClasses(config)
  }
}

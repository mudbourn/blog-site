import "@/db/env-cli"

import { eq } from "drizzle-orm"

import { db } from "@/db"
import {
  fontRegistry,
  profilePage,
  siteConfig,
  themePresets
} from "@/db/schema"
import { DEFAULT_FONTS } from "@/lib/theme/fonts"
import { SEED_PRESETS } from "@/lib/theme/presets"

const REACTION_EMOJI_SET = [
  "\u{1F525}",
  "\u{1F480}",
  "⚡",
  "\u{1F3B7}",
  "\u{1FA78}"
]

async function seedPresets(): Promise<string> {
  for (const preset of SEED_PRESETS) {
    const existing = await db
      .select()
      .from(themePresets)
      .where(eq(themePresets.name, preset.name))

    if (existing.length === 0) {
      await db.insert(themePresets).values({
        name: preset.name,
        config: preset.config
      })
    }
  }

  const xerox = await db
    .select()
    .from(themePresets)
    .where(eq(themePresets.name, "XEROX BRUTAL"))

  return xerox[0].id
}

async function seedConfig(activeThemePresetId: string): Promise<void> {
  const entries: Array<{ key: string; value: unknown }> = [
    { key: "active_theme_preset_id", value: activeThemePresetId },
    { key: "reaction_emoji_set", value: REACTION_EMOJI_SET },
    { key: "music_queue_source", value: "random" },
    { key: "owner_handle", value: "mudbourn.info" },
    { key: "owner_tagline", value: "a live self-portrait" },
    { key: "owner_avatar_url", value: "" },
    { key: "social_card_url", value: "" },
    { key: "meta_description", value: "" },
    { key: "profile_marginalia_left_url", value: "" },
    { key: "profile_marginalia_right_url", value: "" }
  ]

  for (const entry of entries) {
    await db
      .insert(siteConfig)
      .values(entry)
      .onConflictDoNothing({ target: siteConfig.key })
  }
}

async function seedProfile(): Promise<void> {
  await db
    .insert(profilePage)
    .values({ id: 1 })
    .onConflictDoNothing({ target: profilePage.id })
}

async function seedFonts(): Promise<void> {
  for (const font of DEFAULT_FONTS) {
    await db
      .insert(fontRegistry)
      .values({
        familyName: font.family_name,
        variants: font.variants,
        fileSizeKb: font.file_size_kb
      })
      .onConflictDoNothing({ target: fontRegistry.familyName })
  }
}

async function main(): Promise<void> {
  const activeThemePresetId = await seedPresets()

  await seedConfig(activeThemePresetId)

  await seedProfile()

  await seedFonts()

  console.log("Seed complete")
  console.log(`active_theme_preset_id: ${activeThemePresetId}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

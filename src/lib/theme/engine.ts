import type {
  BracketStyle,
  FontVariant,
  PillarMode,
  ThemePresetConfig
} from "@/lib/theme/types"

const PILLAR_WIDTHS: Record<PillarMode, string> = {
  "9:16": "390px",
  "4:3": "520px",
  "3:2": "560px",
  "1:1": "540px",
  free: "clamp(360px, 40vw, 680px)"
}

const BRACKET_OPEN: Record<BracketStyle, string> = {
  square: "'['",
  angle: "''",
  none: "''"
}

const BRACKET_CLOSE: Record<BracketStyle, string> = {
  square: "']'",
  angle: "''",
  none: "''"
}

export function pillarWidth(mode: PillarMode): string {
  return PILLAR_WIDTHS[mode]
}

export function transitionDuration(config: ThemePresetConfig): string {
  return config.animation_style === "dissolve" ? "100ms" : "0ms"
}

export function buildTokenMap(
  config: ThemePresetConfig
): Record<string, string> {
  return {
    "--color-bg": config.color_background,
    "--color-text": config.color_text_primary,
    "--color-accent": config.color_accent,
    "--color-fringe": config.color_fringe,
    "--color-stamp": config.color_stamp,
    "--color-border": config.color_border,
    "--color-surface-raised": config.color_surface_raised,

    "--font-display": `'${config.font_display_family}', sans-serif`,
    "--font-display-weight": config.font_display_weight,
    "--font-display-transform": config.font_display_transform,
    "--font-display-tracking": config.font_display_tracking,
    "--font-display-size-base": `${config.font_display_size_base}px`,

    "--font-body": `'${config.font_body_family}', monospace`,
    "--font-body-weight": config.font_body_weight,
    "--font-body-size-base": `${config.font_body_size_base}px`,

    "--font-annotation": `'${config.font_annotation_family}', monospace`,
    "--font-annotation-size": `${config.font_annotation_size}px`,
    "--font-annotation-opacity": `${config.font_annotation_opacity}`,

    "--border-radius": config.border_radius,
    "--border-width": config.border_width,
    "--border-fringe-offset": config.border_fringe_offset,
    "--stamp-rotation": config.stamp_rotation,

    "--grain-opacity-pillar": `${config.texture_grain_opacity_pillar}`,
    "--grain-opacity-marginalia": `${config.texture_grain_opacity_marginalia}`,

    "--block-gap": config.block_gap,
    "--section-padding": config.section_padding,

    "--pillar-width": pillarWidth(config.pillar_mode),
    "--side-by-side-split": `${config.side_by_side_split[0]}% ${config.side_by_side_split[1]}%`,

    "--bracket-open": BRACKET_OPEN[config.bracket_style],
    "--bracket-close": BRACKET_CLOSE[config.bracket_style],

    "--transition-duration": transitionDuration(config)
  }
}

export function buildThemeTokens(config: ThemePresetConfig): string {
  const tokens = buildTokenMap(config)

  const lines = Object.entries(tokens).map(
    ([name, value]) => `  ${name}: ${value};`
  )

  return `:root {\n${lines.join("\n")}\n}`
}

export function buildThemeClasses(config: ThemePresetConfig): string[] {
  const classes = [`anim-${config.animation_style}`]

  if (config.texture_scanline_enabled) classes.push("scanlines")

  if (config.header_compact) classes.push("header-compact")

  if (config.animation_status_stagger) classes.push("status-stagger")

  if (config.animation_hover_aberration) classes.push("hover-aberration")

  return classes
}

export function buildFontFaces(
  config: ThemePresetConfig,
  registry: Map<string, FontVariant[]>
): string {
  const families = [
    config.font_display_family,
    config.font_body_family,
    config.font_annotation_family
  ]

  const seen = new Set<string>()
  const blocks: string[] = []

  for (const family of families) {
    if (seen.has(family)) continue

    seen.add(family)

    const variants = registry.get(family)

    if (!variants) continue

    for (const variant of variants) {
      blocks.push(
        [
          "@font-face {",
          `  font-family: '${family}';`,
          `  src: url('/static/fonts/${variant.filename}') format('woff2');`,
          `  font-weight: ${variant.weight};`,
          `  font-style: ${variant.style};`,
          "  font-display: swap;",
          "}"
        ].join("\n")
      )
    }
  }

  return blocks.join("\n\n")
}

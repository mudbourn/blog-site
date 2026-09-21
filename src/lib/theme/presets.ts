import type { ThemePresetConfig } from "@/lib/theme/types"

export interface SeedPreset {
  name: string
  config: ThemePresetConfig
}

export const XEROX_BRUTAL: SeedPreset = {
  name: "XEROX BRUTAL",
  config: {
    pillar_mode: "9:16",
    pillar_gravity: "center",
    side_by_side_split: [55, 45],

    color_background: "#0a0906",
    color_text_primary: "#e8e0d0",
    color_accent: "#c8f000",
    color_fringe: "#00f0ff",
    color_stamp: "#d42b2b",
    color_border: "#e8e0d0",
    color_surface_raised: "#131109",

    font_display_family: "Bebas Neue",
    font_display_weight: "400",
    font_display_transform: "uppercase",
    font_display_tracking: "-0.02em",
    font_display_size_base: 48,

    font_body_family: "IBM Plex Mono",
    font_body_weight: "400",
    font_body_size_base: 14,

    font_annotation_family: "IBM Plex Mono",
    font_annotation_size: 11,
    font_annotation_opacity: 0.7,

    rich_text_bold_enabled: true,
    rich_text_italic_enabled: true,
    rich_text_mix_fonts: true,

    border_radius: "0px",
    border_width: "1px",
    border_fringe_offset: "1px",
    stamp_rotation: "2deg",

    animation_style: "cut",
    animation_status_stagger: true,
    animation_marginalia_swap: "cut",
    animation_hover_aberration: true,

    texture_grain_opacity_pillar: 0.1,
    texture_grain_opacity_marginalia: 0.18,
    texture_scanline_enabled: false,

    block_gap: "0px",
    section_padding: "12px 0",
    header_compact: false,

    bracket_style: "square",
    player_controls_style: "text"
  }
}

export const CHROME_Y2K: SeedPreset = {
  name: "CHROME Y2K",
  config: {
    pillar_mode: "4:3",
    pillar_gravity: "center",
    side_by_side_split: [55, 45],

    color_background: "#050810",
    color_text_primary: "#c8cdd8",
    color_accent: "#ff00cc",
    color_fringe: "#00f0ff",
    color_stamp: "#ff00cc",
    color_border: "#2a3040",
    color_surface_raised: "#0a0e1a",

    font_display_family: "Bebas Neue",
    font_display_weight: "400",
    font_display_transform: "uppercase",
    font_display_tracking: "0em",
    font_display_size_base: 52,

    font_body_family: "IBM Plex Mono",
    font_body_weight: "400",
    font_body_size_base: 14,

    font_annotation_family: "IBM Plex Mono",
    font_annotation_size: 11,
    font_annotation_opacity: 0.65,

    rich_text_bold_enabled: true,
    rich_text_italic_enabled: true,
    rich_text_mix_fonts: false,

    border_radius: "0px",
    border_width: "1px",
    border_fringe_offset: "1px",
    stamp_rotation: "0deg",

    animation_style: "glitch",
    animation_status_stagger: true,
    animation_marginalia_swap: "dissolve",
    animation_hover_aberration: true,

    texture_grain_opacity_pillar: 0.08,
    texture_grain_opacity_marginalia: 0.12,
    texture_scanline_enabled: true,

    block_gap: "2px",
    section_padding: "10px 0",
    header_compact: true,

    bracket_style: "square",
    player_controls_style: "text"
  }
}

export const UNDERGROUND_PRESS: SeedPreset = {
  name: "UNDERGROUND PRESS",
  config: {
    pillar_mode: "3:2",
    pillar_gravity: "left",
    side_by_side_split: [55, 45],

    color_background: "#f0e8d8",
    color_text_primary: "#1a140a",
    color_accent: "#c41a1a",
    color_fringe: "#c41a1a",
    color_stamp: "#c41a1a",
    color_border: "#1a140a",
    color_surface_raised: "#e4dcc8",

    font_display_family: "Bebas Neue",
    font_display_weight: "400",
    font_display_transform: "uppercase",
    font_display_tracking: "0.02em",
    font_display_size_base: 56,

    font_body_family: "IBM Plex Mono",
    font_body_weight: "400",
    font_body_size_base: 14,

    font_annotation_family: "IBM Plex Mono",
    font_annotation_size: 10,
    font_annotation_opacity: 0.6,

    rich_text_bold_enabled: true,
    rich_text_italic_enabled: true,
    rich_text_mix_fonts: false,

    border_radius: "0px",
    border_width: "2px",
    border_fringe_offset: "0px",
    stamp_rotation: "3deg",

    animation_style: "cut",
    animation_status_stagger: true,
    animation_marginalia_swap: "cut",
    animation_hover_aberration: false,

    texture_grain_opacity_pillar: 0.18,
    texture_grain_opacity_marginalia: 0.25,
    texture_scanline_enabled: false,

    block_gap: "0px",
    section_padding: "14px 0",
    header_compact: false,

    bracket_style: "none",
    player_controls_style: "text"
  }
}

export const PASTEL_GHOST: SeedPreset = {
  name: "PASTEL GHOST",
  config: {
    pillar_mode: "9:16",
    pillar_gravity: "center",
    side_by_side_split: [50, 50],

    color_background: "#e8e4f0",
    color_text_primary: "#f8f6ff",
    color_accent: "#f0eef8",
    color_fringe: "#d8d0f0",
    color_stamp: "#b8b0d0",
    color_border: "#d0cce8",
    color_surface_raised: "#ddd8ec",

    font_display_family: "Bebas Neue",
    font_display_weight: "400",
    font_display_transform: "uppercase",
    font_display_tracking: "0.05em",
    font_display_size_base: 44,

    font_body_family: "IBM Plex Mono",
    font_body_weight: "400",
    font_body_size_base: 13,

    font_annotation_family: "IBM Plex Mono",
    font_annotation_size: 10,
    font_annotation_opacity: 0.5,

    rich_text_bold_enabled: true,
    rich_text_italic_enabled: true,
    rich_text_mix_fonts: false,

    border_radius: "0px",
    border_width: "1px",
    border_fringe_offset: "0px",
    stamp_rotation: "0deg",

    animation_style: "dissolve",
    animation_status_stagger: false,
    animation_marginalia_swap: "dissolve",
    animation_hover_aberration: false,

    texture_grain_opacity_pillar: 0.25,
    texture_grain_opacity_marginalia: 0.3,
    texture_scanline_enabled: false,

    block_gap: "4px",
    section_padding: "16px 0",
    header_compact: false,

    bracket_style: "angle",
    player_controls_style: "text"
  }
}

export const SEED_PRESETS: SeedPreset[] = [
  XEROX_BRUTAL,
  CHROME_Y2K,
  UNDERGROUND_PRESS,
  PASTEL_GHOST
]

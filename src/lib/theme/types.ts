export type PillarMode = "9:16" | "4:3" | "3:2" | "1:1" | "free"

export type PillarGravity = "center" | "left" | "right"

export type DisplayTransform = "uppercase" | "none"

export type AnimationStyle = "cut" | "glitch" | "dissolve" | "none"

export type MarginaliaSwap = "cut" | "dissolve"

export type BracketStyle = "square" | "angle" | "none"

export type PlayerControlsStyle = "text" | "icon"

export interface ThemePresetConfig {
  pillar_mode: PillarMode
  pillar_gravity: PillarGravity
  side_by_side_split: [number, number]

  color_background: string
  color_text_primary: string
  color_accent: string
  color_fringe: string
  color_stamp: string
  color_border: string
  color_surface_raised: string

  font_display_family: string
  font_display_weight: string
  font_display_transform: DisplayTransform
  font_display_tracking: string
  font_display_size_base: number

  font_body_family: string
  font_body_weight: string
  font_body_size_base: number

  font_annotation_family: string
  font_annotation_size: number
  font_annotation_opacity: number

  rich_text_bold_enabled: boolean
  rich_text_italic_enabled: boolean
  rich_text_mix_fonts: boolean

  border_radius: string
  border_width: string
  border_fringe_offset: string
  stamp_rotation: string

  animation_style: AnimationStyle
  animation_status_stagger: boolean
  animation_marginalia_swap: MarginaliaSwap
  animation_hover_aberration: boolean

  texture_grain_opacity_pillar: number
  texture_grain_opacity_marginalia: number
  texture_scanline_enabled: boolean

  block_gap: string
  section_padding: string
  header_compact: boolean

  bracket_style: BracketStyle
  player_controls_style: PlayerControlsStyle
}

export interface ThemePreset extends ThemePresetConfig {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface FontVariant {
  weight: string
  style: string
  filename: string
}

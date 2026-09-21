export interface SfxPaths {
  ogg: string
  mp3: string
}

// Preloadable UI sound clips, ogg primary and mp3 fallback
export const SFX_CLIPS = {
  nav_hover: {
    ogg: "/static/sfx/nav-hover.ogg",
    mp3: "/static/sfx/nav-hover.mp3"
  },
  nav_click: {
    ogg: "/static/sfx/nav-click.ogg",
    mp3: "/static/sfx/nav-click.mp3"
  },
  exhibition_enter: {
    ogg: "/static/sfx/exhibition-enter.ogg",
    mp3: "/static/sfx/exhibition-enter.mp3"
  },
  exhibition_close: {
    ogg: "/static/sfx/exhibition-close.ogg",
    mp3: "/static/sfx/exhibition-close.mp3"
  },
  menu_open: {
    ogg: "/static/sfx/menu-open.ogg",
    mp3: "/static/sfx/menu-open.mp3"
  },
  menu_close: {
    ogg: "/static/sfx/menu-close.ogg",
    mp3: "/static/sfx/menu-close.mp3"
  },
  reaction_add: {
    ogg: "/static/sfx/reaction-add.ogg",
    mp3: "/static/sfx/reaction-add.mp3"
  },
  reaction_remove: {
    ogg: "/static/sfx/reaction-remove.ogg",
    mp3: "/static/sfx/reaction-remove.mp3"
  },
  reaction_pitch: {
    ogg: "/static/sfx/reaction-pitch.ogg",
    mp3: "/static/sfx/reaction-pitch.mp3"
  },
  status_expand: {
    ogg: "/static/sfx/status-expand.ogg",
    mp3: "/static/sfx/status-expand.mp3"
  },
  block_enter: {
    ogg: "/static/sfx/block-enter.ogg",
    mp3: "/static/sfx/block-enter.mp3"
  },
  track_advance: {
    ogg: "/static/sfx/track-advance.ogg",
    mp3: "/static/sfx/track-advance.mp3"
  },
  player_play: {
    ogg: "/static/sfx/player-play.ogg",
    mp3: "/static/sfx/player-play.mp3"
  },
  player_pause: {
    ogg: "/static/sfx/player-pause.ogg",
    mp3: "/static/sfx/player-pause.mp3"
  },
  publish: {
    ogg: "/static/sfx/publish.ogg",
    mp3: "/static/sfx/publish.mp3"
  },
  theme_change: {
    ogg: "/static/sfx/theme-change.ogg",
    mp3: "/static/sfx/theme-change.mp3"
  },
  volume_click: {
    ogg: "/static/sfx/volume-click.ogg",
    mp3: "/static/sfx/volume-click.mp3"
  }
} satisfies Record<string, SfxPaths>

export type SfxName = keyof typeof SFX_CLIPS

import { sql } from "drizzle-orm"
import {
  bigserial,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core"

export const statuses = pgTable(
  "statuses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    text: text("text").notNull(),
    isLive: boolean("is_live").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    index("statuses_is_live_idx")
      .on(table.isLive)
      .where(sql`${table.isLive} = TRUE`),
    index("statuses_created_at_idx").on(table.createdAt.desc())
  ]
)

export const exhibitions = pgTable(
  "exhibitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    openingNote: text("opening_note"),
    heroUrl: text("hero_url").notNull(),
    heroType: text("hero_type").notNull().default("image"),
    heroPosterUrl: text("hero_poster_url"),
    marginaliaLeftUrl: text("marginalia_left_url"),
    marginaliaRightUrl: text("marginalia_right_url"),
    status: text("status").notNull().default("open"),
    openedAt: timestamp("opened_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    closedAt: timestamp("closed_at", { withTimezone: true })
  },
  (table) => [
    check(
      "exhibitions_hero_type_check",
      sql`${table.heroType} IN ('image','video')`
    ),
    check(
      "exhibitions_status_check",
      sql`${table.status} IN ('open','closed')`
    ),
    index("exhibitions_status_idx")
      .on(table.status)
      .where(sql`${table.status} = 'open'`),
    uniqueIndex("exhibitions_slug_idx").on(table.slug)
  ]
)

export const mediaBlocks = pgTable(
  "media_blocks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    position: integer("position").notNull(),
    blockType: text("block_type").notNull(),
    mediaUrl: text("media_url"),
    mediaType: text("media_type"),
    mediaUrls: text("media_urls").array(),
    mediaAlt: text("media_alt"),
    mediaPosterUrl: text("media_poster_url"),
    gridAspectRatio: text("grid_aspect_ratio").default("1/1"),
    headline: text("headline"),
    bodyText: text("body_text"),
    layoutMode: text("layout_mode").notNull().default("media-first"),
    overlayPosition: text("overlay_position").default("bottom"),
    pillarGravityOverride: text("pillar_gravity_override").default("theme"),
    exhibitionId: uuid("exhibition_id").references(() => exhibitions.id, {
      onDelete: "set null"
    }),
    portalHeroUrl: text("portal_hero_url"),
    portalHeroType: text("portal_hero_type").default("image"),
    portalHeroPosterUrl: text("portal_hero_poster_url"),
    portalTeaser: text("portal_teaser"),
    portalExhibitionTitleCache: text("portal_exhibition_title_cache"),
    portalTitleOverlay: boolean("portal_title_overlay")
      .notNull()
      .default(false),
    marginaliaLeftUrl: text("marginalia_left_url"),
    marginaliaRightUrl: text("marginalia_right_url"),
    isPublished: boolean("is_published").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    publishedAt: timestamp("published_at", { withTimezone: true })
  },
  (table) => [
    check(
      "media_blocks_block_type_check",
      sql`${table.blockType} IN ('media','portal')`
    ),
    check(
      "media_blocks_media_type_check",
      sql`${table.mediaType} IN ('image','video','grid')`
    ),
    check(
      "media_blocks_layout_mode_check",
      sql`${table.layoutMode} IN ('media-first','text-first','side-by-side-media-left','side-by-side-text-left','overlay')`
    ),
    check(
      "media_blocks_overlay_position_check",
      sql`${table.overlayPosition} IN ('bottom','top','center')`
    ),
    check(
      "media_blocks_pillar_gravity_override_check",
      sql`${table.pillarGravityOverride} IN ('theme','center','left','right')`
    ),
    check(
      "media_blocks_portal_hero_type_check",
      sql`${table.portalHeroType} IN ('image','video')`
    ),
    index("media_blocks_position_idx")
      .on(table.position)
      .where(sql`${table.isPublished} = TRUE`),
    index("media_blocks_exhibition_id_idx")
      .on(table.exhibitionId)
      .where(sql`${table.blockType} = 'portal'`)
  ]
)

export const closedExhibitions = pgTable("closed_exhibitions", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  closedAt: timestamp("closed_at", { withTimezone: true })
    .notNull()
    .defaultNow()
})

export const exhibitionZones = pgTable(
  "exhibition_zones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    exhibitionId: uuid("exhibition_id")
      .notNull()
      .references(() => exhibitions.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    zoneType: text("zone_type").notNull(),
    content: jsonb("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check(
      "exhibition_zones_zone_type_check",
      sql`${table.zoneType} IN ('image','video','grid','text','divider','link')`
    ),
    index("exhibition_zones_exhibition_position_idx").on(
      table.exhibitionId,
      table.position
    )
  ]
)

export const reactions = pgTable(
  "reactions",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey(),
    surfaceType: text("surface_type").notNull(),
    surfaceId: text("surface_id").notNull(),
    emoji: text("emoji").notNull(),
    ipHash: text("ip_hash").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow()
  },
  (table) => [
    check(
      "reactions_surface_type_check",
      sql`${table.surfaceType} IN ('status','media_block','track','exhibition')`
    ),
    index("reactions_surface_idx").on(
      table.surfaceType,
      table.surfaceId,
      table.emoji
    ),
    index("reactions_ip_hash_idx").on(
      table.ipHash,
      table.surfaceId,
      table.createdAt
    ),
    index("reactions_created_at_idx").on(table.createdAt)
  ]
)

export const siteConfig = pgTable("site_config", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
})

export const hamburgerLinks = pgTable(
  "hamburger_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    zone: text("zone").notNull(),
    position: integer("position").notNull(),
    label: text("label").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    newTab: boolean("new_tab").notNull().default(true)
  },
  (table) => [
    check(
      "hamburger_links_zone_check",
      sql`${table.zone} IN ('platforms','projects')`
    ),
    index("hamburger_links_zone_position_idx").on(table.zone, table.position)
  ]
)

export const profilePage = pgTable("profile_page", {
  id: integer("id").primaryKey().default(1),
  bioMarkdown: text("bio_markdown"),
  techStack: jsonb("tech_stack"),
  projects: jsonb("projects"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
})

export const pages = pgTable("pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  bodyMarkdown: text("body_markdown"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
})

export const adminSessions = pgTable(
  "admin_sessions",
  {
    token: text("token").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull()
  },
  (table) => [index("admin_sessions_expires_at_idx").on(table.expiresAt)]
)

export const themePresets = pgTable("theme_presets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
})

export const fontRegistry = pgTable("font_registry", {
  id: uuid("id").primaryKey().defaultRandom(),
  familyName: text("family_name").notNull().unique(),
  variants: jsonb("variants").notNull(),
  fileSizeKb: integer("file_size_kb"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true })
    .notNull()
    .defaultNow()
})

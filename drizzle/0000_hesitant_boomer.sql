CREATE TABLE IF NOT EXISTS "admin_sessions" (
	"token" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "closed_exhibitions" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"closed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exhibition_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exhibition_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"zone_type" text NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "exhibition_zones_zone_type_check" CHECK ("exhibition_zones"."zone_type" IN ('image','video','grid','text','divider','link'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exhibitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"opening_note" text,
	"hero_url" text NOT NULL,
	"hero_type" text DEFAULT 'image' NOT NULL,
	"hero_poster_url" text,
	"marginalia_left_url" text,
	"marginalia_right_url" text,
	"status" text DEFAULT 'open' NOT NULL,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone,
	CONSTRAINT "exhibitions_slug_unique" UNIQUE("slug"),
	CONSTRAINT "exhibitions_hero_type_check" CHECK ("exhibitions"."hero_type" IN ('image','video')),
	CONSTRAINT "exhibitions_status_check" CHECK ("exhibitions"."status" IN ('open','closed'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "font_registry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"family_name" text NOT NULL,
	"variants" jsonb NOT NULL,
	"file_size_kb" integer,
	"uploaded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "font_registry_family_name_unique" UNIQUE("family_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hamburger_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"zone" text NOT NULL,
	"position" integer NOT NULL,
	"label" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"new_tab" boolean DEFAULT true NOT NULL,
	CONSTRAINT "hamburger_links_zone_check" CHECK ("hamburger_links"."zone" IN ('platforms','projects'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"position" integer NOT NULL,
	"block_type" text NOT NULL,
	"media_url" text,
	"media_type" text,
	"media_urls" text[],
	"media_alt" text,
	"media_poster_url" text,
	"grid_aspect_ratio" text DEFAULT '1/1',
	"headline" text,
	"body_text" text,
	"layout_mode" text DEFAULT 'media-first' NOT NULL,
	"overlay_position" text DEFAULT 'bottom',
	"pillar_gravity_override" text DEFAULT 'theme',
	"exhibition_id" uuid,
	"portal_hero_url" text,
	"portal_hero_type" text DEFAULT 'image',
	"portal_hero_poster_url" text,
	"portal_teaser" text,
	"portal_exhibition_title_cache" text,
	"portal_title_overlay" boolean DEFAULT false NOT NULL,
	"marginalia_left_url" text,
	"marginalia_right_url" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"published_at" timestamp with time zone,
	CONSTRAINT "media_blocks_block_type_check" CHECK ("media_blocks"."block_type" IN ('media','portal')),
	CONSTRAINT "media_blocks_media_type_check" CHECK ("media_blocks"."media_type" IN ('image','video','grid')),
	CONSTRAINT "media_blocks_layout_mode_check" CHECK ("media_blocks"."layout_mode" IN ('media-first','text-first','side-by-side-media-left','side-by-side-text-left','overlay')),
	CONSTRAINT "media_blocks_overlay_position_check" CHECK ("media_blocks"."overlay_position" IN ('bottom','top','center')),
	CONSTRAINT "media_blocks_pillar_gravity_override_check" CHECK ("media_blocks"."pillar_gravity_override" IN ('theme','center','left','right')),
	CONSTRAINT "media_blocks_portal_hero_type_check" CHECK ("media_blocks"."portal_hero_type" IN ('image','video'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"body_markdown" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_page" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"bio_markdown" text,
	"tech_stack" jsonb,
	"projects" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"surface_type" text NOT NULL,
	"surface_id" text NOT NULL,
	"emoji" text NOT NULL,
	"ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reactions_surface_type_check" CHECK ("reactions"."surface_type" IN ('status','media_block','track','exhibition'))
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_config" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "statuses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"is_live" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "theme_presets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"config" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exhibition_zones" ADD CONSTRAINT "exhibition_zones_exhibition_id_exhibitions_id_fk" FOREIGN KEY ("exhibition_id") REFERENCES "public"."exhibitions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media_blocks" ADD CONSTRAINT "media_blocks_exhibition_id_exhibitions_id_fk" FOREIGN KEY ("exhibition_id") REFERENCES "public"."exhibitions"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_sessions_expires_at_idx" ON "admin_sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exhibition_zones_exhibition_position_idx" ON "exhibition_zones" USING btree ("exhibition_id","position");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "exhibitions_status_idx" ON "exhibitions" USING btree ("status") WHERE "exhibitions"."status" = 'open';--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "exhibitions_slug_idx" ON "exhibitions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hamburger_links_zone_position_idx" ON "hamburger_links" USING btree ("zone","position");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_blocks_position_idx" ON "media_blocks" USING btree ("position") WHERE "media_blocks"."is_published" = TRUE;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_blocks_exhibition_id_idx" ON "media_blocks" USING btree ("exhibition_id") WHERE "media_blocks"."block_type" = 'portal';--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reactions_surface_idx" ON "reactions" USING btree ("surface_type","surface_id","emoji");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reactions_ip_hash_idx" ON "reactions" USING btree ("ip_hash","surface_id","created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reactions_created_at_idx" ON "reactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statuses_is_live_idx" ON "statuses" USING btree ("is_live") WHERE "statuses"."is_live" = TRUE;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statuses_created_at_idx" ON "statuses" USING btree ("created_at" DESC NULLS LAST);
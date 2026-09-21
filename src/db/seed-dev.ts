import "@/db/env-cli"

import { eq } from "drizzle-orm"

import { db } from "@/db"
import { hamburgerLinks, mediaBlocks, statuses } from "@/db/schema"

const DEV = "/static/dev"

async function seedStatus(): Promise<void> {
  const existing = await db
    .select()
    .from(statuses)
    .where(eq(statuses.isLive, true))

  if (existing.length > 0) return

  await db.insert(statuses).values({
    text: "building the feed in the present tense",
    isLive: true
  })
}

async function seedLinks(): Promise<void> {
  const existing = await db.select().from(hamburgerLinks)

  if (existing.length > 0) return

  await db.insert(hamburgerLinks).values([
    {
      zone: "platforms",
      position: 0,
      label: "bandcamp",
      url: "https://bandcamp.com",
      description: null,
      newTab: true
    },
    {
      zone: "platforms",
      position: 1,
      label: "github",
      url: "https://github.com",
      description: null,
      newTab: true
    },
    {
      zone: "projects",
      position: 0,
      label: "mudscript",
      url: "https://example.com/mudscript",
      description: "a scripting layer for slide calibration",
      newTab: true
    },
    {
      zone: "projects",
      position: 1,
      label: "field recordings",
      url: "https://example.com/field",
      description: "ambient captures, weekly",
      newTab: true
    }
  ])
}

async function seedBlocks(): Promise<void> {
  const existing = await db.select().from(mediaBlocks)

  if (existing.length > 0) return

  await db.insert(mediaBlocks).values([
    {
      position: 0,
      blockType: "media",
      mediaType: "image",
      mediaUrl: `${DEV}/image-a.svg`,
      mediaAlt: "acid gradient plate A",
      headline: "first light",
      bodyText: "media-first layout. the image leads, the words follow.",
      layoutMode: "media-first",
      marginaliaLeftUrl: `${DEV}/marg-left.svg`,
      marginaliaRightUrl: `${DEV}/marg-right.svg`,
      isPublished: true,
      publishedAt: new Date()
    },
    {
      position: 1,
      blockType: "media",
      mediaType: "grid",
      mediaUrls: [
        `${DEV}/grid-1.svg`,
        `${DEV}/grid-2.svg`,
        `${DEV}/grid-3.svg`,
        `${DEV}/grid-4.svg`
      ],
      gridAspectRatio: "1/1",
      mediaAlt: "four panel contact sheet",
      headline: "contact sheet",
      bodyText: "a four up grid, cells cropped to fill.",
      layoutMode: "text-first",
      isPublished: true,
      publishedAt: new Date()
    },
    {
      position: 2,
      blockType: "media",
      mediaType: "image",
      mediaUrl: `${DEV}/image-b.svg`,
      mediaAlt: "tall stamp plate B",
      headline: "side channel",
      bodyText: "text sits beside the media at wider pillars.",
      layoutMode: "side-by-side-media-left",
      isPublished: true,
      publishedAt: new Date()
    },
    {
      position: 3,
      blockType: "media",
      mediaType: "image",
      mediaUrl: `${DEV}/overlay.svg`,
      mediaAlt: "overlay plate",
      headline: "over the top",
      bodyText: "scrim rises from the bottom edge.",
      layoutMode: "overlay",
      overlayPosition: "bottom",
      isPublished: true,
      publishedAt: new Date()
    }
  ])
}

async function main(): Promise<void> {
  await seedStatus()

  await seedLinks()

  await seedBlocks()

  console.log("Dev seed complete")
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })

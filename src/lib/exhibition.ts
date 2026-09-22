import { asc, eq } from "drizzle-orm"

import { db } from "@/db"
import { closedExhibitions, exhibitions, exhibitionZones } from "@/db/schema"

export type Exhibition = typeof exhibitions.$inferSelect

export type ExhibitionZone = typeof exhibitionZones.$inferSelect

export type ClosedExhibition = typeof closedExhibitions.$inferSelect

export interface ExhibitionPage {
  exhibition: Exhibition
  zones: ExhibitionZone[]
}

export async function getExhibitionBySlug(
  slug: string
): Promise<ExhibitionPage | null> {
  const rows = await db
    .select()
    .from(exhibitions)
    .where(eq(exhibitions.slug, slug))
    .limit(1)

  const exhibition = rows[0]

  if (!exhibition) return null

  const zones = await db
    .select()
    .from(exhibitionZones)
    .where(eq(exhibitionZones.exhibitionId, exhibition.id))
    .orderBy(asc(exhibitionZones.position))

  return {
    exhibition,
    zones
  }
}

export async function getClosedExhibition(
  slug: string
): Promise<ClosedExhibition | null> {
  const rows = await db
    .select()
    .from(closedExhibitions)
    .where(eq(closedExhibitions.slug, slug))
    .limit(1)

  return rows[0] ?? null
}

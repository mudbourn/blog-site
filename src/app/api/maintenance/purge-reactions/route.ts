import { NextRequest, NextResponse } from "next/server"

import { sql } from "drizzle-orm"

import { db } from "@/db"

export const dynamic = "force-dynamic"

// OS-cron fallback for the pg_cron purge in src/db/purge-reactions.sql
export async function POST(req: NextRequest) {
  const token = process.env.MAINTENANCE_TOKEN

  if (!token || req.headers.get("x-maintenance-token") !== token) {
    return NextResponse.json(
      { error: "unauthorized", code: "unauthorized" },
      { status: 401 }
    )
  }

  const result = await db.execute(sql`
    DELETE FROM reactions
    WHERE created_at < NOW() - INTERVAL '30 days'
      AND NOT EXISTS (
        SELECT 1 FROM media_blocks WHERE id::text = reactions.surface_id AND is_published = TRUE
        UNION ALL
        SELECT 1 FROM statuses     WHERE id::text = reactions.surface_id AND is_live = TRUE
        UNION ALL
        SELECT 1 FROM exhibitions  WHERE id::text = reactions.surface_id AND status = 'open'
      )
  `)

  return NextResponse.json({ ok: true, purged: result.rowCount ?? 0 })
}

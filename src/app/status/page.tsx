import Link from "next/link"

import { Header } from "@/ui/Header"
import { Marginalia } from "@/ui/Marginalia"
import { NavLabel } from "@/ui/NavLabel"
import { TextureLayer } from "@/ui/TextureLayer"
import { getActiveTheme } from "@/lib/theme/active"
import {
  getHamburgerLinks,
  getLiveStatus,
  getOpenExhibitions,
  getSiteIdentity,
  getStatusArchive
} from "@/lib/site"

export const dynamic = "force-dynamic"

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
})

const timeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit"
})

function stamp(value: Date): string {
  return dateFormat.format(value) + " at " + timeFormat.format(value)
}

export default async function StatusArchivePage() {
  const [theme, identity, status, links, openExhibitions, archive] =
    await Promise.all([
      getActiveTheme(),
      getSiteIdentity(),
      getLiveStatus(),
      getHamburgerLinks(),
      getOpenExhibitions(),
      getStatusArchive()
    ])

  const bracketStyle = theme.config.bracket_style

  const gravity = theme.config.pillar_gravity

  return (
    <div className="site-shell" data-pillar-gravity={gravity}>
      <TextureLayer />

      <Marginalia
        gravity={gravity}
        swap={theme.config.animation_marginalia_swap}
      />

      <main className="pillar">
        <Header
          identity={identity}
          statusText={status?.text ?? null}
          links={links}
          exhibitions={openExhibitions}
          bracketStyle={bracketStyle}
        />

        <section className="status-archive">
          <div className="status-archive-head">
            <h1 className="status-archive-title">status archive</h1>

            <Link href="/" className="status-archive-back">
              <NavLabel bracketStyle={bracketStyle}>home</NavLabel>
            </Link>
          </div>

          {archive.length === 0 ? (
            <p className="status-empty-note">no status yet</p>
          ) : (
            <ol className="status-archive-list">
              {archive.map((entry) => (
                <li
                  key={entry.id}
                  className="status-archive-item"
                  data-live={entry.isLive ? "true" : undefined}
                >
                  <p className="status-archive-text">{entry.text}</p>

                  <div className="status-archive-meta">
                    <time dateTime={entry.createdAt.toISOString()}>
                      {stamp(entry.createdAt)}
                    </time>

                    {entry.isLive ? (
                      <span className="status-archive-live">live</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  )
}

import { notFound } from "next/navigation"

import { Header } from "@/ui/Header"
import { Marginalia } from "@/ui/Marginalia"
import { Player } from "@/ui/player/Player"
import { TextureLayer } from "@/ui/TextureLayer"
import { VideoMedia } from "@/ui/VideoMedia"
import { ExhibitionZone } from "@/ui/ExhibitionZone"
import { ReactionStrip } from "@/ui/ReactionStrip"
import { getActiveTheme } from "@/lib/theme/active"
import { getExhibitionBySlug, getClosedExhibition } from "@/lib/exhibition"
import type { Exhibition } from "@/lib/exhibition"
import {
  getHamburgerLinks,
  getLiveStatus,
  getOpenExhibitions,
  getReactionEmojiSet,
  getSiteIdentity
} from "@/lib/site"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatClosingDate(date: Date | null): string | null {
  if (!date) return null

  return date.toISOString().slice(0, 10)
}

function ExhibitionHero({ exhibition }: { exhibition: Exhibition }) {
  if (exhibition.heroType === "video") {
    return (
      <VideoMedia
        src={exhibition.heroUrl}
        poster={exhibition.heroPosterUrl}
        alt={exhibition.title}
      />
    )
  }

  return (
    <div className="block-media block-media-image">
      <img
        src={exhibition.heroUrl}
        alt={exhibition.title}
        className="media-image"
        loading="eager"
      />
    </div>
  )
}

async function Shell({
  children,
  marginaliaLeft,
  marginaliaRight
}: {
  children: React.ReactNode
  marginaliaLeft: string | null
  marginaliaRight: string | null
}) {
  const [theme, identity, status, links, openExhibitions, emojiSet] =
    await Promise.all([
      getActiveTheme(),
      getSiteIdentity(),
      getLiveStatus(),
      getHamburgerLinks(),
      getOpenExhibitions(),
      getReactionEmojiSet()
    ])

  const gravity = theme.config.pillar_gravity

  const bracketStyle = theme.config.bracket_style

  return (
    <div className="site-shell" data-pillar-gravity={gravity}>
      <TextureLayer />

      <Marginalia
        gravity={gravity}
        swap={theme.config.animation_marginalia_swap}
        initialLeft={marginaliaLeft ?? undefined}
        initialRight={marginaliaRight ?? undefined}
      />

      <main className="pillar">
        <Header
          identity={identity}
          statusText={status?.text ?? null}
          links={links}
          exhibitions={openExhibitions}
          bracketStyle={bracketStyle}
        />

        {children}
      </main>

      <Player emojiSet={emojiSet} />
    </div>
  )
}

function Tombstone({
  title,
  closedAt
}: {
  title: string
  closedAt: Date | null
}) {
  const closingDate = formatClosingDate(closedAt)

  return (
    <article className="exhibition-tombstone">
      <span className="stamp stamp-closed tombstone-page-stamp">
        THIS EXHIBITION HAS CLOSED
      </span>

      <span className="tombstone-page-title">{title}</span>

      {closingDate ? (
        <span className="tombstone-page-date">{closingDate}</span>
      ) : null}
    </article>
  )
}

export default async function ExhibitionPage({ params }: PageProps) {
  const { slug } = await params

  const page = await getExhibitionBySlug(slug)

  if (!page) {
    const closed = await getClosedExhibition(slug)

    if (!closed) {
      notFound()
    }

    return (
      <Shell marginaliaLeft={null} marginaliaRight={null}>
        <Tombstone title={closed.title} closedAt={closed.closedAt} />
      </Shell>
    )
  }

  const { exhibition, zones } = page

  if (exhibition.status !== "open") {
    return (
      <Shell
        marginaliaLeft={exhibition.marginaliaLeftUrl}
        marginaliaRight={exhibition.marginaliaRightUrl}
      >
        <Tombstone title={exhibition.title} closedAt={exhibition.closedAt} />
      </Shell>
    )
  }

  const [theme, emojiSet] = await Promise.all([
    getActiveTheme(),
    getReactionEmojiSet()
  ])

  const bracketStyle = theme.config.bracket_style

  const richTextRules = {
    boldEnabled: theme.config.rich_text_bold_enabled,
    italicEnabled: theme.config.rich_text_italic_enabled,
    mixFonts: theme.config.rich_text_mix_fonts
  }

  return (
    <Shell
      marginaliaLeft={exhibition.marginaliaLeftUrl}
      marginaliaRight={exhibition.marginaliaRightUrl}
    >
      <article className="exhibition" data-exhibition-slug={exhibition.slug}>
        <h1 className="exhibition-title">{exhibition.title}</h1>

        {exhibition.openingNote ? (
          <p className="exhibition-opening-note">{exhibition.openingNote}</p>
        ) : null}

        <div className="exhibition-hero">
          <ExhibitionHero exhibition={exhibition} />
        </div>

        <div className="exhibition-zones">
          {zones.map((zone) => (
            <ExhibitionZone
              key={zone.id}
              zone={zone}
              bracketStyle={bracketStyle}
              richTextRules={richTextRules}
            />
          ))}
        </div>

        <ReactionStrip
          emojiSet={emojiSet}
          surfaceType="exhibition"
          surfaceId={exhibition.id}
        />
      </article>
    </Shell>
  )
}

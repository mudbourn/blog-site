import Link from "next/link"

import { VideoMedia } from "@/ui/VideoMedia"
import { NavLabel } from "@/ui/NavLabel"
import type { BracketStyle } from "@/lib/theme/types"
import type { FeedBlock } from "@/lib/site"

export interface PortalTarget {
  slug: string
  status: string
}

interface PortalBlockProps {
  block: FeedBlock
  target: PortalTarget | null
  bracketStyle: BracketStyle
}

function PortalHero({ block }: { block: FeedBlock }) {
  if (!block.portalHeroUrl) return null

  if (block.portalHeroType === "video") {
    return (
      <VideoMedia
        src={block.portalHeroUrl}
        poster={block.portalHeroPosterUrl}
        alt={null}
      />
    )
  }

  return (
    <div className="block-media block-media-image">
      <img
        src={block.portalHeroUrl}
        alt=""
        className="media-image"
        loading="lazy"
      />
    </div>
  )
}

// Type B block. Renders the tombstone (spec 4.4) when the target is closed or deleted.
export function PortalBlock({ block, target, bracketStyle }: PortalBlockProps) {
  const title = block.portalExhibitionTitleCache ?? "untitled exhibition"

  const isDead = !target || target.status !== "open"

  if (isDead) {
    return (
      <article
        className="portal-block portal-tombstone"
        data-block="portal"
        data-marginalia-left={block.marginaliaLeftUrl ?? undefined}
        data-marginalia-right={block.marginaliaRightUrl ?? undefined}
      >
        <div className="tombstone-inner">
          <span className="stamp stamp-closed tombstone-stamp">
            THIS EXHIBITION HAS CLOSED
          </span>

          <span className="tombstone-title">{title}</span>
        </div>
      </article>
    )
  }

  return (
    <article
      className={
        block.portalTitleOverlay
          ? "portal-block portal-overlay"
          : "portal-block"
      }
      data-block="portal"
      data-marginalia-left={block.marginaliaLeftUrl ?? undefined}
      data-marginalia-right={block.marginaliaRightUrl ?? undefined}
    >
      <div className="portal-inner">
        <PortalHero block={block} />

        <div className="portal-caption">
          <h2 className="portal-title">{title}</h2>

          {block.portalTeaser ? (
            <p className="portal-teaser">{block.portalTeaser}</p>
          ) : null}

          <Link href={`/x/${target.slug}`} className="portal-entry">
            <NavLabel bracketStyle={bracketStyle}>enter</NavLabel>
          </Link>
        </div>
      </div>
    </article>
  )
}

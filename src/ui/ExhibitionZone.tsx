import Link from "next/link"

import { VideoMedia } from "@/ui/VideoMedia"
import { NavLabel } from "@/ui/NavLabel"
import { RichText, type RichTextRules } from "@/ui/RichText"
import type { BracketStyle } from "@/lib/theme/types"
import type { ExhibitionZone as ZoneRow } from "@/lib/exhibition"

interface ExhibitionZoneProps {
  zone: ZoneRow
  bracketStyle: BracketStyle
  richTextRules: RichTextRules
}

function readString(content: unknown, key: string): string | null {
  if (content && typeof content === "object" && key in content) {
    const value = (content as Record<string, unknown>)[key]

    return typeof value === "string" ? value : null
  }

  return null
}

function readBool(content: unknown, key: string): boolean {
  if (content && typeof content === "object" && key in content) {
    return (content as Record<string, unknown>)[key] === true
  }

  return false
}

function readList(content: unknown, key: string): string[] {
  if (content && typeof content === "object" && key in content) {
    const value = (content as Record<string, unknown>)[key]

    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string")
    }
  }

  return []
}

function ImageZone({ content }: { content: unknown }) {
  const url = readString(content, "url")

  if (!url) return null

  const caption = readString(content, "caption")

  return (
    <figure className="zone-figure">
      <div className="block-media block-media-image">
        <img
          src={url}
          alt={readString(content, "alt") ?? ""}
          className="media-image"
          loading="lazy"
        />
      </div>

      {caption ? (
        <figcaption className="zone-caption">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function VideoZone({ content }: { content: unknown }) {
  const url = readString(content, "url")

  if (!url) return null

  return (
    <div className="zone-figure">
      <VideoMedia
        src={url}
        poster={readString(content, "poster_url")}
        alt={null}
      />
    </div>
  )
}

function GridZone({ content }: { content: unknown }) {
  const urls = readList(content, "urls")

  if (urls.length === 0) return null

  const count = Math.min(4, urls.length)

  const alts = readList(content, "alts")

  const caption = readString(content, "caption")

  return (
    <figure className="zone-figure">
      <div className={`block-media block-media-grid grid-count-${count}`}>
        {urls.slice(0, count).map((url, index) => (
          <div key={index} className="grid-cell">
            <img
              src={url}
              alt={alts[index] ?? ""}
              className="grid-image"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {caption ? (
        <figcaption className="zone-caption">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function TextZone({
  content,
  richTextRules
}: {
  content: unknown
  richTextRules: RichTextRules
}) {
  const markdown = readString(content, "markdown")

  if (!markdown) return null

  return (
    <div className="block-body zone-text">
      <RichText text={markdown} rules={richTextRules} />
    </div>
  )
}

function DividerZone({ content }: { content: unknown }) {
  const style = readString(content, "style") ?? "rule"

  if (style === "noise") {
    return <div className="zone-divider-noise" aria-hidden />
  }

  if (style === "barcode") {
    return (
      <svg
        className="zone-divider-barcode"
        viewBox="0 0 200 24"
        preserveAspectRatio="none"
        aria-hidden
      >
        <rect x="0" y="0" width="3" height="24" />
        <rect x="6" y="0" width="1" height="24" />
        <rect x="10" y="0" width="4" height="24" />
        <rect x="17" y="0" width="2" height="24" />
        <rect x="23" y="0" width="1" height="24" />
        <rect x="28" y="0" width="5" height="24" />
        <rect x="37" y="0" width="2" height="24" />
        <rect x="43" y="0" width="3" height="24" />
        <rect x="50" y="0" width="1" height="24" />
        <rect x="55" y="0" width="4" height="24" />
        <rect x="63" y="0" width="2" height="24" />
        <rect x="69" y="0" width="1" height="24" />
        <rect x="74" y="0" width="3" height="24" />
        <rect x="81" y="0" width="5" height="24" />
        <rect x="90" y="0" width="1" height="24" />
        <rect x="95" y="0" width="2" height="24" />
        <rect x="101" y="0" width="4" height="24" />
        <rect x="109" y="0" width="1" height="24" />
        <rect x="114" y="0" width="3" height="24" />
        <rect x="121" y="0" width="2" height="24" />
        <rect x="127" y="0" width="1" height="24" />
        <rect x="132" y="0" width="5" height="24" />
        <rect x="141" y="0" width="2" height="24" />
        <rect x="147" y="0" width="1" height="24" />
        <rect x="152" y="0" width="4" height="24" />
        <rect x="160" y="0" width="2" height="24" />
        <rect x="166" y="0" width="1" height="24" />
        <rect x="171" y="0" width="3" height="24" />
        <rect x="178" y="0" width="5" height="24" />
        <rect x="187" y="0" width="1" height="24" />
        <rect x="192" y="0" width="3" height="24" />
      </svg>
    )
  }

  return <hr className="zone-divider rule-double" />
}

function LinkZone({
  content,
  bracketStyle
}: {
  content: unknown
  bracketStyle: BracketStyle
}) {
  const url = readString(content, "url")

  if (!url) return null

  const label = readString(content, "label") ?? "open"

  const description = readString(content, "description")

  const newTab = readBool(content, "new_tab")

  const external = url.startsWith("http")

  const inner = <NavLabel bracketStyle={bracketStyle}>{label}</NavLabel>

  return (
    <div className="zone-link">
      {external || newTab ? (
        <a
          href={url}
          className="zone-link-anchor"
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noreferrer" : undefined}
        >
          {inner}
        </a>
      ) : (
        <Link href={url} className="zone-link-anchor">
          {inner}
        </Link>
      )}

      {description ? (
        <p className="zone-link-description">{description}</p>
      ) : null}
    </div>
  )
}

// Renders one exhibition content zone from its stored jsonb by zone_type (spec 9.4.2)
export function ExhibitionZone({
  zone,
  bracketStyle,
  richTextRules
}: ExhibitionZoneProps) {
  return (
    <section className="exhibition-zone" data-zone-type={zone.zoneType}>
      {zone.zoneType === "image" ? <ImageZone content={zone.content} /> : null}

      {zone.zoneType === "video" ? <VideoZone content={zone.content} /> : null}

      {zone.zoneType === "grid" ? <GridZone content={zone.content} /> : null}

      {zone.zoneType === "text" ? (
        <TextZone content={zone.content} richTextRules={richTextRules} />
      ) : null}

      {zone.zoneType === "divider" ? (
        <DividerZone content={zone.content} />
      ) : null}

      {zone.zoneType === "link" ? (
        <LinkZone content={zone.content} bracketStyle={bracketStyle} />
      ) : null}
    </section>
  )
}

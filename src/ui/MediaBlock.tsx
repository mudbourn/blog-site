import { MediaPayload } from "@/ui/MediaPayload"
import { ReactionStrip } from "@/ui/ReactionStrip"
import { RichText, type RichTextRules } from "@/ui/RichText"
import type { FeedBlock } from "@/lib/site"

interface MediaBlockProps {
  block: FeedBlock
  emojiSet: string[]
  eager: boolean
  richTextRules: RichTextRules
}

function BlockText({
  block,
  richTextRules
}: {
  block: FeedBlock
  richTextRules: RichTextRules
}) {
  if (!block.headline && !block.bodyText) return null

  return (
    <div className="block-text">
      {block.headline ? (
        <h2 className="block-headline">{block.headline}</h2>
      ) : null}

      {block.bodyText ? (
        <div className="block-body">
          <RichText text={block.bodyText} rules={richTextRules} />
        </div>
      ) : null}
    </div>
  )
}

// Type A block: media payload, optional text, reaction strip, per spec 7.3 layout modes
export function MediaBlock({
  block,
  emojiSet,
  eager,
  richTextRules
}: MediaBlockProps) {
  const gravity =
    block.pillarGravityOverride && block.pillarGravityOverride !== "theme"
      ? block.pillarGravityOverride
      : undefined

  const layoutClass = `block-layout-${block.layoutMode}`

  const overlayClass =
    block.layoutMode === "overlay"
      ? `overlay-position-${block.overlayPosition ?? "bottom"}`
      : ""

  const text = <BlockText block={block} richTextRules={richTextRules} />

  const media = <MediaPayload block={block} eager={eager} />

  return (
    <article
      className={`media-block ${layoutClass} ${overlayClass}`}
      data-block="media"
      data-marginalia-left={block.marginaliaLeftUrl ?? undefined}
      data-marginalia-right={block.marginaliaRightUrl ?? undefined}
      data-block-gravity={gravity}
    >
      <div className="block-inner">
        {block.layoutMode === "overlay" ? (
          <>
            {media}

            {text}
          </>
        ) : block.layoutMode === "text-first" ||
          block.layoutMode === "side-by-side-text-left" ? (
          <>
            {text}

            {media}
          </>
        ) : (
          <>
            {media}

            {text}
          </>
        )}
      </div>

      <ReactionStrip
        emojiSet={emojiSet}
        surfaceType="media_block"
        surfaceId={block.id}
      />
    </article>
  )
}

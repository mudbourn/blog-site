import { MediaBlock } from "@/ui/MediaBlock"
import { PortalBlock } from "@/ui/PortalBlock"
import type { RichTextRules } from "@/ui/RichText"
import type { BracketStyle } from "@/lib/theme/types"
import type { ExhibitionTarget, FeedBlock } from "@/lib/site"

interface MediaStackProps {
  blocks: FeedBlock[]
  emojiSet: string[]
  targets: Map<string, ExhibitionTarget>
  bracketStyle: BracketStyle
  richTextRules: RichTextRules
}

// The vertical feed. Blocks are separated by the doubled misregistration rule.
export function MediaStack({
  blocks,
  emojiSet,
  targets,
  bracketStyle,
  richTextRules
}: MediaStackProps) {
  if (blocks.length === 0) {
    return (
      <section className="media-stack media-stack-empty">
        <p className="stack-empty-note">the stack is empty</p>
      </section>
    )
  }

  return (
    <section className="media-stack">
      {blocks.map((block, index) => (
        <div key={block.id} className="stack-item">
          {index > 0 ? <hr className="rule-double" /> : null}

          {block.blockType === "portal" ? (
            <PortalBlock
              block={block}
              target={
                block.exhibitionId
                  ? (targets.get(block.exhibitionId) ?? null)
                  : null
              }
              bracketStyle={bracketStyle}
            />
          ) : (
            <MediaBlock
              block={block}
              emojiSet={emojiSet}
              eager={index === 0}
              richTextRules={richTextRules}
            />
          )}
        </div>
      ))}
    </section>
  )
}

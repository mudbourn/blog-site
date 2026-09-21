"use client"

interface ReactionStripProps {
  emojiSet: string[]
  counts?: number[]
  surfaceType?: string
  surfaceId?: string
  onReact?: (index: number) => void
}

// Static reaction layout. Posting and 12s polling land in Phase 4.
export function ReactionStrip({
  emojiSet,
  counts,
  surfaceType,
  surfaceId,
  onReact
}: ReactionStripProps) {
  if (emojiSet.length === 0) {
    return null
  }

  return (
    <div
      className="reaction-strip"
      data-surface-type={surfaceType}
      data-surface-id={surfaceId}
    >
      {emojiSet.map((emoji, index) => (
        <button
          type="button"
          key={index}
          className="reaction-unit"
          disabled={!onReact}
          onClick={onReact ? () => onReact(index) : undefined}
        >
          <span className="reaction-emoji">{emoji}</span>

          <span className="reaction-count">{counts?.[index] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}

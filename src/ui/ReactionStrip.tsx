"use client"

interface ReactionStripProps {
  emojiSet: string[]
  counts?: number[]
}

// Static reaction layout. Posting and 12s polling land in Phase 4.
export function ReactionStrip({ emojiSet, counts }: ReactionStripProps) {
  if (emojiSet.length === 0) {
    return null
  }

  return (
    <div className="reaction-strip">
      {emojiSet.map((emoji, index) => (
        <button type="button" key={index} className="reaction-unit" disabled>
          <span className="reaction-emoji">{emoji}</span>

          <span className="reaction-count">{counts?.[index] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}

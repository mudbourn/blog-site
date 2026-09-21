import Link from "next/link"

import { NavLabel } from "@/ui/NavLabel"
import type { BracketStyle } from "@/lib/theme/types"

interface StatusShoutProps {
  text: string | null
  bracketStyle: BracketStyle
}

// Wraps each character so the status-stagger class can cascade them in
function StaggeredText({ text }: { text: string }) {
  const chars = Array.from(text)

  return (
    <>
      {chars.map((char, index) => (
        <span
          key={index}
          className="status-char"
          style={{ "--char-index": index } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </>
  )
}

export function StatusShout({ text, bracketStyle }: StatusShoutProps) {
  if (!text) {
    return (
      <section className="status-shout status-shout-empty">
        <p className="status-empty-note">no live status</p>
      </section>
    )
  }

  return (
    <section className="status-shout">
      <h1 className="status-text">
        <StaggeredText text={text} />
      </h1>

      <Link href="/status" className="status-archive-link">
        <NavLabel bracketStyle={bracketStyle}>archive</NavLabel>
      </Link>
    </section>
  )
}

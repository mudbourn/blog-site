import { Fragment, type ReactNode } from "react"

export interface RichTextRules {
  boldEnabled: boolean
  italicEnabled: boolean
  mixFonts: boolean
}

interface Token {
  kind: "bold" | "italic" | "link"
  start: number
  end: number
  inner: string
  url?: string
}

function findNextToken(text: string, rules: RichTextRules): Token | null {
  let best: Token | null = null

  const consider = (token: Token | null) => {
    if (!token) return

    if (!best || token.start < best.start) best = token
  }

  const linkMatch = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(text)

  if (linkMatch) {
    consider({
      kind: "link",
      start: linkMatch.index,
      end: linkMatch.index + linkMatch[0].length,
      inner: linkMatch[1],
      url: linkMatch[2]
    })
  }

  if (rules.boldEnabled) {
    const boldMatch = /\*\*([^*]+)\*\*/.exec(text)

    if (boldMatch) {
      consider({
        kind: "bold",
        start: boldMatch.index,
        end: boldMatch.index + boldMatch[0].length,
        inner: boldMatch[1]
      })
    }
  }

  if (rules.italicEnabled) {
    const italicMatch = /_([^_]+)_/.exec(text)

    if (italicMatch) {
      consider({
        kind: "italic",
        start: italicMatch.index,
        end: italicMatch.index + italicMatch[0].length,
        inner: italicMatch[1]
      })
    }
  }

  return best
}

function renderInline(
  text: string,
  rules: RichTextRules,
  keyPrefix: string
): ReactNode[] {
  const nodes: ReactNode[] = []

  let remaining = text

  let index = 0

  while (remaining.length > 0) {
    const token = findNextToken(remaining, rules)

    if (!token) {
      nodes.push(<Fragment key={`${keyPrefix}-${index}`}>{remaining}</Fragment>)

      break
    }

    if (token.start > 0) {
      nodes.push(
        <Fragment key={`${keyPrefix}-${index}`}>
          {remaining.slice(0, token.start)}
        </Fragment>
      )

      index += 1
    }

    const key = `${keyPrefix}-${index}`

    const inner = renderInline(token.inner, rules, key)

    if (token.kind === "bold") {
      nodes.push(
        <strong
          key={key}
          className={rules.mixFonts ? "display-inline" : undefined}
        >
          {inner}
        </strong>
      )
    } else if (token.kind === "italic") {
      nodes.push(
        <em
          key={key}
          className={rules.mixFonts ? "annotation-inline" : undefined}
        >
          {inner}
        </em>
      )
    } else {
      nodes.push(
        <a key={key} href={token.url} target="_blank" rel="noreferrer">
          {inner}
        </a>
      )
    }

    index += 1

    remaining = remaining.slice(token.end)
  }

  return nodes
}

interface RichTextProps {
  text: string
  rules: RichTextRules
}

export function RichText({ text, rules }: RichTextProps) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0)

  return (
    <>
      {paragraphs.map((block, index) => (
        <p key={index} className="rich-text-paragraph">
          {renderInline(block.replace(/\n/g, " "), rules, `p${index}`)}
        </p>
      ))}
    </>
  )
}

"use client"

import { MouseEvent, useCallback, useEffect, useState } from "react"

import { useAudioEngine } from "@/ui/audio/AudioEngineProvider"

interface ReactionStripProps {
  emojiSet: string[]
  surfaceType?: string
  surfaceId?: string
}

const POLL_MS = 12000

// Live reaction strip: 12s reconciliation poll, optimistic taps, pitched SFX
export function ReactionStrip({
  emojiSet,
  surfaceType,
  surfaceId
}: ReactionStripProps) {
  const engine = useAudioEngine()

  const [counts, setCounts] = useState<Record<string, number>>({})

  const live = Boolean(surfaceType && surfaceId)

  useEffect(() => {
    if (!live) {
      return
    }

    let cancelled = false

    const load = () => {
      fetch(`/api/reactions/${surfaceType}/${encodeURIComponent(surfaceId!)}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("counts"))))
        .then((data) => {
          if (!cancelled) {
            setCounts(data.counts ?? {})
          }
        })
        .catch(() => {})
    }

    setCounts({})

    load()

    const timer = window.setInterval(load, POLL_MS)

    return () => {
      cancelled = true

      window.clearInterval(timer)
    }
  }, [live, surfaceType, surfaceId])

  const react = useCallback(
    (event: MouseEvent<HTMLButtonElement>, emoji: string, index: number) => {
      engine.resume()

      setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }))

      engine.playSFX("reaction_pitch", 0.9 + Math.min(index, 4) * 0.1)

      const glyph = event.currentTarget.querySelector(".reaction-emoji")

      if (glyph && "animate" in glyph) {
        glyph.animate(
          [{ transform: "scale(1.4)" }, { transform: "scale(1)" }],
          {
            duration: 100,
            easing: "ease-out"
          }
        )
      }

      fetch("/api/reactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          surface_type: surfaceType,
          surface_id: surfaceId,
          emoji
        })
      }).catch(() => {})
    },
    [engine, surfaceType, surfaceId]
  )

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
          disabled={!live}
          onClick={live ? (event) => react(event, emoji, index) : undefined}
        >
          <span className="reaction-emoji">{emoji}</span>

          <span className="reaction-count">{counts[emoji] ?? 0}</span>
        </button>
      ))}
    </div>
  )
}

"use client"

import { RefObject, useEffect, useMemo, useRef } from "react"

interface VuMeterProps {
  analyserRef: RefObject<AnalyserNode | null>
  barCount?: number
}

// Frequency-driven bars with per-bar decay, flat when the context is silent
export function VuMeter({ analyserRef, barCount = 7 }: VuMeterProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const jitter = useMemo(
    () =>
      Array.from({ length: barCount }, () => Math.round(Math.random() * 2 - 1)),
    [barCount]
  )

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const bars = Array.from(container.children) as HTMLElement[]

    const heights = new Array(barCount).fill(0)

    let raf = 0

    let last = 0

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)

      if (now - last < 33) {
        return
      }

      last = now

      const analyser = analyserRef.current

      if (!analyser) {
        return
      }

      const data = new Uint8Array(analyser.frequencyBinCount)

      analyser.getByteFrequencyData(data)

      for (let i = 0; i < barCount; i++) {
        const bin = Math.floor((i / barCount) * data.length)

        const value = data[bin] ?? 0

        heights[i] = Math.max(value, heights[i] * 0.85)

        const pct = Math.max(4, (heights[i] / 255) * 100)

        bars[i].style.height = `${pct}%`
      }
    }

    raf = requestAnimationFrame(loop)

    return () => cancelAnimationFrame(raf)
  }, [analyserRef, barCount])

  return (
    <div className="vu-meter" ref={containerRef} aria-hidden>
      {jitter.map((offset, index) => (
        <span
          key={index}
          className="vu-bar"
          style={{ marginLeft: index === 0 ? 0 : `${2 + offset}px` }}
        />
      ))}
    </div>
  )
}

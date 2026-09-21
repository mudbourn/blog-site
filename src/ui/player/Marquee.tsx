"use client"

import { useEffect, useRef } from "react"

interface MarqueeProps {
  text: string
  className?: string
}

// Track title that scrolls only when it overflows its container
export function Marquee({ text, className }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current

    const el = textRef.current

    if (!container || !el) {
      return
    }

    const check = () => {
      const single = el.scrollWidth / 2

      const overflowing = single > container.clientWidth

      el.classList.toggle("is-overflowing", overflowing)

      if (overflowing) {
        const duration = Math.min(24, Math.max(6, single / 50))

        el.style.setProperty("--marquee-duration", `${duration}s`)
      }
    }

    check()

    let timer = 0

    const onResize = () => {
      window.clearTimeout(timer)

      timer = window.setTimeout(check, 200)
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)

      window.clearTimeout(timer)
    }
  }, [text])

  return (
    <div className={`marquee-container ${className ?? ""}`} ref={containerRef}>
      <span className="marquee-text" ref={textRef}>
        <span className="marquee-copy">{text}</span>

        <span className="marquee-copy" aria-hidden>
          {text}
        </span>
      </span>
    </div>
  )
}

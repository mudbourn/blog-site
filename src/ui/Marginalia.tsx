"use client"

import { useEffect, useRef } from "react"

import type { MarginaliaSwap, PillarGravity } from "@/lib/theme/types"

interface MarginaliaProps {
  gravity: PillarGravity
  swap: MarginaliaSwap
}

// Desktop-only atmosphere walls, swapped on block boundary crossings (spec 3.4)
export function Marginalia({ gravity, swap }: MarginaliaProps) {
  const leftRef = useRef<HTMLDivElement>(null)

  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)")

    if (!desktop.matches) return

    function updateMarginalia(zone: HTMLDivElement | null, url: string) {
      if (!zone) return

      if (zone.dataset.currentUrl === url) return

      zone.dataset.currentUrl = url

      if (swap === "dissolve") {
        zone.style.opacity = "0"
        zone.style.transition = "opacity 150ms ease-out"

        window.setTimeout(() => {
          zone.style.backgroundImage = `url(${url})`
          zone.style.opacity = "1"
        }, 150)
      } else {
        zone.style.backgroundImage = `url(${url})`
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const block = entry.target as HTMLElement

          const leftUrl = block.dataset.marginaliaLeft

          const rightUrl = block.dataset.marginaliaRight

          if (leftUrl) updateMarginalia(leftRef.current, leftUrl)

          if (rightUrl) updateMarginalia(rightRef.current, rightUrl)
        })
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0
      }
    )

    const blocks = document.querySelectorAll("[data-block]")

    blocks.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [swap])

  const showLeft = gravity !== "left"

  const showRight = gravity !== "right"

  return (
    <div className="marginalia-container" data-gravity={gravity} aria-hidden>
      {showLeft ? (
        <div ref={leftRef} className="marginalia-zone marginalia-left">
          <div className="marginalia-grain" />
        </div>
      ) : null}

      {showRight ? (
        <div ref={rightRef} className="marginalia-zone marginalia-right">
          <div className="marginalia-grain" />
        </div>
      ) : null}
    </div>
  )
}

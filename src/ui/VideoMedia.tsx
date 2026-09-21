"use client"

import { useEffect, useRef, useState } from "react"

import { Icon } from "@/ui/Icon"

interface VideoMediaProps {
  src: string
  poster: string | null
  alt: string | null
}

// Ambient looping video with a mobile tap-to-play fallback when autoplay is blocked
export function VideoMedia({ src, poster, alt }: VideoMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    const attempt = video.play()

    if (attempt) {
      attempt.catch(() => setBlocked(true))
    }
  }, [])

  function handlePlay() {
    const video = videoRef.current

    if (!video) return

    const attempt = video.play()

    if (attempt) {
      attempt.then(() => setBlocked(false)).catch(() => setBlocked(true))
    }
  }

  return (
    <div className="block-media block-media-video">
      <video
        ref={videoRef}
        className="media-video"
        muted
        loop
        playsInline
        poster={poster ?? undefined}
        aria-label={alt ?? undefined}
      >
        <source src={src} />
      </video>

      {blocked ? (
        <button
          type="button"
          className="video-play-overlay"
          aria-label="play video"
          onClick={handlePlay}
        >
          <Icon name="play" size={40} />
        </button>
      ) : null}
    </div>
  )
}

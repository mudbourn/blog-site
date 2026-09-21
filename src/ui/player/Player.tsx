"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { Track } from "@/lib/navidrome/client"
import { Icon } from "@/ui/Icon"
import { ReactionStrip } from "@/ui/ReactionStrip"
import { Marquee } from "@/ui/player/Marquee"
import { VuMeter } from "@/ui/player/VuMeter"
import { useAudioEngine } from "@/ui/player/useAudioEngine"

interface PlayerProps {
  emojiSet: string[]
}

type StreamState = "loading" | "ok" | "unavailable"

const PREFETCH_WINDOW = 30

// Reads a persisted integer preference, clamped to a default
function readIntPref(key: string, fallback: number): number {
  try {
    const raw = window.localStorage.getItem(key)

    if (raw === null) {
      return fallback
    }

    const parsed = parseInt(raw, 10)

    return Number.isFinite(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

// Reads a persisted boolean preference
function readBoolPref(key: string, fallback: boolean): boolean {
  try {
    const raw = window.localStorage.getItem(key)

    if (raw === null) {
      return fallback
    }

    return raw === "1"
  } catch {
    return fallback
  }
}

// Writes a preference, swallowing storage errors
function writePref(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // storage unavailable
  }
}

export function Player({ emojiSet }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const engine = useAudioEngine(audioRef)

  const [queue, setQueue] = useState<Track[]>([])

  const [source, setSource] = useState("random")

  const [index, setIndex] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)

  const [streamState, setStreamState] = useState<StreamState>("loading")

  const [volumeStep, setVolumeStep] = useState(4)

  const [sfxEnabled, setSfxEnabled] = useState(true)

  const [expanded, setExpanded] = useState(false)

  const sessionIdRef = useRef("")

  const prefetchedRef = useRef<number | null>(null)

  const track = queue[index] ?? null

  useEffect(() => {
    sessionIdRef.current = crypto.randomUUID()

    setVolumeStep(readIntPref("sfx_volume", 4))

    setSfxEnabled(readBoolPref("sfx_enabled", true))
  }, [])

  useEffect(() => {
    let cancelled = false

    fetch("/api/music/queue")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("queue"))))
      .then((data) => {
        if (cancelled) {
          return
        }

        const tracks = (data.tracks as Track[]) ?? []

        if (tracks.length === 0) {
          setStreamState("unavailable")

          return
        }

        setQueue(tracks)

        setSource(typeof data.source === "string" ? data.source : "random")

        setStreamState("ok")
      })
      .catch(() => {
        if (!cancelled) {
          setStreamState("unavailable")
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    engine.setMasterVolume(volumeStep)

    writePref("sfx_volume", String(volumeStep))
  }, [volumeStep, engine])

  useEffect(() => {
    engine.setSfxEnabled(sfxEnabled)

    writePref("sfx_enabled", sfxEnabled ? "1" : "0")
  }, [sfxEnabled, engine])

  useEffect(() => {
    const onGesture = () => engine.resume()

    document.addEventListener("pointerdown", onGesture, { once: true })

    document.addEventListener("keydown", onGesture, { once: true })

    return () => {
      document.removeEventListener("pointerdown", onGesture)

      document.removeEventListener("keydown", onGesture)
    }
  }, [engine])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !track) {
      return
    }

    prefetchedRef.current = null

    audio.src = `/api/music/stream/${encodeURIComponent(track.id)}`

    audio.load()

    if (isPlaying) {
      audio.play().catch(() => {})
    }
    // isPlaying intentionally excluded so play/pause does not reload the track
  }, [index, queue, track])

  const goNext = useCallback(
    (fromEnd: boolean) => {
      if (queue.length === 0) {
        return
      }

      if (fromEnd) {
        engine.playSFX("track_advance")
      }

      const next = index + 1

      if (next < queue.length) {
        setIndex(next)

        return
      }

      if (source === "random") {
        fetch("/api/music/queue")
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error("queue"))))
          .then((data) => {
            const tracks = (data.tracks as Track[]) ?? []

            if (tracks.length > 0) {
              setQueue(tracks)
            }

            setIndex(0)
          })
          .catch(() => setIndex(0))

        return
      }

      setIndex(0)
    },
    [engine, index, queue.length, source]
  )

  const goPrev = useCallback(() => {
    engine.playSFX("track_advance")

    setIndex((i) => (i > 0 ? i - 1 : 0))
  }, [engine])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current

    if (!audio || !track) {
      return
    }

    engine.resume()

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)

          engine.playSFX("player_play")
        })
        .catch(() => {})

      return
    }

    audio.pause()

    setIsPlaying(false)

    engine.playSFX("player_pause")
  }, [engine, track])

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current

    if (!audio || !Number.isFinite(audio.duration)) {
      return
    }

    const remaining = audio.duration - audio.currentTime

    if (remaining > PREFETCH_WINDOW || prefetchedRef.current === index) {
      return
    }

    const nextTrack = queue[index + 1]

    if (!nextTrack) {
      return
    }

    prefetchedRef.current = index

    fetch(`/api/music/stream/${encodeURIComponent(nextTrack.id)}`, {
      headers: { Range: "bytes=0-1" }
    }).catch(() => {})
  }, [index, queue])

  const cycleVolume = useCallback(() => {
    engine.resume()

    engine.playSFX("volume_click")

    setVolumeStep((step) => (step >= 4 ? 1 : step + 1))
  }, [engine])

  const toggleSfx = useCallback(() => {
    setSfxEnabled((enabled) => !enabled)
  }, [])

  const onReact = useCallback(
    (emojiIndex: number) => {
      engine.resume()

      const pitch = 0.9 + Math.min(emojiIndex, 4) * 0.1

      engine.playSFX("reaction_pitch", pitch)
    },
    [engine]
  )

  const unavailable = streamState === "unavailable"

  const surfaceId = track ? `${track.id}:${sessionIdRef.current}` : ""

  return (
    <div className="player-dock">
      <ReactionStrip
        emojiSet={emojiSet}
        surfaceType="track"
        surfaceId={surfaceId}
        onReact={onReact}
      />

      <div className={`player-strip${expanded ? " is-expanded" : ""}`}>
        <audio
          ref={audioRef}
          crossOrigin="anonymous"
          onEnded={() => goNext(true)}
          onTimeUpdate={onTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="player-art">
          {track && track.albumId ? (
            <img
              src={`/api/music/art/${encodeURIComponent(track.albumId)}`}
              alt=""
              width={32}
              height={32}
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
          ) : (
            <Icon name="music" size={16} />
          )}
        </div>

        <div className="player-info">
          {unavailable ? (
            <span className="player-unavailable">[STREAM UNAVAILABLE]</span>
          ) : (
            <>
              <Marquee
                text={track ? track.title : "..."}
                className="player-title"
              />

              <span className="player-artist">{track?.artist ?? ""}</span>

              <span className="player-album">{track?.album ?? ""}</span>
            </>
          )}
        </div>

        <button
          type="button"
          className="player-volume"
          onClick={cycleVolume}
          aria-label="Cycle volume"
        >
          {[1, 2, 3, 4].map((slot) => (
            <span
              key={slot}
              className={`volume-bar${slot <= volumeStep ? " is-on" : ""}`}
            />
          ))}
        </button>

        <div className="player-transport">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous track"
            disabled={unavailable}
          >
            <Icon name="skip-back" size={16} />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            disabled={unavailable}
          >
            <Icon name={isPlaying ? "pause" : "play"} size={16} />
          </button>

          <button
            type="button"
            onClick={() => goNext(false)}
            aria-label="Next track"
            disabled={unavailable}
          >
            <Icon name="skip-forward" size={16} />
          </button>
        </div>

        <VuMeter analyserRef={engine.analyserRef} barCount={7} />

        <button type="button" className="player-sfx" onClick={toggleSfx}>
          {sfxEnabled ? "[SFX: ON]" : "[SFX: OFF]"}
        </button>

        <button
          type="button"
          className="player-expand"
          onClick={() => setExpanded((v) => !v)}
          aria-label="Toggle controls"
        >
          <Icon name={expanded ? "chevron-right" : "chevron-left"} size={16} />
        </button>
      </div>
    </div>
  )
}

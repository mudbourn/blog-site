"use client"

import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react"

import { SFX_CLIPS, SfxName } from "@/lib/audio/clips"

const VOLUME_MAP: Record<number, number> = {
  1: 0.25,
  2: 0.5,
  3: 0.75,
  4: 1
}

export interface AudioEngine {
  ready: boolean
  analyserRef: RefObject<AnalyserNode | null>
  resume: () => void
  attachMedia: (el: HTMLAudioElement) => void
  setMasterVolume: (step: number) => void
  setSfxEnabled: (enabled: boolean) => void
  playSFX: (name: SfxName, pitchShift?: number) => void
}

const noop = () => {}

const defaultEngine: AudioEngine = {
  ready: false,
  analyserRef: { current: null },
  resume: noop,
  attachMedia: noop,
  setMasterVolume: noop,
  setSfxEnabled: noop,
  playSFX: noop
}

const AudioEngineContext = createContext<AudioEngine>(defaultEngine)

export function useAudioEngine(): AudioEngine {
  return useContext(AudioEngineContext)
}

// Detects ogg/vorbis support once
function canPlayOgg(): boolean {
  const el = document.createElement("audio")

  return el.canPlayType('audio/ogg; codecs="vorbis"') !== ""
}

// Fetches and decodes every clip, failing silently per clip
function preloadClips(
  ctx: AudioContext,
  buffers: Partial<Record<SfxName, AudioBuffer>>
) {
  const useOgg = canPlayOgg()

  for (const name of Object.keys(SFX_CLIPS) as SfxName[]) {
    const paths = SFX_CLIPS[name]

    const url = useOgg ? paths.ogg : paths.mp3

    fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error("miss"))))
      .then((buf) => ctx.decodeAudioData(buf))
      .then((decoded) => {
        buffers[name] = decoded
      })
      .catch(() => {})
  }
}

// Site-wide audio engine: one AudioContext, the SFX chain, and the player tap
export function AudioEngineProvider({ children }: { children: ReactNode }) {
  const ctxRef = useRef<AudioContext | null>(null)

  const analyserRef = useRef<AnalyserNode | null>(null)

  const masterGainRef = useRef<GainNode | null>(null)

  const sfxGainRef = useRef<GainNode | null>(null)

  const buffersRef = useRef<Partial<Record<SfxName, AudioBuffer>>>({})

  const attachedRef = useRef(false)

  const volumeRef = useRef(1)

  const sfxEnabledRef = useRef(true)

  const reducedMotionRef = useRef(false)

  const [ready, setReady] = useState(false)

  useEffect(() => {
    let ctx: AudioContext

    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext

      ctx = new Ctor()
    } catch {
      return
    }

    ctxRef.current = ctx

    const sfxGain = ctx.createGain()

    sfxGain.connect(ctx.destination)

    sfxGainRef.current = sfxGain

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    preloadClips(ctx, buffersRef.current)

    setReady(true)

    const onGesture = () => {
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {})
      }
    }

    document.addEventListener("pointerdown", onGesture)

    document.addEventListener("keydown", onGesture)

    return () => {
      document.removeEventListener("pointerdown", onGesture)

      document.removeEventListener("keydown", onGesture)

      ctx.close().catch(() => {})
    }
  }, [])

  const resume = useCallback(() => {
    const ctx = ctxRef.current

    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {})
    }
  }, [])

  const attachMedia = useCallback((el: HTMLAudioElement) => {
    const ctx = ctxRef.current

    if (!ctx || attachedRef.current) {
      return
    }

    attachedRef.current = true

    const source = ctx.createMediaElementSource(el)

    const analyser = ctx.createAnalyser()

    analyser.fftSize = 128

    analyser.smoothingTimeConstant = 0.8

    const masterGain = ctx.createGain()

    masterGain.gain.value = volumeRef.current

    source.connect(analyser)

    source.connect(masterGain)

    masterGain.connect(ctx.destination)

    analyserRef.current = analyser

    masterGainRef.current = masterGain
  }, [])

  const setMasterVolume = useCallback((step: number) => {
    const level = VOLUME_MAP[step] ?? 1

    volumeRef.current = level

    const gain = masterGainRef.current

    if (gain) {
      gain.gain.value = level
    }
  }, [])

  const setSfxEnabled = useCallback((enabled: boolean) => {
    sfxEnabledRef.current = enabled

    const gain = sfxGainRef.current

    if (gain) {
      gain.gain.value = enabled ? 1 : 0
    }
  }, [])

  const playSFX = useCallback((name: SfxName, pitchShift = 1) => {
    if (!sfxEnabledRef.current) {
      return
    }

    if (reducedMotionRef.current) {
      return
    }

    const ctx = ctxRef.current

    if (!ctx || ctx.state !== "running") {
      return
    }

    const buffer = buffersRef.current[name]

    if (!buffer) {
      return
    }

    const src = ctx.createBufferSource()

    src.buffer = buffer

    src.playbackRate.value = pitchShift

    src.connect(sfxGainRef.current as GainNode)

    src.start(0)
  }, [])

  const engine: AudioEngine = {
    ready,
    analyserRef,
    resume,
    attachMedia,
    setMasterVolume,
    setSfxEnabled,
    playSFX
  }

  return (
    <AudioEngineContext.Provider value={engine}>
      {children}
    </AudioEngineContext.Provider>
  )
}

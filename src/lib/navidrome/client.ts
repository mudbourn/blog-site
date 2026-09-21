import crypto from "node:crypto"

export interface Track {
  id: string
  title: string
  artist: string
  album: string
  albumId: string
  duration: number
}

const CLIENT_ID = "mudbourn-blog"

const API_VERSION = "1.16.1"

const NAVIDROME_URL = process.env.NAVIDROME_URL

const NAVIDROME_USER = process.env.NAVIDROME_USER

const NAVIDROME_PASSWORD = process.env.NAVIDROME_PASSWORD

export function isConfigured(): boolean {
  return Boolean(NAVIDROME_URL && NAVIDROME_USER && NAVIDROME_PASSWORD)
}

// Builds a salted-token Subsonic auth query string
function authParams(): string {
  const salt = crypto.randomBytes(3).toString("hex")

  const token = crypto
    .createHash("md5")
    .update((NAVIDROME_PASSWORD as string) + salt)
    .digest("hex")

  const params = new URLSearchParams({
    u: NAVIDROME_USER as string,
    t: token,
    s: salt,
    v: API_VERSION,
    c: CLIENT_ID,
    f: "json"
  })

  return params.toString()
}

// Composes a fresh authenticated REST url for a Subsonic method
export function buildRestUrl(
  method: string,
  extra: Record<string, string> = {}
): string {
  const query = new URLSearchParams(extra).toString()

  const tail = query ? `&${query}` : ""

  return `${NAVIDROME_URL}/rest/${method}?${authParams()}${tail}`
}

// Calls a JSON Subsonic method, returning its response body or null
async function subsonicGet(
  method: string,
  extra: Record<string, string> = {}
): Promise<Record<string, unknown> | null> {
  if (!isConfigured()) {
    return null
  }

  try {
    const res = await fetch(buildRestUrl(method, extra), { cache: "no-store" })

    if (!res.ok) {
      return null
    }

    const json = (await res.json()) as Record<string, unknown>

    const body = json["subsonic-response"] as
      Record<string, unknown> | undefined

    if (!body || body.status !== "ok") {
      return null
    }

    return body
  } catch {
    return null
  }
}

// Maps a raw Subsonic song object to a Track
function mapSong(song: Record<string, unknown>): Track {
  return {
    id: String(song.id ?? ""),
    title: String(song.title ?? ""),
    artist: String(song.artist ?? ""),
    album: String(song.album ?? ""),
    albumId: String(song.albumId ?? song.coverArt ?? ""),
    duration: Number(song.duration ?? 0)
  }
}

// Builds the ordered queue from the configured source
export async function getQueue(source: string): Promise<Track[]> {
  if (!isConfigured()) {
    return []
  }

  if (!source || source === "random") {
    const body = await subsonicGet("getRandomSongs", { size: "50" })

    const wrap = body?.randomSongs as Record<string, unknown> | undefined

    const songs = (wrap?.song as Record<string, unknown>[]) ?? []

    return songs.map(mapSong)
  }

  const body = await subsonicGet("getPlaylist", { id: source })

  const wrap = body?.playlist as Record<string, unknown> | undefined

  const songs = (wrap?.entry as Record<string, unknown>[]) ?? []

  return songs.map(mapSong)
}

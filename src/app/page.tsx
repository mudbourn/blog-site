import { Header } from "@/ui/Header"
import { Marginalia } from "@/ui/Marginalia"
import { MediaStack } from "@/ui/MediaStack"
import { Player } from "@/ui/player/Player"
import { TextureLayer } from "@/ui/TextureLayer"
import { getActiveTheme } from "@/lib/theme/active"
import {
  getExhibitionTargets,
  getHamburgerLinks,
  getLiveStatus,
  getOpenExhibitions,
  getPublishedBlocks,
  getReactionEmojiSet,
  getSiteIdentity
} from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function LandingPage() {
  const [
    theme,
    identity,
    status,
    links,
    openExhibitions,
    emojiSet,
    blocks,
    targets
  ] = await Promise.all([
    getActiveTheme(),
    getSiteIdentity(),
    getLiveStatus(),
    getHamburgerLinks(),
    getOpenExhibitions(),
    getReactionEmojiSet(),
    getPublishedBlocks(),
    getExhibitionTargets()
  ])

  const bracketStyle = theme.config.bracket_style

  const gravity = theme.config.pillar_gravity

  return (
    <div className="site-shell" data-pillar-gravity={gravity}>
      <TextureLayer />

      <Marginalia
        gravity={gravity}
        swap={theme.config.animation_marginalia_swap}
      />

      <main className="pillar">
        <Header
          identity={identity}
          statusText={status?.text ?? null}
          links={links}
          exhibitions={openExhibitions}
          bracketStyle={bracketStyle}
        />

        <MediaStack
          blocks={blocks}
          emojiSet={emojiSet}
          targets={targets}
          bracketStyle={bracketStyle}
        />
      </main>

      <Player emojiSet={emojiSet} />
    </div>
  )
}

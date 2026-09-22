import { Header } from "@/ui/Header"
import { Marginalia } from "@/ui/Marginalia"
import { Player } from "@/ui/player/Player"
import { ProfileSections } from "@/ui/ProfileSections"
import { TextureLayer } from "@/ui/TextureLayer"
import { getActiveTheme } from "@/lib/theme/active"
import {
  getHamburgerLinks,
  getLiveStatus,
  getOpenExhibitions,
  getProfile,
  getProfileMarginalia,
  getReactionEmojiSet,
  getSiteIdentity
} from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const [
    theme,
    identity,
    status,
    links,
    openExhibitions,
    emojiSet,
    profile,
    marginalia
  ] = await Promise.all([
    getActiveTheme(),
    getSiteIdentity(),
    getLiveStatus(),
    getHamburgerLinks(),
    getOpenExhibitions(),
    getReactionEmojiSet(),
    getProfile(),
    getProfileMarginalia()
  ])

  const bracketStyle = theme.config.bracket_style

  const gravity = theme.config.pillar_gravity

  const richTextRules = {
    boldEnabled: theme.config.rich_text_bold_enabled,
    italicEnabled: theme.config.rich_text_italic_enabled,
    mixFonts: theme.config.rich_text_mix_fonts
  }

  return (
    <div className="site-shell" data-pillar-gravity={gravity}>
      <TextureLayer />

      <Marginalia
        gravity={gravity}
        swap={theme.config.animation_marginalia_swap}
        initialLeft={marginalia.left || undefined}
        initialRight={marginalia.right || undefined}
      />

      <main className="pillar">
        <Header
          identity={identity}
          statusText={status?.text ?? null}
          links={links}
          exhibitions={openExhibitions}
          bracketStyle={bracketStyle}
        />

        <ProfileSections profile={profile} richTextRules={richTextRules} />
      </main>

      <Player emojiSet={emojiSet} />
    </div>
  )
}

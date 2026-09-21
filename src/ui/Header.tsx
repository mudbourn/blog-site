import Link from "next/link"

import { HamburgerMenu } from "@/ui/HamburgerMenu"
import { StatusShout } from "@/ui/StatusShout"
import type { BracketStyle } from "@/lib/theme/types"
import type { HamburgerLink, OpenExhibition, SiteIdentity } from "@/lib/site"

interface HeaderProps {
  identity: SiteIdentity
  statusText: string | null
  links: HamburgerLink[]
  exhibitions: OpenExhibition[]
  bracketStyle: BracketStyle
}

export function Header({
  identity,
  statusText,
  links,
  exhibitions,
  bracketStyle
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="identity-bar">
        <Link
          href="/profile"
          className="identity-avatar-link"
          aria-label="profile"
        >
          {identity.avatarUrl ? (
            <img
              src={identity.avatarUrl}
              alt=""
              width={48}
              height={48}
              className="identity-avatar"
            />
          ) : (
            <span className="identity-avatar identity-avatar-empty" />
          )}
        </Link>

        <div className="identity-center">
          <span className="identity-handle">{identity.handle}</span>

          <span className="identity-descriptor">{identity.tagline}</span>
        </div>

        <HamburgerMenu
          links={links}
          exhibitions={exhibitions}
          bracketStyle={bracketStyle}
        />
      </div>

      <StatusShout text={statusText} bracketStyle={bracketStyle} />
    </header>
  )
}

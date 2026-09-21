"use client"

import { useState } from "react"
import Link from "next/link"

import { Icon } from "@/ui/Icon"
import { NavLabel } from "@/ui/NavLabel"
import type { BracketStyle } from "@/lib/theme/types"
import type { HamburgerLink, OpenExhibition } from "@/lib/site"

interface HamburgerMenuProps {
  links: HamburgerLink[]
  exhibitions: OpenExhibition[]
  bracketStyle: BracketStyle
}

// Slide-in navigation panel with platforms, projects, and open exhibitions
export function HamburgerMenu({
  links,
  exhibitions,
  bracketStyle
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const platforms = links.filter((link) => link.zone === "platforms")

  const projects = links.filter((link) => link.zone === "projects")

  function close() {
    setIsOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="hamburger-trigger"
        aria-label="open menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        <Icon name="menu" size={20} />
      </button>

      {isOpen ? (
        <div className="hamburger-backdrop" onClick={close} aria-hidden />
      ) : null}

      <nav
        className={isOpen ? "hamburger-panel is-open" : "hamburger-panel"}
        aria-hidden={!isOpen}
      >
        <div className="hamburger-head">
          <button
            type="button"
            className="hamburger-close"
            aria-label="close menu"
            onClick={close}
          >
            <NavLabel bracketStyle={bracketStyle}>
              <Icon name="x" size={16} />
            </NavLabel>
          </button>
        </div>

        <section className="hamburger-zone">
          <h2 className="hamburger-zone-title">platforms</h2>

          <ul className="hamburger-list">
            {platforms.map((link) => (
              <li key={link.id} className="hamburger-item">
                <Icon
                  name="chevrons-right"
                  size={14}
                  className="hamburger-marker"
                />

                <a
                  href={link.url}
                  target={link.newTab ? "_blank" : undefined}
                  rel={link.newTab ? "noopener noreferrer" : undefined}
                  className="hamburger-link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <hr className="rule-double" />

        <section className="hamburger-zone">
          <h2 className="hamburger-zone-title">projects</h2>

          <ul className="hamburger-list">
            {projects.map((link) => (
              <li
                key={link.id}
                className="hamburger-item hamburger-item-project"
              >
                <Icon
                  name="chevrons-right"
                  size={14}
                  className="hamburger-marker"
                />

                <div className="hamburger-project-body">
                  <a
                    href={link.url}
                    target={link.newTab ? "_blank" : undefined}
                    rel={link.newTab ? "noopener noreferrer" : undefined}
                    className="hamburger-link"
                  >
                    {link.label}
                  </a>

                  {link.description ? (
                    <span className="hamburger-desc">{link.description}</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {exhibitions.length > 0 ? (
          <>
            <hr className="rule-double" />

            <section className="hamburger-zone">
              <h2 className="hamburger-zone-title">open exhibitions</h2>

              <ul className="hamburger-list">
                {exhibitions.map((exhibition) => (
                  <li key={exhibition.id} className="hamburger-item">
                    <Link
                      href={`/x/${exhibition.slug}`}
                      className="hamburger-exhibition"
                      onClick={close}
                    >
                      <span className="stamp stamp-open">OPEN</span>

                      <span className="hamburger-exhibition-title">
                        {exhibition.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </nav>
    </>
  )
}

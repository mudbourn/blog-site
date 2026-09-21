import { Icon } from "@/ui/Icon"
import type { BracketStyle } from "@/lib/theme/types"

interface NavLabelProps {
  bracketStyle: BracketStyle
  children: React.ReactNode
}

// Bracket notation without unicode: square uses ASCII, angle uses chevron SVGs
export function NavLabel({ bracketStyle, children }: NavLabelProps) {
  if (bracketStyle === "angle") {
    return (
      <span className="nav-label nav-label-angle">
        <Icon name="chevron-left" size={14} className="nav-bracket" />

        <span className="nav-label-text">{children}</span>

        <Icon name="chevron-right" size={14} className="nav-bracket" />
      </span>
    )
  }

  if (bracketStyle === "square") {
    return (
      <span className="nav-label nav-label-square">
        <span className="nav-bracket-text">[</span>

        <span className="nav-label-text">{children}</span>

        <span className="nav-bracket-text">]</span>
      </span>
    )
  }

  return (
    <span className="nav-label nav-label-none">
      <span className="nav-label-text">{children}</span>
    </span>
  )
}

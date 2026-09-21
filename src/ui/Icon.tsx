import { SVGProps } from "react"

import Menu from "@/ui/svg/menu.svg"
import X from "@/ui/svg/x.svg"
import Play from "@/ui/svg/play.svg"
import Pause from "@/ui/svg/pause.svg"
import SkipBack from "@/ui/svg/skip-back.svg"
import SkipForward from "@/ui/svg/skip-forward.svg"
import ChevronLeft from "@/ui/svg/chevron-left.svg"
import ChevronRight from "@/ui/svg/chevron-right.svg"
import ChevronsRight from "@/ui/svg/chevrons-right.svg"
import GripVertical from "@/ui/svg/grip-vertical.svg"
import Music from "@/ui/svg/music.svg"

const registry = {
  menu: Menu,
  x: X,
  play: Play,
  pause: Pause,
  "skip-back": SkipBack,
  "skip-forward": SkipForward,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevrons-right": ChevronsRight,
  "grip-vertical": GripVertical,
  music: Music
}

export type IconName = keyof typeof registry

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
}

// Renders a themeable SVG glyph from ui/svg
export function Icon({ name, size = 24, ...props }: IconProps) {
  const Glyph = registry[name]

  return <Glyph width={size} height={size} aria-hidden {...props} />
}

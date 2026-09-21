import type { FontVariant } from "@/lib/theme/types"

export interface SeedFont {
  family_name: string
  variants: FontVariant[]
  file_size_kb: number | null
}

export const DEFAULT_FONTS: SeedFont[] = [
  {
    family_name: "Bebas Neue",
    variants: [
      {
        weight: "400",
        style: "normal",
        filename: "BebasNeue-400-normal.woff2"
      }
    ],
    file_size_kb: null
  },
  {
    family_name: "IBM Plex Mono",
    variants: [
      {
        weight: "400",
        style: "normal",
        filename: "IBMPlexMono-400-normal.woff2"
      }
    ],
    file_size_kb: null
  }
]

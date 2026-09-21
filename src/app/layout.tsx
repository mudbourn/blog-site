import type { Metadata } from "next"

import "@/app/globals.css"

import { getActiveTheme } from "@/lib/theme/active"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "mudbourn's blog",
  description: "A live self-portrait."
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const theme = await getActiveTheme()

  const htmlClass = theme.animationClasses.join(" ")

  return (
    <html lang="en" className={htmlClass}>
      <head>
        <meta name="color-scheme" content="dark" />

        <style
          id="theme-tokens"
          dangerouslySetInnerHTML={{ __html: theme.cssTokens }}
        />

        <style
          id="font-faces"
          dangerouslySetInnerHTML={{ __html: theme.fontFaces }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from "next"

import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Syncopated Chaos",
  description: "A live self-portrait."
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body>{children}</body>
    </html>
  )
}

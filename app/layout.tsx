import type { Metadata } from 'next'
import './fonts.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knot0 - AI that builds and runs automations. Governed.',
  description: 'Describe what you need. Agent discovers context and writes the code. Runners execute it anywhere. You stay in control.',
  metadataBase: new URL('https://www.knot0.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './fonts.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knot0 - Software that assembles itself.',
  description: 'Agents that write code, coordinate, and improve over time.',
  metadataBase: new URL('https://www.knot0.com'),
  openGraph: {
    title: 'Knot0 - Software that assembles itself.',
    description: 'Agents that write code, coordinate, and improve over time.',
    url: 'https://www.knot0.com',
    siteName: 'Knot0',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knot0 - Software that assembles itself.',
    description: 'Agents that write code, coordinate, and improve over time.',
  },
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
      <body suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

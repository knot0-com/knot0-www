import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './fonts.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knot0 - Run AI agents anywhere.',
  description: 'Orchestration, execution, and governance for production AI.',
  metadataBase: new URL('https://www.knot0.com'),
  openGraph: {
    title: 'Knot0 - Run AI agents anywhere.',
    description: 'Orchestration, execution, and governance for production AI.',
    url: 'https://www.knot0.com',
    siteName: 'Knot0',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knot0 - Run AI agents anywhere.',
    description: 'Orchestration, execution, and governance for production AI.',
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

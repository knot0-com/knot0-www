import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './fonts.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knot0 - Software that writes itself.',
  description: 'Software that writes itself. And never stops.',
  metadataBase: new URL('https://www.knot0.com'),
  openGraph: {
    title: 'Knot0 - Software that writes itself.',
    description: 'Software that writes itself. And never stops.',
    url: 'https://www.knot0.com',
    siteName: 'Knot0',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knot0 - Software that writes itself.',
    description: 'Software that writes itself. And never stops.',
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QTSLKJGR5E"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-QTSLKJGR5E');`}
        </Script>
      </head>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

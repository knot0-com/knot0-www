import type { Metadata } from 'next'
import { PageBackground } from '@/components/PageBackground'
import './fonts.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'Knot0 - Run AI agents anywhere.',
  description: 'Orchestration, execution, and governance for production AI.',
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
      <body suppressHydrationWarning>
        <PageBackground />
        {children}
      </body>
    </html>
  )
}

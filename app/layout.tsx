import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="theme-color" content="#fafaf9" />
      </head>
      <body className="antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-ink focus:text-warm-white">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}

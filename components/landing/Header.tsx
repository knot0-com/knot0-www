'use client'

import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black-border bg-black/95 backdrop-blur-sm">
      <div className="w-full px-6 md:px-12 lg:px-16 2xl:px-24 h-14 2xl:h-16 flex items-center justify-between">
        <Link href="/" className="font-mono font-bold text-amber text-lg tracking-tight hover:opacity-90 transition-opacity">
          KNOT0
        </Link>

        <div className="flex items-center gap-4 2xl:gap-6 text-sm 2xl:text-base font-mono">
          <a href="/labs" className="text-white-dim hover:text-white transition-colors">
            LABS
          </a>
          <a href="/writing" className="text-white-dim hover:text-white transition-colors">
            WRITING
          </a>
          <a
            href="https://github.com/knot0-com"
            className="text-white-dim hover:text-white transition-colors"
          >
            GITHUB
          </a>
        </div>
      </div>
    </header>
  )
}

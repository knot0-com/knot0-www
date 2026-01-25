'use client'

import { Knot0Wordmark } from '../logo'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black-border bg-black/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Knot0Wordmark size={24} />

        <div className="flex items-center gap-4 text-sm font-mono">
          <a href="/writing" className="text-white-dim hover:text-white transition-colors">
            WRITING
          </a>
          <a
            href="https://github.com/knot0"
            className="text-white-dim hover:text-white transition-colors"
          >
            GITHUB
          </a>
          <a
            href="/get-started"
            className="px-4 py-1.5 bg-amber text-black font-medium rounded hover:bg-amber/90 transition-colors"
          >
            GET STARTED
          </a>
        </div>
      </div>
    </header>
  )
}

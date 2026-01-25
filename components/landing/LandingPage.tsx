'use client'

import { Header } from './Header'
import { FullDemo } from './FullDemo'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Full-screen Demo Experience */}
      <main className="pt-14">
        <div className="px-6 md:px-12 lg:px-16 py-8">
          <h1 className="font-mono text-2xl md:text-3xl text-white font-bold mb-2">
            Tie agent to action.
          </h1>
          <p className="font-mono text-white-dim text-sm md:text-base max-w-2xl">
            Discovers context. Writes code. Deploys safely—with approvals when it matters.
          </p>
        </div>
        <FullDemo />
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 px-6 md:px-12 lg:px-16 border-t border-black-border">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-mono text-white-muted">
          <span>Knot0</span>
          <div className="flex gap-6">
            <a href="/writing" className="hover:text-white transition-colors">Writing</a>
            <a href="https://github.com/knot0" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

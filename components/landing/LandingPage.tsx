'use client'

import { motion } from 'framer-motion'
import { Header } from './Header'
import { FullDemo } from './FullDemo'
import { TrefoilLogo } from '../logo'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Full-screen Demo Experience */}
      <main className="pt-14">
        <FullDemo />
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 px-4 border-t border-black-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-mono text-white-muted">
          <div className="flex items-center gap-2">
            <TrefoilLogo size={20} />
            <span>Knot0</span>
          </div>
          <div className="flex gap-6">
            <a href="/writing" className="hover:text-white transition-colors">Writing</a>
            <a href="https://github.com/knot0" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

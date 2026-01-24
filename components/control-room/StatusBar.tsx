'use client'

import { useState, useEffect } from 'react'

export function StatusBar() {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="flex items-center justify-between px-6 py-2 border-t border-black-border bg-black-light text-xs">
      {/* Left: Status */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <span className="text-cyan">●</span>
          <span className="text-white-dim">STATUS:</span>
          <span className="text-cyan">NOMINAL</span>
        </span>
        <span className="text-white-muted">│</span>
        <span className="text-white-dim">v2.4.1</span>
      </div>

      {/* Center: CTA buttons */}
      <div className="flex items-center gap-4">
        <button className="px-4 py-1.5 bg-amber text-black font-bold rounded hover:bg-amber-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-black">
          GET STARTED
        </button>
        <a
          href="/docs"
          className="px-4 py-1.5 border border-white-muted text-white-dim rounded hover:text-white hover:border-white transition-colors"
        >
          DOCS
        </a>
      </div>

      {/* Right: Time and help */}
      <div className="flex items-center gap-4 text-white-dim">
        <span className="tabular-nums">{time}</span>
        <span className="text-white-muted">│</span>
        <span>
          Press <kbd className="px-1 py-0.5 bg-black-border rounded text-white">?</kbd> for help
        </span>
      </div>
    </footer>
  )
}

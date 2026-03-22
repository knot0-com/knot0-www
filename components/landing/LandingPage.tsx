'use client'

import { useState } from 'react'
import { Header } from './Header'
import { PageBackground } from '@/components/PageBackground'
import { FadeIn } from '@/components/motion/fade-in'

export function LandingPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to join waitlist')
      }

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <PageBackground />
      <Header />

      <main className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 2xl:px-24 py-16 2xl:py-24 relative z-10">
        <div className="max-w-3xl 2xl:max-w-5xl mx-auto w-full">
          {/* Hero + Signup (one visual unit) */}
          <FadeIn>
            <div className="mb-16">
              {/* Accent line */}
              <div className="w-12 2xl:w-16 h-px bg-amber mb-8 2xl:mb-10" />

              <h1 className="font-mono text-3xl md:text-4xl lg:text-5xl 2xl:text-7xl text-white font-bold mb-4 2xl:mb-6 leading-tight">
                Software that{' '}
                <span className="text-amber">writes itself.</span>
              </h1>
              <p className="font-mono text-white-dim text-base md:text-lg 2xl:text-xl max-w-xl 2xl:max-w-2xl mb-8 2xl:mb-10">
                And never stops.
              </p>

              {/* Signup */}
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-neon font-mono text-sm">
                  <span>✓</span>
                  <span>You&apos;re on the list. We&apos;ll be in touch.</span>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 2xl:gap-4 max-w-md 2xl:max-w-lg">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                      autoFocus
                      disabled={status === 'loading'}
                      className="flex-1 px-4 py-3 2xl:px-5 2xl:py-4 bg-black-light border border-black-border rounded font-mono text-sm 2xl:text-base text-white placeholder:text-white-muted focus:outline-none focus:border-amber/50 transition-colors disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="px-6 py-3 2xl:px-8 2xl:py-4 bg-amber text-black font-mono text-sm 2xl:text-base font-medium rounded hover:bg-amber/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,176,0,0.15)] hover:shadow-[0_0_30px_rgba(255,176,0,0.25)]"
                    >
                      {status === 'loading' ? 'Joining...' : 'Notify me'}
                    </button>
                  </form>
                  <a
                    href="https://github.com/knot0-com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white-muted hover:text-white transition-colors font-mono text-xs 2xl:text-sm w-fit"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Star on GitHub
                  </a>
                </div>
              )}
              {status === 'error' && (
                <p className="mt-2 text-red-500 font-mono text-sm">{errorMsg}</p>
              )}
            </div>
          </FadeIn>

          {/* Dagain Feature */}
          <FadeIn delay={0.2}>
          <div className="group border border-black-border border-l-2 border-l-amber/40 rounded-lg p-6 2xl:p-8 bg-black-light/30 backdrop-blur-sm hover:border-amber/30 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs font-mono text-white-muted mb-2">AVAILABLE NOW</div>
                <h2 className="font-mono text-xl 2xl:text-2xl text-white font-medium">Dagain</h2>
              </div>
              <span className="badge-pulse text-xs font-mono px-2 py-1 rounded border border-amber/30 bg-amber/10 text-amber">
                OPEN SOURCE
              </span>
            </div>
            <p className="font-mono text-white-dim text-sm 2xl:text-base mb-4">
              DAG orchestration for coding agents. Organize tasks as interconnected nodes with concurrent execution, failure recovery, and git worktree support.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/writing/dagain"
                className="inline-flex items-center gap-2 px-4 py-2 2xl:px-5 2xl:py-3 border border-amber/50 text-amber font-mono text-sm 2xl:text-base rounded hover:bg-amber/10 transition-colors"
              >
                Read the deep dive
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="https://github.com/knot0-com/dagain"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 2xl:px-5 2xl:py-3 border border-white-muted/30 text-white-dim font-mono text-sm 2xl:text-base rounded hover:border-white-muted hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>
          </FadeIn>

          {/* Trust cues */}
          <FadeIn delay={0.3}>
          <div className="mt-12 2xl:mt-16 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs 2xl:text-sm font-mono text-white-muted">
            <a
              href="https://github.com/knot0-com"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Open Source
            </a>
            <span className="text-white-muted/30">•</span>
            <span>MIT License</span>
            <span className="text-white-muted/30">•</span>
            <span>Rust + Python</span>
          </div>
          </FadeIn>
        </div>
      </main>

      {/* Footer */}
      <FadeIn delay={0.4}>
      <footer className="py-8 2xl:py-10 px-6 md:px-12 lg:px-16 2xl:px-24 relative z-10">
        {/* Edge-fading divider */}
        <div className="mb-8 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,176,0,0.2) 20%, rgba(255,176,0,0.2) 80%, transparent)' }} />

        <div className="max-w-3xl 2xl:max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm font-mono">
            <span className="text-amber font-bold">KNOT0</span>
            <span className="text-white-muted/30">·</span>
            <span className="text-white-muted text-xs">&copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm font-mono">
            <a href="/writing" className="text-white-muted hover:text-white transition-colors">Writing</a>
            <a href="/labs" className="text-white-muted hover:text-white transition-colors">Labs</a>
            <a href="https://github.com/knot0-com" className="text-white-muted hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-[11px] font-mono text-white-muted/40 tracking-wider">Built with Rust + Python</span>
        </div>
      </footer>
      </FadeIn>
    </div>
  )
}

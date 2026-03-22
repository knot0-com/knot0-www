'use client'

import { useState } from 'react'

export function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-16 pt-8 border-t border-black-border">
      <p className="font-mono text-white-dim text-sm mb-4">
        We&apos;re building the runtime behind these ideas.
      </p>
      {status === 'success' ? (
        <p className="font-mono text-green-400 text-sm">You&apos;re on the list.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-2.5 bg-black-light border border-black-border rounded font-mono text-sm text-white placeholder:text-white-muted focus:outline-none focus:border-amber/50 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-2.5 bg-amber text-black font-mono text-sm font-medium rounded hover:bg-amber/90 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : 'Notify me'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="mt-2 text-red-500 font-mono text-xs">Something went wrong. Try again.</p>
      )}
    </div>
  )
}

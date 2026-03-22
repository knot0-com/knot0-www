'use client'

// metadata is set in labs/layout.tsx (client components cannot export metadata)

import { Header } from '@/components/landing/Header'
import { TrefoilLogo, AnimatedTrefoil } from '@/components/logo'
import { motion } from 'framer-motion'

interface Tool {
  slug: string
  name: string
  oneLiner: string
  description: string
  status: 'stable' | 'beta' | 'experimental'
  github?: string
  npm?: string
  docs?: string
}

const tools: Tool[] = [
  {
    slug: 'dagain',
    name: 'Dagain',
    oneLiner: 'DAG orchestration for coding agents',
    description: 'Organize tasks as interconnected nodes with concurrent execution, SQLite state persistence, and git worktree support. Works with Codex, Claude Code, and Gemini.',
    status: 'beta',
    github: 'https://github.com/knot0-com/dagain',
    docs: '/writing/dagain',
  },
]

const statusColors = {
  stable: 'text-green-400 border-green-400/30 bg-green-400/10',
  beta: 'text-amber border-amber/30 bg-amber/10',
  experimental: 'text-cyan border-cyan/30 bg-cyan/10',
}

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 2xl:pt-32 pb-16 2xl:pb-24 px-6 md:px-12 lg:px-16 2xl:px-24">
        {/* Hero */}
        <div className="max-w-4xl 2xl:max-w-5xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-6"
          >
            <AnimatedTrefoil size={48} loop={false} />
            <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-bold font-mono text-amber">
              LABS
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg 2xl:text-xl text-white-dim font-mono leading-relaxed"
          >
            Open source tools and experiments from the Knot0 team.
            <br />
            Built for developers, released for everyone.
          </motion.p>
        </div>

        {/* Tools Table */}
        {tools.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="border border-black-border rounded-lg overflow-hidden"
          >
            {/* Table Header */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 2xl:px-8 py-3 2xl:py-4 bg-black-light border-b border-black-border text-xs 2xl:text-sm font-mono text-white-muted">
              <div className="col-span-2">NAME</div>
              <div className="col-span-1">STATUS</div>
              <div className="col-span-6">DESCRIPTION</div>
              <div className="col-span-3">LINKS</div>
            </div>

            {/* Table Rows */}
            {tools.map((tool, index) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                className="group grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 2xl:px-8 py-4 2xl:py-5 border-b border-black-border last:border-b-0 hover:bg-black-light/50 transition-colors"
              >
                {/* Name */}
                <div className="md:col-span-2">
                  <a
                    href={tool.docs || tool.github || `/labs/${tool.slug}`}
                    className="text-white font-mono font-medium hover:text-amber transition-colors"
                  >
                    {tool.name}
                  </a>
                </div>

                {/* Status */}
                <div className="md:col-span-1">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border ${statusColors[tool.status]}`}>
                    {tool.status.toUpperCase()}
                  </span>
                </div>

                {/* Description */}
                <div className="md:col-span-6">
                  <p className="text-white-dim text-sm 2xl:text-base font-mono">
                    <span className="text-white">{tool.oneLiner}</span>
                    <span className="hidden lg:inline text-white-muted"> — {tool.description}</span>
                  </p>
                </div>

                {/* Links */}
                <div className="md:col-span-3 flex items-center gap-4 text-xs font-mono text-white-muted">
                  {tool.docs && (
                    <a
                      href={tool.docs}
                      className="flex items-center gap-1 hover:text-amber transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Docs
                    </a>
                  )}
                  {tool.github && (
                    <a
                      href={tool.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-amber transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {tool.npm && (
                    <a
                      href={tool.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-amber transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/>
                      </svg>
                      npm
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border border-dashed border-black-border rounded-lg p-12 text-center"
          >
            <TrefoilLogo size={64} className="mx-auto mb-6 opacity-30" />
            <h2 className="text-xl font-mono text-white-dim mb-2">
              Coming Soon
            </h2>
            <p className="text-sm font-mono text-white-muted max-w-md mx-auto">
              We&apos;re preparing some open source tools for release.
              Check back soon or follow us on GitHub.
            </p>
            <a
              href="https://github.com/knot0-com"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-black-light border border-black-border rounded hover:border-amber/50 transition-colors text-sm font-mono text-white-dim hover:text-white"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Follow on GitHub
            </a>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 2xl:py-8 px-6 md:px-12 lg:px-16 2xl:px-24 border-t border-black-border">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-sm 2xl:text-base font-mono text-white-muted">
          <div className="flex items-center gap-2">
            <TrefoilLogo size={20} />
            <span>Knot0</span>
          </div>
          <div className="flex gap-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/writing" className="hover:text-white transition-colors">Writing</a>
            <a href="https://github.com/knot0-com" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

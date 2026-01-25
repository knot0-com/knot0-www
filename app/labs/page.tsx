'use client'

import { Header } from '@/components/landing/Header'
import { TrefoilLogo, AnimatedTrefoil } from '@/components/logo'
import { motion } from 'framer-motion'

interface Tool {
  slug: string
  name: string
  description: string
  status: 'stable' | 'beta' | 'experimental'
  github?: string
  npm?: string
  docs?: string
}

const tools: Tool[] = [
  // Add your tools here
  // {
  //   slug: 'example-tool',
  //   name: 'Example Tool',
  //   description: 'A brief description of what this tool does.',
  //   status: 'beta',
  //   github: 'https://github.com/knot0/example-tool',
  // },
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

      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        {/* Hero */}
        <div className="max-w-4xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 mb-6"
          >
            <AnimatedTrefoil size={48} loop={false} />
            <h1 className="text-4xl md:text-5xl font-bold font-mono text-amber">
              LABS
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-white-dim font-mono leading-relaxed"
          >
            Open source tools and experiments from the Knot0 team.
            <br />
            Built for developers, released for everyone.
          </motion.p>
        </div>

        {/* Tools Grid */}
        {tools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.a
                key={tool.slug}
                href={`/labs/${tool.slug}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="group block border border-black-border rounded-lg p-6 hover:border-amber/50 transition-all bg-black-light hover:bg-black-light/80"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold font-mono text-white group-hover:text-amber transition-colors">
                    {tool.name}
                  </h2>
                  <span className={`text-xs font-mono px-2 py-1 rounded border ${statusColors[tool.status]}`}>
                    {tool.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-white-dim text-sm font-mono mb-6 line-clamp-3">
                  {tool.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-mono text-white-muted">
                  {tool.github && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub
                    </span>
                  )}
                  {tool.npm && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/>
                      </svg>
                      npm
                    </span>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
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
              href="https://github.com/knot0"
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
      <footer className="py-6 px-6 md:px-12 lg:px-16 border-t border-black-border">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-mono text-white-muted">
          <div className="flex items-center gap-2">
            <TrefoilLogo size={20} />
            <span>Knot0</span>
          </div>
          <div className="flex gap-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/writing" className="hover:text-white transition-colors">Writing</a>
            <a href="https://github.com/knot0" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

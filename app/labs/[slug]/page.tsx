import { Header } from '@/components/landing/Header'
import { TrefoilLogo } from '@/components/logo'
import { notFound } from 'next/navigation'

interface Tool {
  slug: string
  name: string
  tagline: string
  description: string
  status: 'stable' | 'beta' | 'experimental'
  version?: string
  github?: string
  npm?: string
  docs?: string
  install?: string
  features?: string[]
  content?: string
}

// Define your tools here
const tools: Record<string, Tool> = {
  // 'example-tool': {
  //   slug: 'example-tool',
  //   name: 'Example Tool',
  //   tagline: 'A short tagline for the tool',
  //   description: 'A longer description explaining what the tool does and why it exists.',
  //   status: 'beta',
  //   version: '0.1.0',
  //   github: 'https://github.com/knot0/example-tool',
  //   npm: 'https://www.npmjs.com/package/example-tool',
  //   install: 'npm install example-tool',
  //   features: [
  //     'Feature one description',
  //     'Feature two description',
  //     'Feature three description',
  //   ],
  //   content: `
  //     ## Getting Started
  //
  //     Add your markdown content here...
  //   `,
  // },
}

const statusColors = {
  stable: 'text-green-400 border-green-400/30 bg-green-400/10',
  beta: 'text-amber border-amber/30 bg-amber/10',
  experimental: 'text-cyan border-cyan/30 bg-cyan/10',
}

export async function generateStaticParams() {
  return Object.keys(tools).map((slug) => ({ slug }))
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = tools[slug]

  if (!tool) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 pb-16 px-6 md:px-12 lg:px-16">
        <div className="max-w-4xl">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm font-mono text-white-muted">
            <a href="/labs" className="hover:text-white transition-colors">Labs</a>
            <span className="mx-2">/</span>
            <span className="text-white">{tool.name}</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold font-mono text-amber">
                {tool.name}
              </h1>
              <span className={`text-xs font-mono px-2 py-1 rounded border ${statusColors[tool.status]}`}>
                {tool.status.toUpperCase()}
              </span>
            </div>

            <p className="text-xl text-white-dim font-mono mb-6">
              {tool.tagline}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {tool.github && (
                <a
                  href={tool.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-mono text-sm font-medium rounded hover:bg-white/90 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              )}
              {tool.npm && (
                <a
                  href={tool.npm}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black-light border border-black-border font-mono text-sm rounded hover:border-amber/50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331z"/>
                  </svg>
                  npm
                </a>
              )}
              {tool.docs && (
                <a
                  href={tool.docs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black-light border border-black-border font-mono text-sm rounded hover:border-amber/50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Docs
                </a>
              )}
            </div>
          </div>

          {/* Install command */}
          {tool.install && (
            <div className="mb-12">
              <h2 className="text-sm font-mono text-white-muted mb-3 uppercase tracking-wider">
                Install
              </h2>
              <div className="bg-black-light border border-black-border rounded-lg p-4 font-mono text-sm">
                <code className="text-cyan">{tool.install}</code>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-12">
            <h2 className="text-sm font-mono text-white-muted mb-3 uppercase tracking-wider">
              About
            </h2>
            <p className="text-white-dim font-mono leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Features */}
          {tool.features && tool.features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-sm font-mono text-white-muted mb-3 uppercase tracking-wider">
                Features
              </h2>
              <ul className="space-y-3">
                {tool.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-white-dim font-mono">
                    <span className="text-amber mt-1">→</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Version info */}
          {tool.version && (
            <div className="pt-8 border-t border-black-border">
              <p className="text-sm font-mono text-white-muted">
                Current version: <span className="text-white">{tool.version}</span>
              </p>
            </div>
          )}
        </div>
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
            <a href="/labs" className="hover:text-white transition-colors">Labs</a>
            <a href="https://github.com/knot0-com" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

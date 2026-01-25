import Link from 'next/link'
import { Header } from '@/components/landing/Header'
import { TrefoilLogo } from '@/components/logo'
import { getAllWritingPosts } from '@/lib/mdx'

export const metadata = {
  title: 'Writing - Knot0',
  description: 'Ideas behind Knot0 and the future of AI-powered operations.',
}

export default function WritingPage() {
  const posts = getAllWritingPosts()

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white font-mono">
              Writing
            </h1>
            <p className="mt-3 text-lg text-white-dim font-mono">
              Ideas behind Knot0 and the future of AI-powered operations.
            </p>
          </div>

          <div className="border border-black-border rounded-lg overflow-hidden">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group flex items-start gap-4 px-5 py-4 border-b border-black-border last:border-b-0 hover:bg-black-light/50 transition-colors"
              >
                <span className="text-white-muted font-mono text-sm pt-0.5 hidden sm:block w-6">
                  {String(posts.length - index).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-white group-hover:text-amber transition-colors font-mono font-medium truncate">
                    {post.title}
                  </h2>
                  {post.subtitle && (
                    <p className="text-white-muted font-mono text-sm mt-0.5 truncate">
                      {post.subtitle}
                    </p>
                  )}
                </div>
                <span className="text-white-muted group-hover:text-amber transition-colors font-mono text-sm flex-shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-black-border">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm font-mono text-white-muted">
          <div className="flex items-center gap-2">
            <TrefoilLogo size={20} />
            <span>Knot0</span>
          </div>
          <Link href="/" className="hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  )
}

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

          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="block group"
              >
                <article className="border border-black-border rounded-lg p-6 hover:border-amber/50 transition-colors bg-black-light">
                  <h2 className="text-xl font-semibold text-white group-hover:text-amber transition-colors font-mono">
                    {post.title}
                  </h2>
                  {post.subtitle && (
                    <p className="mt-2 text-white-dim font-mono text-sm">
                      {post.subtitle}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-amber font-mono text-sm">
                    <span className="group-hover:mr-2 transition-all">→</span>
                    <span className="ml-2">Read</span>
                  </div>
                </article>
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

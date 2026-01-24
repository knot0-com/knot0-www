import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui'
import { getAllWritingPosts } from '@/lib/mdx'

export const metadata = {
  title: 'Writing - Knot0',
  description: 'Ideas behind Knot0 and the future of AI-powered operations.',
}

export default function WritingPage() {
  const posts = getAllWritingPosts()

  return (
    <>
      <Header />
      <main id="main" className="py-24">
        <Container size="md">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-ink">
              Writing
            </h1>
            <p className="mt-4 text-xl text-ink/70 max-w-2xl mx-auto">
              Ideas behind Knot0 and the future of AI-powered operations.
            </p>
          </div>

          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="block group"
              >
                <article className="bg-warm-white border border-ink/10 rounded-xl p-8 hover:border-ink/20 transition-colors">
                  <h2 className="text-2xl font-semibold text-ink group-hover:text-safety-orange transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-lg text-ink/70">
                    {post.subtitle}
                  </p>
                  <div className="mt-4 flex items-center text-safety-orange font-medium">
                    Read
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}

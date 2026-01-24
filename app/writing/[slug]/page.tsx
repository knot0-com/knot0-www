import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui'
import { getWritingPost, getAdjacentPosts, getAllWritingPosts } from '@/lib/mdx'
import { mdxComponents } from '@/components/mdx'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllWritingPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = getWritingPost(slug)
  if (!post) return {}

  return {
    title: `${post.title} - Knot0`,
    description: post.subtitle,
  }
}

export default async function WritingArticlePage({ params }: PageProps) {
  const { slug } = await params
  const post = getWritingPost(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)

  return (
    <>
      <Header />
      <main id="main" className="py-16">
        <Container size="sm">
          <Link
            href="/writing"
            className="inline-flex items-center text-ink/60 hover:text-ink transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            All writing
          </Link>

          <article>
            <header className="mb-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold text-ink text-balance">
                {post.title}
              </h1>
              <p className="mt-4 text-xl text-ink/70">
                {post.subtitle}
              </p>
            </header>

            <div className="prose prose-lg max-w-none">
              <MDXRemote source={post.content} components={mdxComponents} />
            </div>
          </article>

          {(prev || next) && (
            <nav className="mt-16 pt-8 border-t border-ink/10">
              <div className="text-sm text-ink/60 mb-4">Continue reading</div>
              <div className="flex justify-between gap-4">
                {prev ? (
                  <Link
                    href={`/writing/${prev.slug}`}
                    className="flex-1 group"
                  >
                    <div className="flex items-center text-ink/60 group-hover:text-ink transition-colors">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span className="font-medium">{prev.title}</span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {next && (
                  <Link
                    href={`/writing/${next.slug}`}
                    className="flex-1 text-right group"
                  >
                    <div className="flex items-center justify-end text-ink/60 group-hover:text-ink transition-colors">
                      <span className="font-medium">{next.title}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </Container>
      </main>
      <Footer />
    </>
  )
}

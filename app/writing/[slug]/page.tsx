import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypePrettyCode from 'rehype-pretty-code'
import { Header } from '@/components/landing/Header'
import { TrefoilLogo } from '@/components/logo'
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
    openGraph: {
      title: `${post.title} - Knot0`,
      description: post.subtitle,
      url: `https://www.knot0.com/writing/${slug}`,
      type: 'article',
    },
  }
}

export default async function WritingArticlePage({ params }: PageProps) {
  const { slug } = await params
  const post = getWritingPost(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.subtitle,
    url: `https://www.knot0.com/writing/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Knot0',
      url: 'https://www.knot0.com',
    },
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header />

      <main className="pt-20 2xl:pt-28 pb-16 2xl:pb-24 px-6 md:px-12 lg:px-16 2xl:px-24">
        <div className="max-w-2xl 2xl:max-w-3xl mx-auto">
          <Link
            href="/writing"
            className="inline-flex items-center text-white-muted hover:text-amber transition-colors mb-8 font-mono text-sm"
          >
            ← All writing
          </Link>

          <article>
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl 2xl:text-5xl font-bold text-white font-mono">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="mt-3 text-lg 2xl:text-xl text-white-dim font-mono">
                  {post.subtitle}
                </p>
              )}
            </header>

            <div className="prose prose-invert prose-amber max-w-none font-mono text-white-dim 2xl:text-lg 2xl:leading-relaxed prose-headings:text-white prose-headings:font-mono prose-a:text-amber prose-strong:text-white prose-code:text-cyan prose-code:bg-black-light prose-code:px-1 prose-code:rounded prose-pre:bg-black-light prose-pre:border prose-pre:border-black-border">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      [rehypePrettyCode, {
                        theme: 'vesper',
                        keepBackground: false,
                      }],
                    ],
                  },
                }}
              />
            </div>
          </article>

          {(prev || next) && (
            <nav className="mt-12 pt-8 border-t border-black-border">
              <div className="text-xs text-white-muted mb-4 font-mono">CONTINUE READING</div>
              <div className="flex justify-between gap-4">
                {prev ? (
                  <Link
                    href={`/writing/${prev.slug}`}
                    className="flex-1 group"
                  >
                    <div className="text-white-dim group-hover:text-amber transition-colors font-mono text-sm">
                      ← {prev.title}
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
                    <div className="text-white-dim group-hover:text-amber transition-colors font-mono text-sm">
                      {next.title} →
                    </div>
                  </Link>
                )}
              </div>
            </nav>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 2xl:py-8 px-6 md:px-12 lg:px-16 2xl:px-24 border-t border-black-border">
        <div className="max-w-2xl 2xl:max-w-3xl mx-auto flex items-center justify-between text-sm 2xl:text-base font-mono text-white-muted">
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

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const writingDirectory = path.join(process.cwd(), 'content/writing')

export interface WritingPost {
  slug: string
  title: string
  subtitle: string
  order: number
  content: string
}

export function getAllWritingPosts(): WritingPost[] {
  if (!fs.existsSync(writingDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(writingDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(writingDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title,
        subtitle: data.subtitle,
        order: data.order,
        content,
      }
    })
    .sort((a, b) => a.order - b.order)

  return posts
}

export function getWritingPost(slug: string): WritingPost | null {
  const fullPath = path.join(writingDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) return null

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    subtitle: data.subtitle,
    order: data.order,
    content,
  }
}

export function getAdjacentPosts(currentSlug: string) {
  const posts = getAllWritingPosts()
  const currentIndex = posts.findIndex((p) => p.slug === currentSlug)

  return {
    prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  }
}

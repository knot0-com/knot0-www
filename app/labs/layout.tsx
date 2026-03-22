import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Labs - Knot0',
  description: 'Open source tools and experiments from the Knot0 team.',
  openGraph: {
    title: 'Labs - Knot0',
    description: 'Open source tools and experiments from the Knot0 team.',
    url: 'https://www.knot0.com/labs',
  },
}

export default function LabsLayout({ children }: { children: React.ReactNode }) {
  return children
}

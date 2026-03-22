import { LandingPage } from '@/components/landing'

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Knot0',
            url: 'https://www.knot0.com',
            logo: 'https://www.knot0.com/logo/knot0-trefoil.svg',
            description: 'Software that writes itself. And never stops.',
            sameAs: ['https://github.com/knot0-com'],
          }),
        }}
      />
      <LandingPage />
    </>
  )
}

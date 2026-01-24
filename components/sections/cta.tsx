import Link from 'next/link'
import { Button, Container } from '@/components/ui'

export function CTA() {
  return (
    <section className="py-24 bg-warm-white">
      <Container size="sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-ink">
            Deploy your first runner in 5 minutes.
          </h2>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
          </div>
          <p className="mt-4 text-ink/60">
            Free tier. No credit card.
          </p>
        </div>
      </Container>
    </section>
  )
}

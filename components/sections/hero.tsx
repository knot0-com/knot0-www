import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import { AgentDemo } from '@/components/hero/agent-demo'

export function Hero() {
  return (
    <section className="pt-20 pb-32 bg-grid">
      <Container>
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-ink text-balance leading-tight">
            AI that builds and runs automations.
            <span className="block text-safety-orange">Governed.</span>
          </h1>

          <p className="mt-8 text-xl text-ink/70 max-w-2xl mx-auto">
            Describe what you need. Agent discovers context and writes the code.
            Runners execute it anywhere. You stay in control.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/get-started">Get Started</Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link href="/demo" className="group">
                See it work
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <AgentDemo />
        </div>
      </Container>
    </section>
  )
}

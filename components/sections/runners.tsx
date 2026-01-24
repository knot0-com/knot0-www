import { Cloud, Building2, Factory, Monitor } from 'lucide-react'
import { Container, CodeBlock } from '@/components/ui'

const environments = [
  { icon: Cloud, label: 'CLOUD', examples: 'AWS, GCP, Azure' },
  { icon: Building2, label: 'ON-PREM', examples: 'VMs, K8s, Databases' },
  { icon: Factory, label: 'EDGE', examples: 'IoT, Retail' },
  { icon: Monitor, label: 'LEGACY', examples: 'Windows, ERPs' },
]

const capabilities = [
  'Behind firewalls',
  'Air-gapped networks',
  'Legacy systems',
  'Edge devices',
]

export function Runners() {
  return (
    <section className="py-24 bg-warm-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ink">
            Execute anywhere.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {environments.map(({ icon: Icon, label, examples }) => (
            <div
              key={label}
              className="bg-ink/5 rounded-xl p-6 text-center hover:bg-ink/10 transition-colors"
            >
              <Icon className="w-10 h-10 text-muted-cyan mx-auto mb-4" />
              <div className="font-medium text-ink mb-1">{label}</div>
              <div className="text-sm text-ink/60">{examples}</div>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto">
          <CodeBlock code="$ curl -fsSL https://knot0.com/install | sh" />
          <p className="text-center mt-4 text-lg font-medium text-ink">
            60 seconds to deploy.
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="text-ink/70 mb-4">Runners reach systems that APIs can't:</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {capabilities.map((cap) => (
              <span key={cap} className="text-ink/80">• {cap}</span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

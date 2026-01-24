import { AlertTriangle, Search, Shield, Wrench, BarChart, RefreshCw } from 'lucide-react'
import { Container } from '@/components/ui'

const useCases = [
  {
    icon: AlertTriangle,
    label: 'Incidents',
    steps: ['Alert', 'Discover', 'Fix', 'Verify'],
  },
  {
    icon: Search,
    label: 'Monitoring',
    steps: ['Watch', 'Discover', 'Spot', 'Prevent'],
  },
  {
    icon: Shield,
    label: 'Security',
    steps: ['Detect', 'Isolate', 'Investigate', 'Report'],
  },
  {
    icon: Wrench,
    label: 'Infra',
    steps: ['Scale', 'Deploy', 'Configure'],
  },
  {
    icon: BarChart,
    label: 'Compliance',
    steps: ['Audit', 'Report', 'Remediate'],
  },
  {
    icon: RefreshCw,
    label: 'Maintenance',
    steps: ['Detect drift', 'Generate fix', 'Apply'],
  },
]

export function UseCases() {
  return (
    <section className="py-24 bg-warm-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ink">
            What teams use it for.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map(({ icon: Icon, label, steps }) => (
            <div
              key={label}
              className="bg-ink/5 rounded-xl p-6 hover:bg-ink/10 transition-colors"
            >
              <Icon className="w-8 h-8 text-safety-orange mb-4" />
              <div className="text-lg font-medium text-ink mb-3">{label}</div>
              <div className="text-sm text-ink/70">
                {steps.map((step, i) => (
                  <span key={step}>
                    {step}
                    {i < steps.length - 1 && ' → '}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

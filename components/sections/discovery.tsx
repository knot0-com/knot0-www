import { Container } from '@/components/ui'
import { DependencyGraph } from '@/components/discovery/dependency-graph'

const contextItems = [
  'What depends on this service',
  'Who owns it and who's oncall',
  'What changed recently',
  'What the blast radius is',
]

export function Discovery() {
  return (
    <section className="py-24 bg-ink/5">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ink text-balance">
            It learns your infrastructure.
          </h2>
          <p className="mt-4 text-lg text-ink/70 max-w-2xl mx-auto">
            Runners discover your systems automatically. No manual inventory. No stale CMDBs.
            A live map that updates as your systems change.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <DependencyGraph />

          <div>
            <h3 className="text-2xl font-semibold text-ink mb-6">
              Before acting, the agent knows:
            </h3>
            <ul className="space-y-4">
              {contextItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-safety-orange mt-2 flex-shrink-0" />
                  <span className="text-ink/80">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-lg font-medium text-ink">
              Context-aware actions. Not blind guessing.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}

import { FileCode, GitBranch, Layout } from 'lucide-react'
import { Container } from '@/components/ui'

const tiers = [
  {
    icon: FileCode,
    label: 'SCRIPTS',
    description: 'One-shot automations',
    examples: ['Health check', 'Log cleanup', 'Alert script'],
  },
  {
    icon: GitBranch,
    label: 'WORKFLOWS',
    description: 'Multi-step processes',
    examples: ['Incident response', 'Data ETL', 'Approval flows'],
  },
  {
    icon: Layout,
    label: 'APPS',
    description: 'When your automation needs more',
    examples: ['Dashboards', 'Internal tools', 'Frontend + API + DB'],
  },
]

export function SyntheticSoftware() {
  return (
    <section className="py-24 bg-ink/5">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ink text-balance">
            From fix to forever.
          </h2>
          <p className="mt-4 text-lg text-ink/70 max-w-2xl mx-auto">
            One-off solutions become permanent tools.
            No engineering backlog. No maintenance burden.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-ink text-center mb-8">
            From scripts to full apps. When you need it.
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map(({ icon: Icon, label, description, examples }) => (
              <div
                key={label}
                className="bg-warm-white rounded-xl p-6 border border-ink/10"
              >
                <Icon className="w-10 h-10 text-safety-orange mb-4" />
                <div className="text-lg font-medium text-ink mb-1">{label}</div>
                <div className="text-sm text-ink/60 mb-4">{description}</div>
                <ul className="space-y-2">
                  {examples.map((ex) => (
                    <li key={ex} className="text-sm text-ink/80 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-ink/40" />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xl font-medium text-ink">
          Start with a script. Grow into a workflow. Scale to an app.
        </p>
      </Container>
    </section>
  )
}

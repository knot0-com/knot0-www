import { Shield, UserCheck, FileText } from 'lucide-react'
import { Container } from '@/components/ui'

const pillars = [
  {
    icon: Shield,
    label: 'POLICY',
    description: "What's allowed",
    content: ['allow:', '  restart', '  scale', 'deny:', '  delete', '  drop'],
  },
  {
    icon: UserCheck,
    label: 'APPROVAL',
    description: 'Human-in-loop',
    isApproval: true,
  },
  {
    icon: FileText,
    label: 'JOURNAL',
    description: 'Complete audit',
    content: ['14:32:01 investigate', '14:32:05 approved', 'by: alice'],
  },
]

const trustLevels = [
  { emoji: '🆕', label: 'New', description: 'All actions need approval' },
  { emoji: '👁', label: 'Supervised', description: 'Human reviews each run' },
  { emoji: '✅', label: 'Trusted', description: 'Runs within policy limits' },
  { emoji: '⏸', label: 'Suspended', description: 'Requires investigation' },
]

export function Governance() {
  return (
    <section className="py-24 bg-warm-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ink">
            You stay in control.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map(({ icon: Icon, label, description, content, isApproval }) => (
            <div key={label} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-ink/5 mb-4">
                <Icon className="w-6 h-6 text-ink" />
              </div>
              <div className="font-medium text-ink mb-1">{label}</div>
              <div className="text-sm text-ink/60 mb-4">{description}</div>

              <div className="bg-ink rounded-lg p-4 text-left font-mono text-xs">
                {isApproval ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-safety-orange">
                      <span>⚠</span>
                      <span>restart payment</span>
                    </div>
                    <div className="text-white/50">blast: high</div>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded">✓</span>
                      <span className="px-2 py-1 bg-white/10 text-white/50 rounded">✗</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-white/80">
                    {content?.map((line, i) => (
                      <div key={i} className={line.startsWith(' ') ? 'pl-4' : ''}>
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-lg text-ink/70 mb-12">
          Every action logged. Risky actions approved. Always.
        </p>

        <div className="border-t border-ink/10 pt-12">
          <h3 className="text-center text-lg font-medium text-ink mb-8">
            TRUST PROGRESSION
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {trustLevels.map(({ emoji, label, description }) => (
              <div key={label} className="text-center max-w-[150px]">
                <div className="text-3xl mb-2">{emoji}</div>
                <div className="font-medium text-ink">{label}</div>
                <div className="text-sm text-ink/60">{description}</div>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-ink font-medium">
            Autonomy is earned, not assumed.
          </p>
        </div>
      </Container>
    </section>
  )
}

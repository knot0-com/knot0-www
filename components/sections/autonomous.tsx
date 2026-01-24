import { Container } from '@/components/ui'
import { Zap, AlertTriangle } from 'lucide-react'

const activityLog = [
  {
    time: '03:14',
    type: 'resolved',
    title: 'Detected: memory pressure on worker-3',
    steps: [
      'Discovered: 2 dependent services',
      'Synthesized: scale-up script',
      'Deployed to: k8s-prod runner',
    ],
    result: '✓ resolved in 47s',
  },
  {
    time: '07:22',
    type: 'resolved',
    title: 'Detected: certificate expiring in 48h',
    steps: [
      'Synthesized: renewal automation',
      'Deployed to: infra runner',
    ],
    result: '✓ renewed, 90 days remaining',
  },
  {
    time: '11:45',
    type: 'pending',
    title: 'Detected: unusual traffic pattern',
    steps: [
      'Discovered: blast radius spans 4 services',
      'Synthesized: rate-limit adjustment',
    ],
    result: 'awaiting approval (high impact)',
  },
]

export function Autonomous() {
  return (
    <section className="py-24 bg-ink text-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-balance">
            It doesn't sleep.
          </h2>
        </div>

        <div className="max-w-3xl mx-auto bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="font-mono text-sm">
              AUTONOMOUS AGENT: <span className="text-muted-cyan">prod-ops</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Running 24/7
            </div>
          </div>

          <div className="p-6">
            <div className="text-sm text-white/50 mb-4">Last 24 hours:</div>

            <div className="space-y-6">
              {activityLog.map((item, i) => (
                <div key={i} className="font-mono text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-white/50 tabular-nums">{item.time}</span>
                    {item.type === 'resolved' ? (
                      <Zap className="w-4 h-4 text-muted-cyan flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-safety-orange flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="text-white">{item.title}</div>
                      <div className="mt-2 space-y-1 text-white/60">
                        {item.steps.map((step, j) => (
                          <div key={j}>→ {step}</div>
                        ))}
                      </div>
                      <div className={`mt-2 ${item.type === 'resolved' ? 'text-green-400' : 'text-safety-orange'}`}>
                        → Result: {item.result}
                      </div>
                      {item.type === 'pending' ? (
                        <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-white/10 text-white rounded text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                            Deny
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/10 flex justify-between text-sm">
            <span>Auto-resolved: <strong className="text-green-400">12</strong></span>
            <span>Awaiting approval: <strong className="text-safety-orange">1</strong></span>
            <span>Alerts: <strong>0</strong></span>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-2xl">
            You woke up to 12 issues already resolved.
          </p>
          <p className="text-xl text-white/70 mt-2">
            One decision waiting. Zero fires.
          </p>
          <p className="mt-8 text-white/50">
            Still governed. Still audited. Always.
          </p>
        </div>
      </Container>
    </section>
  )
}

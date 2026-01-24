import { Check, Minus, Circle } from 'lucide-react'
import { Container } from '@/components/ui'

const features = [
  { name: 'AI-native', knot0: 'yes', pagerduty: 'no', rundeck: 'no', zapier: 'no', soar: 'no' },
  { name: 'Auto-discovery', knot0: 'yes', pagerduty: 'no', rundeck: 'no', zapier: 'no', soar: 'no' },
  { name: 'JIT synthesis', knot0: 'yes', pagerduty: 'no', rundeck: 'no', zapier: 'no', soar: 'no' },
  { name: 'Scripts → Apps', knot0: 'yes', pagerduty: 'no', rundeck: 'no', zapier: 'no', soar: 'no' },
  { name: 'Runs anywhere', knot0: 'yes', pagerduty: 'no', rundeck: 'partial', zapier: 'no', soar: 'partial' },
  { name: '24/7 autonomous', knot0: 'yes', pagerduty: 'no', rundeck: 'no', zapier: 'no', soar: 'partial' },
  { name: 'Governed', knot0: 'yes', pagerduty: 'partial', rundeck: 'partial', zapier: 'no', soar: 'yes' },
]

const competitors = ['Knot0', 'PagerDuty', 'Rundeck', 'Zapier', 'SOAR']

function StatusIcon({ status }: { status: string }) {
  if (status === 'yes') return <Check className="w-5 h-5 text-green-500 mx-auto" />
  if (status === 'partial') return <Circle className="w-5 h-5 text-yellow-500 fill-current mx-auto" />
  return <Minus className="w-5 h-5 text-ink/30 mx-auto" />
}

export function Comparison() {
  return (
    <section className="py-24 bg-ink/5">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ink">
            How we're different.
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-ink/10">
                <th className="text-left py-4 pr-4 font-medium text-ink/60" />
                {competitors.map((comp) => (
                  <th
                    key={comp}
                    className={`py-4 px-4 text-center font-medium ${
                      comp === 'Knot0' ? 'text-safety-orange' : 'text-ink/60'
                    }`}
                  >
                    {comp}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} className="border-b border-ink/5">
                  <td className="py-4 pr-4 text-ink">{feature.name}</td>
                  <td className="py-4 px-4 text-center">
                    <StatusIcon status={feature.knot0} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusIcon status={feature.pagerduty} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusIcon status={feature.rundeck} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusIcon status={feature.zapier} />
                  </td>
                  <td className="py-4 px-4 text-center">
                    <StatusIcon status={feature.soar} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center gap-8 text-sm text-ink/60">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" /> Yes
          </span>
          <span className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-yellow-500 fill-current" /> Partial
          </span>
          <span className="flex items-center gap-2">
            <Minus className="w-4 h-4 text-ink/30" /> No
          </span>
        </div>
      </Container>
    </section>
  )
}

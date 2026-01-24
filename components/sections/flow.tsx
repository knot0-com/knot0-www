'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageSquare, Search, Zap, Play, CheckCircle } from 'lucide-react'
import { Container } from '@/components/ui'

const steps = [
  {
    icon: MessageSquare,
    label: 'INTENT',
    description: '"Fix the latency"',
  },
  {
    icon: Search,
    label: 'DISCOVER',
    description: 'Map deps, owners, blast radius',
  },
  {
    icon: Zap,
    label: 'SYNTHESIZE',
    description: 'Generate the fix',
  },
  {
    icon: Play,
    label: 'EXECUTE',
    description: 'Run on any runner',
  },
  {
    icon: CheckCircle,
    label: 'GOVERNED',
    description: 'Policy, approval, journal',
  },
]

export function Flow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-warm-white">
      <Container>
        <div ref={ref} className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-ink/5 flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-ink" />
              </div>
              <div className="text-sm font-medium text-ink mb-1">{step.label}</div>
              <div className="text-sm text-ink/60 max-w-[140px]">{step.description}</div>

              {/* Connector arrow (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-full top-8 w-8 h-0.5 bg-ink/20 -translate-x-2" />
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

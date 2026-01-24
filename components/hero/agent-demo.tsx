'use client'

import { useState, useEffect, memo } from 'react'
import { Check, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

// Rule: rendering-hoist-jsx - hoist static data outside component
const steps = [
  { time: '14:32:01', label: 'investigate', done: true },
  { time: '14:32:03', label: 'discover', done: true },
  { time: '14:32:05', label: 'synthesize', done: true },
] as const

// Rule: rendering-hoist-jsx - hoist static JSX
const WindowControls = (
  <div className="flex gap-1.5">
    <div className="w-3 h-3 rounded-full bg-red-500" />
    <div className="w-3 h-3 rounded-full bg-yellow-500" />
    <div className="w-3 h-3 rounded-full bg-green-500" />
  </div>
)

const SynthesizedAction = (
  <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
    <div className="text-white/50 mb-2"># Synthesized action</div>
    <div className="text-muted-cyan">kubectl rollout undo deployment/payment-svc</div>
    <div className="text-muted-cyan">kubectl wait --for=condition=available …</div>
  </div>
)

// Rule: rerender-memo - memoize component with internal state
export const AgentDemo = memo(function AgentDemo() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-ink rounded-xl border border-ink/20 shadow-2xl overflow-hidden">
      <div className="bg-ink/50 px-4 py-2 border-b border-white/10 flex items-center gap-2">
        {WindowControls}
        <span className="text-white/50 text-sm font-mono ml-2">agent-console</span>
      </div>

      <div className="p-6 font-mono text-sm">
        <div className="text-safety-orange mb-4">
          ▼ payment-service latency &gt; 500ms
        </div>

        <div className="text-white/70 mb-4">Agent is investigating…</div>

        <div className="space-y-2 mb-6">
          <div className={cn('flex items-center gap-2 transition-opacity', currentStep >= 1 ? 'opacity-100' : 'opacity-30')}>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-white/90">Queried metrics</span>
            <span className="text-muted-cyan">(runner: k8s-prod)</span>
          </div>
          <div className={cn('flex items-center gap-2 transition-opacity', currentStep >= 2 ? 'opacity-100' : 'opacity-30')}>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-white/90">Checked dependencies</span>
            <span className="text-muted-cyan">(4 services affected)</span>
          </div>
          <div className={cn('flex items-center gap-2 transition-opacity', currentStep >= 3 ? 'opacity-100' : 'opacity-30')}>
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-white/90">Found: memory leak after commit</span>
            <span className="text-safety-orange">a7ef82</span>
          </div>
        </div>

        {SynthesizedAction}

        <div className="flex items-center justify-between bg-safety-orange/10 rounded-lg p-4 border border-safety-orange/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-safety-orange" />
            <span className="text-white">Approval required</span>
            <span className="text-white/50">(blast radius: high)</span>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              Approve
            </button>
            <button className="px-4 py-1.5 bg-white/10 text-white rounded text-sm font-medium hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
              Deny
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 py-3 border-t border-white/10 flex items-center gap-6 text-xs font-mono">
        {steps.map((step, i) => (
          <div key={step.label} className={cn('flex items-center gap-2', currentStep > i ? 'text-white' : 'text-white/30')}>
            <span className="tabular-nums">{step.time}</span>
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

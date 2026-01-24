'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface AgentPanelProps {
  animate: boolean
}

const AGENT_STEPS = [
  { label: 'discovering dependencies', result: 'payment-svc → 4 svcs' },
  { label: 'querying metrics', result: 'p99: 847ms (goal<200)' },
  { label: 'reading recent commits', result: 'found: a7ef82' },
  { label: 'identifying root cause', result: 'memory leak in cache' },
  { label: 'synthesizing fix', result: null },
]

export function AgentPanel({ animate }: AgentPanelProps) {
  const [currentStep, setCurrentStep] = useState(animate ? 0 : AGENT_STEPS.length)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!animate) return

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, AGENT_STEPS.length))
    }, 800)

    const timeInterval = setInterval(() => {
      setElapsed(prev => prev + 0.1)
    }, 100)

    return () => {
      clearInterval(stepInterval)
      clearInterval(timeInterval)
    }
  }, [animate])

  return (
    <div className="h-full p-8 font-mono text-sm overflow-auto">
      {/* User prompt */}
      <div className="mb-6">
        <div className="text-white-dim mb-2">YOU SAY:</div>
        <div className="text-cyan">&gt; "fix the payment service latency"</div>
      </div>

      <div className="border-t border-black-border my-6" />

      {/* Agent working */}
      <div className="mb-6">
        <div className="flex justify-between mb-4">
          <span className="text-white-dim">AGENT WORKS:</span>
          <span className="text-white-muted">elapsed: {elapsed.toFixed(1)}s</span>
        </div>

        <div className="space-y-2">
          {AGENT_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-2"
              initial={animate ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: currentStep > i ? 1 : 0.3 }}
              transition={{ duration: 0.2 }}
            >
              <span className={currentStep > i ? 'text-cyan' : currentStep === i ? 'text-amber' : 'text-white-muted'}>
                {currentStep > i ? '' : currentStep === i ? '' : ''}
              </span>
              <span className="text-white-dim">{step.label}</span>
              <span className="text-white-muted flex-1">{'.'}</span>
              {currentStep > i && step.result && (
                <span className="text-cyan">{step.result}</span>
              )}
              {currentStep === i && !step.result && (
                <span className="text-amber">[streaming...]</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Proposed action */}
      {currentStep >= AGENT_STEPS.length && (
        <motion.div
          initial={animate ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="border border-amber/30 rounded p-4 mb-4 bg-amber/5">
            <div className="text-amber mb-2 text-xs"> PROPOSED ACTION </div>
            <div className="text-cyan">kubectl rollout undo deployment/payment-svc</div>
            <div className="text-cyan">kubectl wait --for=condition=available deployment/...</div>
          </div>

          <div className="text-amber mb-4">
            blast radius: HIGH (4 downstream services)
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-cyan text-black font-bold rounded hover:bg-cyan-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              APPROVE
            </button>
            <button className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              DENY
            </button>
            <button className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              EDIT
            </button>
            <button className="px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              EXPLAIN
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

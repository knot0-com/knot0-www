'use client'

import { motion } from 'framer-motion'

interface GovernancePanelProps {
  animate: boolean
}

const POLICIES = [
  'require approval for blast-radius > medium',
  'block all DELETE operations in production',
  'notify #oncall before any kubectl exec',
]

const AUDIT_LOG = [
  { time: '14:32:07', action: 'approval/pending', target: 'awaiting', actor: 'maria' },
  { time: '14:32:05', action: 'governance/review', target: 'blast-radius:H', actor: 'system' },
  { time: '14:32:01', action: 'agent/synthesize', target: 'payment-fix', actor: 'maria' },
  { time: '14:31:44', action: 'runner/execute', target: 'cache-clear', actor: 'auto' },
  { time: '14:31:02', action: 'agent/discover', target: 'deps mapped', actor: 'system' },
]

export function GovernancePanel({ animate }: GovernancePanelProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  return (
    <motion.div
      className="h-full p-8 font-mono text-sm"
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-white text-lg">GOVERNANCE</span>
        <span className="text-amber">"Three Laws" compliant</span>
      </div>

      {/* Policies */}
      <motion.div
        className="border border-black-border rounded p-4 mb-6"
        variants={animate ? itemVariants : undefined}
      >
        <div className="text-white-muted text-xs mb-3"> POLICIES </div>
        <div className="space-y-2">
          {POLICIES.map((policy) => (
            <div key={policy} className="flex items-center gap-2">
              <span className="text-cyan"></span>
              <span className="text-white-dim">{policy}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-white-muted cursor-pointer hover:text-white transition-colors">
            <span>+</span>
            <span>add policy...</span>
          </div>
        </div>
      </motion.div>

      {/* Audit log */}
      <motion.div
        className="border border-black-border rounded p-4 mb-6"
        variants={animate ? itemVariants : undefined}
      >
        <div className="text-white-muted text-xs mb-3"> AUDIT LOG </div>
        <div className="space-y-1">
          {AUDIT_LOG.map((entry, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 text-xs">
              <span className="text-white-muted tabular-nums">{entry.time}</span>
              <span className="text-cyan">{entry.action}</span>
              <span className="text-white-dim">{entry.target}</span>
              <span className="text-white-muted">{entry.actor}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="flex gap-8 text-xs"
        variants={animate ? itemVariants : undefined}
      >
        <div>
          <span className="text-white-dim">APPROVALS: </span>
          <span className="text-amber">2 pending</span>
        </div>
        <div>
          <span className="text-white-dim">BLOCKED: </span>
          <span className="text-cyan">0</span>
        </div>
        <div>
          <span className="text-white-dim">AUTO-APPROVED: </span>
          <span className="text-cyan">1,203</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'

interface RunnersPanelProps {
  animate: boolean
}

const RUNNERS = [
  { name: 'k8s-prod-01', location: 'us-east-1', status: 'online', lastJob: '2m ago' },
  { name: 'k8s-prod-02', location: 'us-west-2', status: 'online', lastJob: '14s ago' },
  { name: 'edge-berlin', location: 'eu-central', status: 'online', lastJob: '1h ago' },
  { name: 'laptop-maria', location: 'local', status: 'busy', lastJob: 'running...' },
  { name: 'raspberry-pi-03', location: 'office', status: 'offline', lastJob: '3d ago' },
  { name: 'aws-lambda-pool', location: 'multi-region', status: 'online', lastJob: '< 1s ago' },
]

const PLATFORMS = ['K8S', 'DOCKER', 'AWS', 'LOCAL', 'WASM']

function StatusDot({ status }: { status: string }) {
  const colors = {
    online: 'text-cyan',
    busy: 'text-amber animate-pulse',
    offline: 'text-white-muted',
  }
  const symbols = { online: '', busy: '', offline: '' }
  return (
    <span className={colors[status as keyof typeof colors]}>
      {symbols[status as keyof typeof symbols]}
    </span>
  )
}

export function RunnersPanel({ animate }: RunnersPanelProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className="h-full p-8 font-mono text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-white text-lg">RUNNER FLEET</span>
        <span className="text-cyan">{RUNNERS.filter(r => r.status !== 'offline').length} connected</span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-4 gap-4 text-white-muted text-xs mb-2 pb-2 border-b border-black-border">
        <span>NAME</span>
        <span>LOCATION</span>
        <span>STATUS</span>
        <span>LAST JOB</span>
      </div>

      {/* Runner rows */}
      <motion.div
        className="space-y-1 mb-8"
        variants={animate ? containerVariants : undefined}
        initial={animate ? 'hidden' : 'visible'}
        animate="visible"
      >
        {RUNNERS.map((runner) => (
          <motion.div
            key={runner.name}
            className="grid grid-cols-4 gap-4 py-2 hover:bg-black-light transition-colors rounded"
            variants={animate ? rowVariants : undefined}
          >
            <span className="text-white">{runner.name}</span>
            <span className="text-white-dim">{runner.location}</span>
            <span className="flex items-center gap-2">
              <StatusDot status={runner.status} />
              <span className={runner.status === 'offline' ? 'text-white-muted' : 'text-white-dim'}>
                {runner.status}
              </span>
            </span>
            <span className="text-white-dim">{runner.lastJob}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="border-t border-black-border my-6" />

      {/* Platforms */}
      <div className="text-white-dim mb-4">RUNS ANYWHERE:</div>
      <div className="flex gap-4 mb-6">
        {PLATFORMS.map((platform) => (
          <div
            key={platform}
            className="px-6 py-3 border border-black-border rounded text-white-dim hover:border-cyan hover:text-cyan transition-colors cursor-pointer"
          >
            {platform}
          </div>
        ))}
      </div>

      <div className="text-white-muted">
        Your infra. Your rules. No vendor lock-in.
      </div>
    </div>
  )
}

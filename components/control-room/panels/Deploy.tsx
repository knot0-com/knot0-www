'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface DeployPanelProps {
  animate: boolean
}

const INSTALL_COMMAND = 'curl -fsSL https://knot0.com/install | sh'

const STEPS = [
  { label: 'Install CLI', status: 'current' },
  { label: 'Connect runner', status: 'next' },
  { label: 'Run first job', status: 'pending' },
]

const PLATFORMS = ['DOCKER', 'KUBERNETES', 'AWS', 'GITHUB ACTIONS']

export function DeployPanel({ animate }: DeployPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTALL_COMMAND)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      className="h-full p-8 font-mono text-sm"
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center mb-8"
        variants={animate ? itemVariants : undefined}
      >
        <span className="text-white text-lg">DEPLOY YOUR FIRST RUNNER</span>
        <span className="text-white-dim">~ 2 minutes</span>
      </motion.div>

      {/* Command box */}
      <motion.div
        className="border border-black-border rounded p-4 mb-6 bg-black-light"
        variants={animate ? itemVariants : undefined}
      >
        <div className="flex items-center justify-between">
          <code className="text-cyan">$ {INSTALL_COMMAND}</code>
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-amber/20 text-amber rounded text-xs hover:bg-amber/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>
      </motion.div>

      {/* Steps */}
      <motion.div
        className="space-y-2 mb-8"
        variants={animate ? itemVariants : undefined}
      >
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center gap-4">
            <span className="text-white-dim">STEP {i + 1} of 3:</span>
            <span className="text-white">{step.label}</span>
            <span className={
              step.status === 'current' ? 'text-amber' :
              step.status === 'next' ? 'text-white-muted' :
              'text-white-muted'
            }>
              {step.status === 'current' ? ' current' :
               step.status === 'next' ? ' next' :
               ' pending'}
            </span>
          </div>
        ))}
      </motion.div>

      <div className="border-t border-black-border my-6" />

      {/* Waiting indicator */}
      <motion.div
        className="space-y-2 mb-8 text-white-dim"
        variants={animate ? itemVariants : undefined}
      >
        <div> Waiting for installation...</div>
        <div> Run the command above, then watch this space.</div>
        <div></div>
        <div className="flex items-center gap-2">
           <span className="text-amber animate-pulse"></span> listening for runner connection...
        </div>
      </motion.div>

      <div className="border-t border-black-border my-6" />

      {/* Alternative platforms */}
      <motion.div variants={animate ? itemVariants : undefined}>
        <div className="text-white-muted mb-4">OR:</div>
        <div className="flex gap-3">
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              className="px-4 py-2 border border-black-border rounded text-white-dim hover:border-cyan hover:text-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {platform}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

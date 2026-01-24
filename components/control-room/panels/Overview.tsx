'use client'

import { motion } from 'framer-motion'
import { TickingNumber } from '../effects/TickingNumber'

interface OverviewPanelProps {
  animate: boolean
}

export function OverviewPanel({ animate }: OverviewPanelProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  }

  return (
    <motion.div
      className="h-full grid grid-cols-2 gap-0"
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
    >
      {/* Left: Hero messaging */}
      <div className="flex flex-col justify-center p-12 border-r border-black-border">
        <motion.div variants={animate ? itemVariants : undefined}>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            <span className="text-white">AI THAT BUILDS AND RUNS</span>
            <br />
            <span className="text-white">AUTOMATIONS.</span>
          </h1>
        </motion.div>

        <motion.div variants={animate ? itemVariants : undefined}>
          <p className="text-3xl font-bold text-amber glow-amber mb-8">
            GOVERNED.
          </p>
        </motion.div>

        <motion.div variants={animate ? itemVariants : undefined}>
          <p className="text-white-dim text-lg leading-relaxed mb-8 max-w-md">
            Describe intent. Agent discovers context.
            <br />
            Runners execute anywhere.
            <br />
            You stay in control.
          </p>
        </motion.div>

        <motion.div variants={animate ? itemVariants : undefined} className="flex gap-4">
          <button className="px-6 py-3 bg-amber text-black font-bold rounded hover:bg-amber-dim transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            GET STARTED
          </button>
          <button className="px-6 py-3 border border-white-muted text-white rounded hover:border-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            WATCH DEMO
          </button>
        </motion.div>
      </div>

      {/* Right: Live dashboard */}
      <div className="flex flex-col p-8 font-mono text-sm">
        <motion.div variants={animate ? itemVariants : undefined}>
          <div className="text-white-dim mb-2">$ knot0 status</div>
          <div className="text-white-muted mb-4">──────────────────────────</div>
        </motion.div>

        <motion.div variants={animate ? itemVariants : undefined} className="space-y-2 mb-8">
          <div className="flex justify-between">
            <span className="text-white-dim">agents:</span>
            <span className="text-cyan"><TickingNumber value={3} /> online</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white-dim">runners:</span>
            <span className="text-cyan"><TickingNumber value={12} /> connected</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white-dim">jobs/24h:</span>
            <span className="text-cyan"><TickingNumber value={1847} /></span>
          </div>
          <div className="flex justify-between">
            <span className="text-white-dim">approvals:</span>
            <span className="text-amber"><TickingNumber value={2} /> pending</span>
          </div>
        </motion.div>

        <motion.div variants={animate ? itemVariants : undefined} className="border border-black-border rounded p-4 mb-4">
          <div className="text-white-dim mb-2">&gt; latest: <span className="text-amber">payment-fix</span></div>
          <div className="text-white-muted text-xs space-y-1">
            <div>status: <span className="text-amber">awaiting approval</span></div>
            <div>blast-radius: <span className="text-amber">medium</span></div>
          </div>
        </motion.div>

        <motion.div variants={animate ? itemVariants : undefined} className="flex gap-2">
          <button className="px-3 py-1.5 bg-cyan/20 text-cyan rounded text-xs hover:bg-cyan/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            approve
          </button>
          <button className="px-3 py-1.5 bg-white/10 text-white-dim rounded text-xs hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            deny
          </button>
          <button className="px-3 py-1.5 bg-white/10 text-white-dim rounded text-xs hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            inspect
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

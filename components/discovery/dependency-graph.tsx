'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function DependencyGraph() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref} className="bg-ink rounded-xl p-6 font-mono text-sm">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-block px-4 py-2 bg-safety-orange/20 text-safety-orange rounded-lg"
        >
          payment-svc
        </motion.div>
      </div>

      <div className="flex justify-center gap-8 mb-8">
        {['orders-db', 'redis', 'auth-svc'].map((node, i) => (
          <motion.div
            key={node}
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            className="px-3 py-1.5 bg-muted-cyan/20 text-muted-cyan rounded"
          >
            {node}
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-16 mb-8">
        {['postgres', 'users-db'].map((node, i) => (
          <motion.div
            key={node}
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
            className="px-3 py-1.5 bg-white/10 text-white/70 rounded"
          >
            {node}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="border-t border-white/10 pt-4 mt-4 grid grid-cols-2 gap-4 text-xs"
      >
        <div>
          <span className="text-white/50">Owner:</span>{' '}
          <span className="text-white">payments-team</span>
        </div>
        <div>
          <span className="text-white/50">Oncall:</span>{' '}
          <span className="text-white">@alice</span>
        </div>
        <div>
          <span className="text-white/50">Last deploy:</span>{' '}
          <span className="text-white">2h ago</span>
        </div>
        <div>
          <span className="text-white/50">Dependencies:</span>{' '}
          <span className="text-white">4</span>
        </div>
        <div>
          <span className="text-white/50">Blast radius:</span>{' '}
          <span className="text-safety-orange">high</span>
        </div>
        <div>
          <span className="text-white/50">Status:</span>{' '}
          <span className="text-yellow-400">degraded</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-4 pt-4 border-t border-white/10 text-center text-white/50 text-xs"
      >
        Sources: K8s · Git · CODEOWNERS · PagerDuty · Cloud APIs
      </motion.div>
    </div>
  )
}

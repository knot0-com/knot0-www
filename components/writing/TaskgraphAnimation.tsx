'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type NodeStatus = 'idle' | 'planning' | 'executing' | 'failed' | 'replanning' | 'done' | 'cancelled'

interface DAGNode {
  id: string
  label: string
  sublabel?: string
  x: number
  y: number
  status: NodeStatus
  children: string[]
  parent?: string
  visible: boolean
}

// Real-world use case: Adding authentication to an API
const initialNodes: DAGNode[] = [
  { id: 'plan', label: 'Plan', sublabel: 'Add Auth', x: 200, y: 35, status: 'idle', children: ['jwt', 'routes', 'db'], visible: true },
  { id: 'jwt', label: 'JWT', sublabel: 'Middleware', x: 70, y: 110, status: 'idle', children: ['verify'], parent: 'plan', visible: true },
  { id: 'routes', label: 'Routes', sublabel: '/auth/*', x: 200, y: 110, status: 'idle', children: ['verify'], parent: 'plan', visible: true },
  { id: 'db', label: 'Migration', sublabel: 'users table', x: 330, y: 110, status: 'idle', children: ['verify'], parent: 'plan', visible: true },
  { id: 'verify', label: 'Verify', sublabel: 'Run tests', x: 200, y: 275, status: 'idle', children: ['integrate'], parent: 'plan', visible: true },
  { id: 'integrate', label: 'Integrate', sublabel: 'Merge PRs', x: 200, y: 345, status: 'idle', children: ['final'], parent: 'verify', visible: true },
  { id: 'final', label: 'Deploy', sublabel: 'to staging', x: 200, y: 415, status: 'idle', children: [], parent: 'integrate', visible: true },
  // New nodes that appear after re-planning - positioned in same column as failed db
  { id: 'compat', label: 'Compat', sublabel: 'Schema layer', x: 330, y: 170, status: 'idle', children: ['db2'], parent: 'plan', visible: false },
  { id: 'db2', label: 'Migration', sublabel: 'v2 (safe)', x: 330, y: 225, status: 'idle', children: ['verify'], parent: 'compat', visible: false },
]

const statusColors: Record<NodeStatus, { bg: string; border: string; text: string; glow?: string }> = {
  idle: { bg: 'bg-black-light', border: 'border-black-border', text: 'text-white-muted' },
  planning: { bg: 'bg-cyan/20', border: 'border-cyan', text: 'text-cyan', glow: 'shadow-[0_0_15px_rgba(78,205,196,0.4)]' },
  executing: { bg: 'bg-amber/20', border: 'border-amber', text: 'text-amber', glow: 'shadow-[0_0_15px_rgba(255,176,0,0.4)]' },
  failed: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-500', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]' },
  replanning: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]' },
  done: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-500' },
  cancelled: { bg: 'bg-white-muted/10', border: 'border-white-muted/30', text: 'text-white-muted/50' },
}

export function TaskgraphAnimation() {
  const [nodes, setNodes] = useState<DAGNode[]>(initialNodes)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = useCallback((message: string) => {
    setLogs(prev => [...prev.slice(-8), `[${new Date().toLocaleTimeString()}] ${message}`])
  }, [])

  const updateNode = useCallback((id: string, status: NodeStatus) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status } : n))
  }, [])

  const showNode = useCallback((id: string) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, visible: true } : n))
  }, [])

  const resetDemo = useCallback(() => {
    setNodes(initialNodes)
    setCurrentStep(0)
    setLogs([])
    setIsRunning(false)
  }, [])

  const runDemo = useCallback(async () => {
    if (isRunning) return
    resetDemo()
    setIsRunning(true)

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

    // Step 1: Planning - "Add authentication to the API"
    await delay(500)
    addLog('> "Add user authentication to the API"')
    updateNode('plan', 'planning')
    await delay(1000)
    addLog('Plan: Analyzing codebase for auth patterns...')
    await delay(800)
    addLog('Plan: Breaking into 3 parallel tasks:')
    addLog('  1. JWT middleware  2. Auth routes  3. DB migration')
    updateNode('plan', 'done')

    // Step 2: Execute tasks in parallel
    await delay(400)
    addLog('Spawning 3 agents in parallel worktrees...')
    updateNode('jwt', 'executing')
    updateNode('routes', 'executing')
    updateNode('db', 'executing')

    // JWT completes
    await delay(900)
    addLog('JWT: Created middleware with RS256 signing ✓')
    updateNode('jwt', 'done')

    // Routes completes
    await delay(700)
    addLog('Routes: Added /auth/login, /auth/refresh ✓')
    updateNode('routes', 'done')

    // DB Migration fails!
    await delay(600)
    addLog('Migration: FAILED')
    addLog('  → Column "email" conflicts with legacy schema')
    addLog('  → Cannot add UNIQUE constraint')
    updateNode('db', 'failed')

    // Promote to parent for re-planning
    await delay(1200)
    addLog('Failure promoted to Plan node...')
    updateNode('plan', 'replanning')
    await delay(800)
    addLog('Plan: Re-analyzing with failure context')
    await delay(1000)
    addLog('Plan: New approach - add compatibility layer first')

    // Show new nodes
    showNode('compat')
    showNode('db2')
    await delay(400)
    updateNode('db', 'cancelled')
    addLog('Plan: Spawning Compat → Migration v2')
    updateNode('plan', 'done')

    // Execute new path
    await delay(500)
    updateNode('compat', 'executing')
    await delay(1000)
    addLog('Compat: Added schema version table ✓')
    addLog('Compat: Legacy email → user_email alias ✓')
    updateNode('compat', 'done')

    await delay(400)
    updateNode('db2', 'executing')
    await delay(900)
    addLog('Migration v2: Created users table (safe mode) ✓')
    updateNode('db2', 'done')

    // Step 3: Verify
    await delay(500)
    addLog('All tasks complete. Running test suite...')
    updateNode('verify', 'executing')

    await delay(1000)
    addLog('Verify: 47 tests passing, 0 failed ✓')
    updateNode('verify', 'done')

    // Step 4: Integrate
    await delay(400)
    addLog('Merging 4 worktrees into main...')
    updateNode('integrate', 'executing')

    await delay(800)
    addLog('Integrate: Clean merge, no conflicts ✓')
    updateNode('integrate', 'done')

    // Step 5: Deploy
    await delay(400)
    addLog('Deploying to staging...')
    updateNode('final', 'executing')

    await delay(900)
    addLog('Deploy: Live at staging.api.example.com ✓')
    updateNode('final', 'done')

    await delay(400)
    addLog('─────────────────────────────')
    addLog('Auth system deployed successfully.')
    addLog('Recovery from schema conflict: automatic.')
    setIsRunning(false)
  }, [isRunning, resetDemo, addLog, updateNode, showNode])

  // Draw edges between visible nodes only
  const visibleNodes = nodes.filter(n => n.visible)
  const edges: { from: DAGNode; to: DAGNode }[] = []
  visibleNodes.forEach(node => {
    node.children.forEach(childId => {
      const child = nodes.find(n => n.id === childId && n.visible)
      if (child) edges.push({ from: node, to: child })
    })
  })

  return (
    <div className="border border-black-border rounded-lg bg-black-light overflow-hidden my-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black-border">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white-muted">TASKGRAPH DEMO</span>
          {isRunning && (
            <span className="flex items-center gap-1.5 text-xs font-mono text-cyan">
              <motion.span
                className="w-1.5 h-1.5 bg-cyan rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              Running
            </span>
          )}
        </div>
        <button
          onClick={isRunning ? resetDemo : runDemo}
          className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
            isRunning
              ? 'border-red-500/50 text-red-500 hover:bg-red-500/10'
              : 'border-amber/50 text-amber hover:bg-amber/10'
          }`}
        >
          {isRunning ? 'Reset' : 'Run Demo'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Graph visualization */}
        <div className="flex-1 p-4 min-h-[280px] md:min-h-0">
          <svg viewBox="0 0 400 460" className="w-full h-64 md:h-80">
            {/* Draw edges */}
            {edges.map((edge, i) => {
              const fromNode = edge.from
              const toNode = edge.to
              const isActive = fromNode.status === 'done' && toNode.status !== 'idle'

              return (
                <motion.line
                  key={`${fromNode.id}-${toNode.id}`}
                  x1={fromNode.x}
                  y1={fromNode.y + 20}
                  x2={toNode.x}
                  y2={toNode.y - 20}
                  stroke={isActive ? '#4ecdc4' : '#1f1f1f'}
                  strokeWidth={isActive ? 2 : 1}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )
            })}

            {/* Draw nodes */}
            {visibleNodes.map(node => {
              const colors = statusColors[node.status]
              const isAnimating = ['planning', 'executing', 'replanning'].includes(node.status)

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Node background */}
                  <motion.rect
                    x={node.x - 45}
                    y={node.y - 22}
                    width={90}
                    height={44}
                    rx={6}
                    className={`${colors.bg} ${colors.border} stroke-current`}
                    strokeWidth={node.status === 'idle' || node.status === 'cancelled' ? 1 : 2}
                    animate={{
                      scale: isAnimating ? [1, 1.03, 1] : 1,
                    }}
                    transition={isAnimating ? { duration: 0.8, repeat: Infinity } : { duration: 0.3 }}
                    style={{ strokeDasharray: node.status === 'cancelled' ? '4 2' : 'none' }}
                  />

                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y - 5}
                    textAnchor="middle"
                    className={`text-xs font-mono font-medium fill-current ${colors.text}`}
                  >
                    {node.label}
                  </text>

                  {/* Sublabel */}
                  {node.sublabel && (
                    <text
                      x={node.x}
                      y={node.y + 8}
                      textAnchor="middle"
                      className={`text-[9px] font-mono fill-current ${colors.text} opacity-70`}
                    >
                      {node.sublabel}
                    </text>
                  )}

                  {/* Status indicator */}
                  {node.status !== 'idle' && node.status !== 'cancelled' && (
                    <motion.circle
                      cx={node.x + 38}
                      cy={node.y - 15}
                      r={4}
                      className={`fill-current ${colors.text}`}
                      animate={isAnimating ? { opacity: [1, 0.4, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                  {node.status === 'done' && (
                    <text x={node.x + 38} y={node.y - 11} textAnchor="middle" className="text-[8px] fill-current text-green-500">✓</text>
                  )}
                  {node.status === 'failed' && (
                    <text x={node.x + 38} y={node.y - 11} textAnchor="middle" className="text-[8px] fill-current text-red-500">✗</text>
                  )}
                  {node.status === 'cancelled' && (
                    <text x={node.x + 38} y={node.y - 11} textAnchor="middle" className="text-[8px] fill-current text-white-muted">—</text>
                  )}
                </motion.g>
              )
            })}
          </svg>
        </div>

        {/* Log panel */}
        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-black-border p-3 bg-black">
          <div className="text-xs font-mono text-white-muted mb-2">AGENT LOG</div>
          <div className="space-y-1 h-40 md:h-64 overflow-y-auto scrollbar-thin">
            <AnimatePresence>
              {logs.length === 0 ? (
                <div className="text-xs font-mono text-white-muted/50">
                  Click "Run Demo" to start...
                </div>
              ) : (
                logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xs font-mono leading-relaxed ${
                      log.includes('FAILED') ? 'text-red-500' :
                      log.includes('Complete') || log.includes('passed') ? 'text-green-500' :
                      log.includes('Retrying') ? 'text-purple-400' :
                      'text-white-dim'
                    }`}
                  >
                    {log}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-x-4 gap-y-2 px-4 py-3 border-t border-black-border text-xs font-mono flex-wrap">
        {[
          { status: 'planning', label: 'Planning', color: 'bg-cyan' },
          { status: 'executing', label: 'Executing', color: 'bg-amber' },
          { status: 'failed', label: 'Failed', color: 'bg-red-500' },
          { status: 'replanning', label: 'Re-planning', color: 'bg-purple-500' },
          { status: 'done', label: 'Done', color: 'bg-green-500' },
          { status: 'cancelled', label: 'Cancelled', color: 'bg-white-muted/50' },
        ].map(({ status, label, color }) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-white-muted">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

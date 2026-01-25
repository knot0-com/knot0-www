'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Visual output components for different scenario types

function IncidentVisual({ phase, progress }: { phase: string; progress: number }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 500)
    return () => clearInterval(interval)
  }, [])

  const pods = [
    { name: 'payment-svc-7d8f9', status: phase === 'resolved' ? 'healthy' : progress > 50 ? 'recovering' : 'critical' },
    { name: 'payment-svc-3a2b1', status: phase === 'resolved' ? 'healthy' : progress > 75 ? 'recovering' : 'critical' },
    { name: 'payment-svc-9c4e5', status: 'healthy' },
  ]

  // Dynamic memory values based on progress
  const baseValues = [85, 92, 78, 95, 88, 72, 45, 38, 32, 28]
  const memoryValues = baseValues.map((val, i) => {
    if (phase === 'resolved' && i >= 6) return 25 + Math.random() * 10
    if (phase === 'executing' && i >= 6) {
      // Gradually decrease during execution
      const reduction = (progress / 100) * (val - 30)
      return val - reduction + Math.random() * 5
    }
    return val + (Math.sin(tick * 0.3 + i) * 3)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-white-muted mb-2">
        <span>CLUSTER: prod-k8s-01</span>
        <span className={phase === 'resolved' ? 'text-green-neon' : 'text-amber'}>
          {phase === 'resolved' ? '● STABLE' : phase === 'executing' ? '◐ PATCHING' : '● CRITICAL'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {pods.map((pod, idx) => (
          <motion.div
            key={pod.name}
            className={`border rounded-lg p-3 transition-all duration-500 ${
              pod.status === 'healthy' ? 'border-green-neon/50 bg-green-neon/10' :
              pod.status === 'recovering' ? 'border-amber/50 bg-amber/10' :
              'border-red-500/50 bg-red-500/10'
            }`}
            initial={{ scale: 1 }}
            animate={pod.status === 'recovering' ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <motion.div
              className={`w-3 h-3 rounded-full mb-2 ${
                pod.status === 'healthy' ? 'bg-green-neon' :
                pod.status === 'recovering' ? 'bg-amber' :
                'bg-red-500'
              }`}
              animate={pod.status !== 'healthy' ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <div className="text-xs font-mono truncate text-white">{pod.name}</div>
            <div className={`text-xs mt-1 ${
              pod.status === 'healthy' ? 'text-green-neon' :
              pod.status === 'recovering' ? 'text-amber' :
              'text-red-500'
            }`}>
              {pod.status === 'healthy' ? 'Running' : pod.status === 'recovering' ? 'Patching...' : 'CrashLoop'}
            </div>
            {pod.status === 'recovering' && (
              <div className="mt-2 h-1 bg-black-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-amber"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, progress + idx * 10)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <div className="border border-black-border rounded p-3 mt-4">
        <div className="flex items-center justify-between text-xs text-white-muted mb-2">
          <span>MEMORY USAGE</span>
          <span className={phase === 'resolved' ? 'text-green-neon' : 'text-red-500'}>
            {phase === 'resolved' ? '↓ normalized' : phase === 'executing' ? '↓ dropping' : '↑ critical'}
          </span>
        </div>
        <div className="flex items-end gap-1 h-16 relative">
          {/* Critical threshold line */}
          <div className="absolute w-full border-t border-dashed border-red-500/50" style={{ bottom: '80%' }}>
            <span className="absolute right-0 -top-3 text-xs text-red-500/70">80%</span>
          </div>
          {memoryValues.map((val, i) => (
            <motion.div
              key={i}
              className={`flex-1 rounded-t ${
                phase === 'resolved' && i >= 6 ? 'bg-green-neon' :
                val > 80 ? 'bg-red-500' : val > 60 ? 'bg-amber' : 'bg-green-neon'
              }`}
              initial={{ height: '20%' }}
              animate={{ height: `${val}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-white-muted mt-1">
          <span>-5m</span>
          <span className="text-cyan">live</span>
          <span>now</span>
        </div>
      </div>
    </div>
  )
}

function MemoryDashboardVisual({ phase }: { phase: string }) {
  const isLive = ['deploying', 'executing', 'resolved'].includes(phase)
  const [tick, setTick] = useState(0)
  const [chartData, setChartData] = useState([30, 32, 28, 35, 25, 28, 24, 26, 22, 25, 24, 25])

  // Animate values when live
  useEffect(() => {
    if (!isLive) return
    const interval = setInterval(() => {
      setTick(t => t + 1)
      // Shift chart data and add new value
      setChartData(prev => {
        const newData = [...prev.slice(1), 20 + Math.random() * 15]
        return newData
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [isLive])

  // Fluctuating values
  const heapUsed = isLive ? Math.floor(480 + Math.sin(tick * 0.5) * 40 + Math.random() * 20) : 0
  const heapPercent = Math.floor(heapUsed / 20.48)
  const cacheSize = isLive ? Math.floor(820 + Math.sin(tick * 0.3) * 30 + Math.random() * 20) : 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white-muted">payment-svc Memory Dashboard</span>
        {isLive && (
          <span className="text-green-neon flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-neon rounded-full animate-pulse" />
            Live
            <span className="text-white-muted ml-2">Updated {tick}s ago</span>
          </span>
        )}
      </div>
      <div className="border border-black-border rounded-lg p-4 bg-black-light">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <motion.div
            className="border border-green-neon/30 rounded p-3 bg-green-neon/5"
            animate={isLive ? { borderColor: ['rgba(34, 197, 94, 0.3)', 'rgba(34, 197, 94, 0.5)', 'rgba(34, 197, 94, 0.3)'] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-xs text-white-muted">Heap Used</div>
            <motion.div
              className="text-2xl font-bold text-green-neon"
              key={heapUsed}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
            >
              {isLive ? heapUsed : '--'}<span className="text-sm ml-1">MB</span>
            </motion.div>
            <div className="text-xs text-white-muted mt-1">{isLive ? `of 2GB (${heapPercent}%)` : ''}</div>
          </motion.div>
          <motion.div
            className="border border-cyan/30 rounded p-3 bg-cyan/5"
            animate={isLive ? { borderColor: ['rgba(78, 205, 196, 0.3)', 'rgba(78, 205, 196, 0.5)', 'rgba(78, 205, 196, 0.3)'] } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="text-xs text-white-muted">Session Cache</div>
            <motion.div
              className="text-2xl font-bold text-cyan"
              key={cacheSize}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
            >
              {isLive ? cacheSize : '--'}<span className="text-sm ml-1">/1000</span>
            </motion.div>
            <div className="text-xs text-white-muted mt-1">{isLive ? 'LRU active' : ''}</div>
          </motion.div>
          <div className="border border-green-neon/30 rounded p-3 bg-green-neon/5">
            <div className="text-xs text-white-muted">Alert Status</div>
            <div className="text-lg font-bold text-green-neon mt-1 flex items-center gap-1">
              {isLive ? (
                <>
                  <motion.span
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >●</motion.span>
                  OK
                </>
              ) : '--'}
            </div>
            <div className="text-xs text-white-muted mt-1">{isLive ? 'Threshold: 80%' : ''}</div>
          </div>
        </div>
        <div className="border border-black-border rounded p-3">
          <div className="flex items-center justify-between text-xs text-white-muted mb-2">
            <span>Memory Usage (24h)</span>
            {isLive && <span className="text-cyan">↻ auto-refresh</span>}
          </div>
          <div className="flex items-end gap-0.5 h-12 relative">
            {/* Threshold line */}
            <div className="absolute w-full border-t border-dashed border-amber/50" style={{ bottom: '80%' }} />
            {chartData.map((val, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-t ${isLive ? 'bg-green-neon' : 'bg-white-muted/30'}`}
                initial={{ height: '20%' }}
                animate={{ height: `${isLive ? val : 20}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-white-muted mt-1">
            <span>-24h</span>
            <span className="text-amber">— 80% threshold</span>
            <span>now</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostMortemVisual() {
  const [visibleItems, setVisibleItems] = useState(0)
  const timelineItems = [
    { time: '14:30', event: 'Traffic spike from marketing campaign', color: 'text-white-dim', bg: 'bg-white-muted' },
    { time: '14:32', event: 'payment-svc OOMKilled', color: 'text-red-500', bg: 'bg-red-500' },
    { time: '14:33', event: 'Knot0 deployed LRU cache fix', color: 'text-amber', bg: 'bg-amber' },
    { time: '14:33', event: 'Service recovered', color: 'text-green-neon', bg: 'bg-green-neon' },
  ]

  useEffect(() => {
    if (visibleItems < timelineItems.length) {
      const timer = setTimeout(() => setVisibleItems(v => v + 1), 600)
      return () => clearTimeout(timer)
    }
  }, [visibleItems, timelineItems.length])

  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="border border-black-border rounded-lg p-4 bg-black-light">
        <div className="flex items-center justify-between text-xs text-white-muted mb-3">
          <span>INCIDENT TIMELINE</span>
          <span className="text-cyan">analyzing...</span>
        </div>
        <div className="space-y-2 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[3.5rem] top-1 bottom-1 w-px bg-black-border" />
          {timelineItems.slice(0, visibleItems).map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 text-xs font-mono relative"
            >
              <span className="text-white-muted w-12">{item.time}</span>
              <motion.span
                className={`w-2 h-2 rounded-full ${item.bg} relative z-10`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
              />
              <span className={item.color}>{item.event}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Root Cause + Action Items */}
      <AnimatePresence>
        {visibleItems >= timelineItems.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <motion.div
              className="border border-red-500/30 rounded p-3 bg-red-500/5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-xs text-red-500 mb-2 flex items-center gap-1">
                <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⚠</motion.span>
                ROOT CAUSE
              </div>
              <div className="text-xs text-white">HashMap grew without limit</div>
              <div className="text-xs text-white-muted mt-1">50k sessions = 2GB heap</div>
            </motion.div>
            <motion.div
              className="border border-green-neon/30 rounded p-3 bg-green-neon/5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-xs text-green-neon mb-2">ACTION ITEMS</div>
              <div className="text-xs space-y-1">
                <motion.div
                  className="text-green-neon flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: 'spring' }}>✓</motion.span>
                  Add LRU eviction
                </motion.div>
                <motion.div className="text-amber" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>○ Add memory alerts</motion.div>
                <motion.div className="text-amber" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>○ Build dashboard</motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Simple syntax highlighter for demo code
function highlightCode(code: string, filename: string): React.ReactNode[] {
  const ext = filename.split('.').pop() || ''
  const isTS = ['ts', 'tsx', 'js', 'jsx'].includes(ext)
  const isMD = ext === 'md'
  const isPatch = ext === 'patch'

  if (!code) return []

  const lines = code.split('\n')
  return lines.map((line, lineIdx) => {
    let highlighted: React.ReactNode = line

    if (isPatch) {
      // Diff highlighting
      if (line.startsWith('+') && !line.startsWith('+++')) {
        highlighted = <span className="text-green-neon">{line}</span>
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        highlighted = <span className="text-red-400">{line}</span>
      } else if (line.startsWith('@@')) {
        highlighted = <span className="text-cyan">{line}</span>
      } else if (line.startsWith('---') || line.startsWith('+++')) {
        highlighted = <span className="text-white-muted">{line}</span>
      }
    } else if (isMD) {
      // Markdown highlighting
      if (line.startsWith('#')) {
        highlighted = <span className="text-amber font-bold">{line}</span>
      } else if (line.startsWith('-') || line.startsWith('*')) {
        highlighted = <span className="text-cyan">{line}</span>
      } else if (line.match(/^\d+\./)) {
        highlighted = <span className="text-cyan">{line}</span>
      }
    } else if (isTS) {
      // TypeScript/JavaScript highlighting
      const tokens: React.ReactNode[] = []
      let remaining = line
      let key = 0

      const patterns: [RegExp, string][] = [
        [/^(\s*)(\/\/.*)$/, 'comment'],
        [/^(\s*)(import|export|from|const|let|var|function|return|if|else|async|await|new|class|extends|interface|type)\b/, 'keyword'],
        [/^(\s*)(['"`].*?['"`])/, 'string'],
        [/^(\s*)(\d+)/, 'number'],
      ]

      // Simple token-by-token highlighting
      const words = line.split(/(\s+|[{}()[\]<>,:;=]|"[^"]*"|'[^']*'|`[^`]*`)/)
      words.forEach((word, i) => {
        if (!word) return
        const keywords = ['import', 'export', 'from', 'const', 'let', 'var', 'function', 'return', 'if', 'else', 'async', 'await', 'new', 'class', 'extends', 'interface', 'type', 'true', 'false', 'null', 'undefined']
        const builtins = ['console', 'document', 'window', 'Promise', 'Response', 'WebSocket', 'useState', 'useEffect', 'useCallback', 'useRef', 'useMemo']

        if (keywords.includes(word)) {
          tokens.push(<span key={key++} className="text-purple-400">{word}</span>)
        } else if (builtins.includes(word)) {
          tokens.push(<span key={key++} className="text-cyan">{word}</span>)
        } else if (word.match(/^['"`]/)) {
          tokens.push(<span key={key++} className="text-green-neon">{word}</span>)
        } else if (word.match(/^\d+$/)) {
          tokens.push(<span key={key++} className="text-amber">{word}</span>)
        } else if (word.match(/^[{}()[\]<>,:;=]$/)) {
          tokens.push(<span key={key++} className="text-white-muted">{word}</span>)
        } else if (word.startsWith('//')) {
          tokens.push(<span key={key++} className="text-white-muted italic">{word}</span>)
        } else {
          tokens.push(<span key={key++}>{word}</span>)
        }
      })
      highlighted = tokens
    }

    return (
      <div key={lineIdx} className="leading-relaxed">
        {highlighted || ' '}
      </div>
    )
  })
}

type DemoPhase =
  | 'idle'
  | 'request'
  | 'discovering'
  | 'planning'
  | 'writing_code'
  | 'awaiting_approval'
  | 'deploying'
  | 'executing'
  | 'resolved'

interface Runner {
  id: string
  name: string
  platform: string
  status: 'idle' | 'receiving' | 'executing' | 'done'
}

interface FileOutput {
  name: string
  content: string
}

interface Scenario {
  id: string
  type: 'incident' | 'app_generation' | 'knowledge'
  title: string
  subtitle: string
  request: string
  discoveries: { source: string; finding: string }[]
  plan?: string[]
  files: FileOutput[]
  runners: Runner[]
  approvalText: string
  resultText: string
  resultStats: string
}

const SCENARIOS: Scenario[] = [
  // === CONNECTED STORY: Incident → Investigate → Prevent ===

  // Scenario 1: Fix the fire
  {
    id: 'incident',
    type: 'incident',
    title: 'INCIDENT ALERT',
    subtitle: '1. Fix',
    request: 'PagerDuty: payment-svc OOMKilled in production',
    discoveries: [
      { source: 'Prometheus', finding: 'memory_usage > 2GB, spiking since 14:32' },
      { source: 'Kubernetes', finding: '3 pods affected, 2 in CrashLoopBackOff' },
      { source: 'Git Blame', finding: 'Last change: "Add session caching" by @dev' },
      { source: 'Heap Dump', finding: 'Unbounded HashMap in SessionCache.java' },
    ],
    files: [{
      name: 'fix-memory-leak.patch',
      content: `--- a/SessionCache.java
+++ b/SessionCache.java
@@ -8,7 +8,14 @@
-  private Map<String, Session> cache = new HashMap<>();
+  // Fix: Use LRU cache with max size
+  private static final int MAX_SESSIONS = 1000;
+  private Map<String, Session> cache = new LinkedHashMap<>(
+    MAX_SESSIONS, 0.75f, true
+  ) {
+    @Override
+    protected boolean removeEldestEntry(Entry e) {
+      return size() > MAX_SESSIONS;
+    }
+  };`
    }],
    runners: [
      { id: 'r1', name: 'prod-k8s-01', platform: 'Kubernetes', status: 'idle' },
      { id: 'r2', name: 'prod-k8s-02', platform: 'Kubernetes', status: 'idle' },
    ],
    approvalText: 'Apply hotfix to payment-svc',
    resultText: 'Incident resolved',
    resultStats: '2 pods patched • 0 downtime • MTTR: 47 seconds',
  },

  // Scenario 2: Investigate root cause
  {
    id: 'knowledge',
    type: 'knowledge',
    title: 'POST-MORTEM',
    subtitle: '2. Investigate',
    request: '"Why did payment-svc run out of memory?"',
    discoveries: [
      { source: 'Incident Log', finding: 'OOMKilled at 14:32, fixed at 14:33' },
      { source: 'Git History', finding: 'Session caching added 3 days ago' },
      { source: 'Code Review', finding: 'PR #847 - no memory limit on cache' },
      { source: 'Load Tests', finding: 'Cache grows unbounded under high traffic' },
      { source: 'Monitoring', finding: 'No memory alerts configured for payment-svc' },
    ],
    files: [{
      name: 'POSTMORTEM-2024-01.md',
      content: `# Post-Mortem: payment-svc OOMKilled

## Summary
Session caching (PR #847) caused unbounded memory growth.

## Timeline
- 14:30 - Traffic spike from marketing campaign
- 14:32 - payment-svc pods OOMKilled
- 14:33 - Knot0 deployed LRU cache fix
- 14:33 - Service recovered

## Root Cause
HashMap grew without limit. 50k sessions = 2GB heap.

## Action Items
- [x] Fix: Add LRU eviction (done)
- [ ] Add memory usage alerts
- [ ] Build monitoring dashboard
- [ ] Add cache size to load tests`
    }],
    runners: [],
    approvalText: 'Save post-mortem to /docs',
    resultText: 'Post-mortem documented',
    resultStats: 'Root cause identified • 4 action items created',
  },

  // Scenario 3: Prevent recurrence
  {
    id: 'app_generation',
    type: 'app_generation',
    title: 'PREVENTION',
    subtitle: '3. Prevent',
    request: '"Build a memory monitoring dashboard for payment-svc"',
    discoveries: [
      { source: 'Post-Mortem', finding: 'Action item: Add memory usage alerts' },
      { source: 'Prometheus', finding: 'Metrics available: heap_used, gc_time, cache_size' },
      { source: 'Grafana', finding: 'Existing dashboards use React + Recharts' },
      { source: 'Alertmanager', finding: 'Slack webhook configured for #ops-alerts' },
    ],
    plan: [
      'Create memory dashboard with heap visualization',
      'Add cache size tracking with threshold alerts',
      'Configure PagerDuty alert at 80% memory',
      'Add to existing service health overview',
    ],
    files: [
      {
        name: 'PaymentMemoryDashboard.tsx',
        content: `export function PaymentMemoryDashboard() {
  const { heap, cache, gc } = usePaymentMetrics()

  return (
    <Dashboard title="payment-svc Memory">
      <AlertBanner
        condition={heap.percent > 80}
        message="Memory usage critical"
      />
      <MetricCard
        title="Heap Used"
        value={heap.used}
        max={heap.max}
        threshold={0.8}
      />
      <MetricCard
        title="Session Cache"
        value={cache.size}
        max={1000}
        unit="sessions"
      />
      <TimeSeriesChart
        data={heap.history}
        threshold={heap.max * 0.8}
      />
    </Dashboard>
  )
}`
      },
      {
        name: 'alerts/payment-memory.yaml',
        content: `groups:
  - name: payment-svc-memory
    rules:
      - alert: PaymentHighMemory
        expr: jvm_heap_used / jvm_heap_max > 0.8
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "payment-svc memory > 80%"

      - alert: PaymentCacheSize
        expr: payment_session_cache_size > 800
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "Session cache approaching limit"`
      }
    ],
    runners: [
      { id: 'r1', name: 'monitoring-k8s', platform: 'Kubernetes', status: 'idle' },
      { id: 'r2', name: 'grafana-cloud', platform: 'Grafana', status: 'idle' },
    ],
    approvalText: 'Deploy monitoring to production',
    resultText: 'Prevention deployed',
    resultStats: 'Dashboard live • Alerts configured • Next incident: caught early',
  },
]

export function FullDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [visibleRequestChars, setVisibleRequestChars] = useState(0)
  const [visibleDiscoveries, setVisibleDiscoveries] = useState(0)
  const [visiblePlanSteps, setVisiblePlanSteps] = useState(0)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [visibleCodeChars, setVisibleCodeChars] = useState(0)
  const [runners, setRunners] = useState<Runner[]>([])
  const [executionProgress, setExecutionProgress] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scenario = SCENARIOS[scenarioIndex]

  const clearTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const resetDemo = useCallback(() => {
    clearTimeouts()
    setPhase('idle')
    setVisibleRequestChars(0)
    setVisibleDiscoveries(0)
    setVisiblePlanSteps(0)
    setCurrentFileIndex(0)
    setVisibleCodeChars(0)
    setRunners(SCENARIOS[scenarioIndex].runners.map(r => ({ ...r, status: 'idle' as const })))
    setExecutionProgress(0)
    setHasInteracted(false)
  }, [scenarioIndex])

  const startDemo = useCallback(() => {
    resetDemo()
    setRunners(scenario.runners.map(r => ({ ...r, status: 'idle' as const })))
    setTimeout(() => setPhase('request'), 100)
  }, [resetDemo, scenario.runners])

  const nextScenario = useCallback(() => {
    setScenarioIndex(prev => (prev + 1) % SCENARIOS.length)
  }, [])

  const handleApprove = useCallback(() => {
    setHasInteracted(true)
    clearTimeouts()
    if (scenario.runners.length > 0) {
      setPhase('deploying')
    } else {
      setPhase('resolved')
    }
  }, [scenario.runners.length])

  const handleDeny = useCallback(() => {
    setHasInteracted(true)
    clearTimeouts()
    nextScenario()
    setTimeout(() => {
      resetDemo()
      setTimeout(startDemo, 500)
    }, 100)
  }, [nextScenario, resetDemo, startDemo])

  // Auto-start demo only on initial mount
  const hasStarted = useRef(false)
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      const timer = setTimeout(startDemo, 1000)
      return () => clearTimeout(timer)
    }
  }, [startDemo])

  // Phase progression
  useEffect(() => {
    clearTimeouts()

    switch (phase) {
      case 'request':
        // Typewriter effect for the request
        if (visibleRequestChars < scenario.request.length) {
          const char = scenario.request[visibleRequestChars]
          // Vary typing speed for realism
          const delay = char === ' ' ? 30 : char === '.' || char === ',' ? 80 : 40 + Math.random() * 30
          timeoutRef.current = setTimeout(() => {
            setVisibleRequestChars(prev => prev + 1)
          }, delay)
        } else {
          // Pause after typing complete, then move to discovering
          timeoutRef.current = setTimeout(() => setPhase('discovering'), 800)
        }
        break

      case 'discovering':
        if (visibleDiscoveries < scenario.discoveries.length) {
          timeoutRef.current = setTimeout(() => {
            setVisibleDiscoveries(prev => prev + 1)
          }, 800)
        } else {
          timeoutRef.current = setTimeout(() => {
            if (scenario.plan) {
              setPhase('planning')
            } else {
              setPhase('writing_code')
            }
          }, 800)
        }
        break

      case 'planning':
        if (visiblePlanSteps < (scenario.plan?.length || 0)) {
          timeoutRef.current = setTimeout(() => {
            setVisiblePlanSteps(prev => prev + 1)
          }, 600)
        } else {
          timeoutRef.current = setTimeout(() => setPhase('writing_code'), 800)
        }
        break

      case 'writing_code':
        const currentFile = scenario.files[currentFileIndex]
        if (visibleCodeChars < currentFile.content.length) {
          const char = currentFile.content[visibleCodeChars]
          const delay = char === '\n' ? 30 : char === ' ' ? 8 : 15
          timeoutRef.current = setTimeout(() => {
            setVisibleCodeChars(prev => prev + 1)
          }, delay)
        } else if (currentFileIndex < scenario.files.length - 1) {
          // Move to next file
          timeoutRef.current = setTimeout(() => {
            setCurrentFileIndex(prev => prev + 1)
            setVisibleCodeChars(0)
          }, 1000)
        } else {
          timeoutRef.current = setTimeout(() => setPhase('awaiting_approval'), 800)
        }
        break

      case 'awaiting_approval':
        timeoutRef.current = setTimeout(() => {
          if (!hasInteracted) {
            handleApprove()
          }
        }, 10000)
        break

      case 'deploying':
        let runnerIndex = 0
        const deployInterval = setInterval(() => {
          if (runnerIndex < scenario.runners.length) {
            setRunners(prev => prev.map((r, i) =>
              i === runnerIndex ? { ...r, status: 'receiving' } : r
            ))
            runnerIndex++
          } else {
            clearInterval(deployInterval)
            setTimeout(() => setPhase('executing'), 600)
          }
        }, 400)
        return () => clearInterval(deployInterval)

      case 'executing':
        const execInterval = setInterval(() => {
          setExecutionProgress(prev => {
            if (prev >= 100) {
              clearInterval(execInterval)
              setRunners(r => r.map(runner => ({ ...runner, status: 'done' })))
              setTimeout(() => setPhase('resolved'), 800)
              return 100
            }
            const progress = prev + 5
            // Update runner statuses
            const doneCount = Math.floor((progress / 100) * scenario.runners.length)
            setRunners(r => r.map((runner, i) => ({
              ...runner,
              status: i < doneCount ? 'done' : i === doneCount ? 'executing' : runner.status
            })))
            return progress
          })
        }, 150)
        return () => clearInterval(execInterval)

      case 'resolved':
        // Don't auto-transition - let user click to see next scenario
        break
    }

    return clearTimeouts
  }, [phase, visibleRequestChars, visibleDiscoveries, visiblePlanSteps, currentFileIndex, visibleCodeChars, scenario, hasInteracted, handleApprove, resetDemo, startDemo, nextScenario])

  const currentFile = scenario.files[currentFileIndex] || scenario.files[0]

  if (!currentFile) {
    return null
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Status Bar */}
      <div className="border-b border-black-border bg-black-light px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3 md:gap-4 text-xs font-mono">
            <span className="text-white font-medium">VAULTPAY</span>
            <span className="text-white-muted hidden sm:inline">/</span>
            <span className="text-white-muted hidden sm:inline">prod-us-east-1</span>
            <span className="text-white-muted hidden md:inline">/</span>
            <span className="text-amber hidden md:inline">payment-cluster</span>
            <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded bg-green-neon/10 border border-green-neon/30">
              <span className="w-1.5 h-1.5 rounded-full bg-green-neon animate-pulse" />
              <span className="text-green-neon text-[10px]">CONNECTED</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono overflow-x-auto max-w-full pb-1 sm:pb-0">
            {/* Scenario tabs */}
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setScenarioIndex(i)
                  resetDemo()
                  setTimeout(startDemo, 100)
                }}
                className={`px-3 py-1 rounded transition-colors ${
                  i === scenarioIndex
                    ? 'bg-amber/20 text-amber border border-amber/30'
                    : 'text-white-muted hover:text-white-dim hover:bg-white/5'
                }`}
              >
                {s.subtitle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Demo Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-auto">
        {/* Left: Activity Feed */}
        <div className="w-full md:w-1/2 min-h-[300px] md:min-h-0 border-b md:border-b-0 md:border-r border-black-border p-4 md:p-6 overflow-auto">
          <div className="text-white-muted text-xs font-mono mb-4">AGENT ACTIVITY</div>

          <div className="space-y-3 font-mono text-xs md:text-sm">
            {/* Idle */}
            <AnimatePresence>
              {phase === 'idle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white-dim"
                >
                  Waiting...
                </motion.div>
              )}
            </AnimatePresence>

            {/* Request - Terminal style with typewriter effect */}
            <AnimatePresence>
              {phase !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {/* Terminal prompt line */}
                  <div className="flex items-center gap-2 text-white-muted">
                    <span className="text-green-neon">❯</span>
                    <span className="text-cyan">knot0</span>
                    <span className="text-white-muted">~</span>
                  </div>
                  {/* Typed request with cursor */}
                  <div className="pl-5 flex items-start gap-2">
                    <span className={scenario.type === 'incident' ? 'text-red-500' : 'text-amber'}>
                      {scenario.type === 'incident' ? '⚠' : '$'}
                    </span>
                    <div className="flex-1">
                      <div className={`font-medium text-xs mb-1 ${scenario.type === 'incident' ? 'text-red-500' : 'text-amber'}`}>
                        {scenario.title}
                      </div>
                      <div className="text-white">
                        {scenario.request.slice(0, visibleRequestChars)}
                        {phase === 'request' && visibleRequestChars < scenario.request.length && (
                          <span className="inline-block w-2 h-4 bg-white animate-pulse ml-0.5 align-middle" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Discovering indicator */}
            <AnimatePresence>
              {['discovering', 'planning', 'writing_code', 'awaiting_approval', 'deploying', 'executing', 'resolved'].includes(phase) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-cyan">◐</span>
                  <div className="text-cyan">Discovering context...</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Discovery Steps */}
            <AnimatePresence>
              {scenario.discoveries.slice(0, visibleDiscoveries).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 pl-6"
                >
                  <span className="text-white-muted">→</span>
                  <div>
                    <span className="text-cyan">[{step.source}]</span>
                    <span className="text-white ml-2">{step.finding}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Planning Steps */}
            <AnimatePresence>
              {scenario.plan && phase !== 'idle' && phase !== 'request' && phase !== 'discovering' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-amber">◇</span>
                  <div className="text-amber">Planning implementation...</div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {scenario.plan?.slice(0, visiblePlanSteps).map((step, i) => (
                <motion.div
                  key={`plan-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 pl-6"
                >
                  <span className="text-amber">{i + 1}.</span>
                  <span className="text-white-dim">{step}</span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Writing code indicator */}
            <AnimatePresence>
              {['writing_code', 'awaiting_approval', 'deploying', 'executing', 'resolved'].includes(phase) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-cyan">✎</span>
                  <div className="text-cyan">
                    Writing {scenario.files.length} file{scenario.files.length > 1 ? 's' : ''}...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* File progress */}
            <AnimatePresence>
              {phase === 'writing_code' && scenario.files.length > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pl-6 text-white-muted text-xs"
                >
                  [{currentFileIndex + 1}/{scenario.files.length}] {currentFile.name}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Deploying */}
            <AnimatePresence>
              {['deploying', 'executing', 'resolved'].includes(phase) && scenario.runners.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-amber">▶</span>
                  <div className="text-amber">Deploying to {scenario.runners.length} runners...</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Approval prompt - inline in activity feed */}
            <AnimatePresence>
              {phase === 'awaiting_approval' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-amber">?</span>
                  <div className="flex-1">
                    <div className="text-amber mb-2">{scenario.approvalText}</div>
                    <div className="text-white-muted text-xs mb-3">
                      {scenario.files.length} file{scenario.files.length > 1 ? 's' : ''} ready •
                      {scenario.type === 'incident' ? ' rollback available' : ' preview available'}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleApprove}
                        className="px-3 py-1 bg-amber/20 text-amber border border-amber/50 font-mono text-xs rounded hover:bg-amber/30 transition-colors"
                      >
                        [Y] approve
                      </button>
                      <button
                        onClick={handleDeny}
                        className="px-3 py-1 text-white-muted border border-black-border font-mono text-xs rounded hover:bg-white/5 transition-colors"
                      >
                        [N] skip
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Resolved */}
            <AnimatePresence>
              {phase === 'resolved' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-green-neon">✓</span>
                  <div>
                    <div className="text-green-neon font-medium">{scenario.resultText}</div>
                    <div className="text-white-muted text-xs mt-1">{scenario.resultStats}</div>

                    {/* Narrative bridge to next scenario */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 p-3 border border-white-muted/20 rounded bg-white/5"
                    >
                      <div className="text-white-dim text-xs leading-relaxed">
                        {scenarioIndex === 0 && (
                          <>
                            <span className="text-white font-medium">The fire is out.</span>{' '}
                            But why did it happen? Understanding the root cause prevents the next incident.
                          </>
                        )}
                        {scenarioIndex === 1 && (
                          <>
                            <span className="text-white font-medium">Root cause identified.</span>{' '}
                            Now build the guardrails—alerts and dashboards—so it never happens again.
                          </>
                        )}
                        {scenarioIndex === 2 && (
                          <>
                            <span className="text-white font-medium">Prevention deployed.</span>{' '}
                            The incident loop is complete: fix → investigate → prevent. Ready to handle the next one.
                          </>
                        )}
                      </div>
                    </motion.div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          resetDemo()
                          setTimeout(startDemo, 300)
                        }}
                        className="px-3 py-1.5 border border-white-muted/30 text-white-dim font-mono text-xs rounded hover:bg-white/5 transition-colors"
                      >
                        ↺ Replay
                      </button>
                      <button
                        onClick={() => {
                          nextScenario()
                          setTimeout(() => {
                            resetDemo()
                            setTimeout(startDemo, 300)
                          }, 100)
                        }}
                        className="px-3 py-1.5 border border-amber/50 text-amber font-mono text-xs rounded hover:bg-amber/10 transition-colors flex items-center gap-1"
                      >
                        {scenarioIndex === 0 && '2. Investigate →'}
                        {scenarioIndex === 1 && '3. Prevent →'}
                        {scenarioIndex === 2 && '1. Fix →'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Code & Runners */}
        <div className="w-full md:w-1/2 min-h-[400px] md:min-h-0 flex flex-col">
          {/* Output Panel - Visual or Code based on scenario and phase */}
          <div className="flex-1 p-4 md:p-6 border-b border-black-border overflow-hidden">
            <div className="text-white-muted text-xs font-mono mb-4 flex items-center justify-between">
              <span>OUTPUT</span>
              {visibleCodeChars > 0 && phase === 'writing_code' && (
                <div className="flex items-center gap-2">
                  {scenario.files.length > 1 && (
                    <div className="flex gap-1">
                      {scenario.files.map((f, i) => (
                        <span
                          key={f.name}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < currentFileIndex ? 'bg-green-neon' :
                            i === currentFileIndex ? 'bg-amber' : 'bg-white-muted'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <span className="text-amber">{currentFile.name}</span>
                </div>
              )}
            </div>

            {/* Show visual output for deploying/executing/resolved phases, code otherwise */}
            {['deploying', 'executing', 'resolved'].includes(phase) ? (
              <div className="h-64 overflow-y-auto scrollbar-thin">
                {scenario.type === 'incident' && (
                  <IncidentVisual phase={phase} progress={executionProgress} />
                )}
                {scenario.type === 'app_generation' && (
                  <MemoryDashboardVisual phase={phase} />
                )}
                {scenario.type === 'knowledge' && (
                  <PostMortemVisual />
                )}
              </div>
            ) : (
              <div className="bg-black-light rounded border border-black-border p-4 font-mono text-xs h-64 overflow-y-auto scrollbar-thin">
                <div className="text-white">
                  {highlightCode(currentFile.content.slice(0, visibleCodeChars), currentFile.name)}
                  {phase === 'writing_code' && (
                    <span className="inline-block w-2 h-4 bg-amber animate-pulse ml-0.5" />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Runners Panel */}
          {scenario.runners.length > 0 && (
            <div className="p-4 md:p-6">
              <div className="text-white-muted text-xs font-mono mb-4">RUNNERS</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {runners.map((runner) => (
                  <motion.div
                    key={runner.id}
                    className={`
                      border rounded p-3 font-mono text-xs transition-colors
                      ${runner.status === 'idle' ? 'border-black-border text-white-dim' : ''}
                      ${runner.status === 'receiving' ? 'border-amber bg-amber/5 text-amber' : ''}
                      ${runner.status === 'executing' ? 'border-cyan bg-cyan/5 text-cyan' : ''}
                      ${runner.status === 'done' ? 'border-green-neon bg-green-neon/5 text-green-neon' : ''}
                    `}
                    animate={runner.status === 'executing' ? { opacity: [1, 0.7, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{runner.name}</span>
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        runner.status === 'idle' ? 'bg-white-muted' :
                        runner.status === 'receiving' ? 'bg-amber' :
                        runner.status === 'executing' ? 'bg-cyan animate-pulse' :
                        'bg-green-neon'
                      }`} />
                    </div>
                    <div className="text-white-muted">{runner.platform}</div>
                  </motion.div>
                ))}
              </div>

              {/* Execution Progress */}
              <AnimatePresence>
                {(phase === 'executing' || phase === 'resolved') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className="text-white-muted">Progress</span>
                      <span className="text-cyan">{Math.min(executionProgress, 100)}%</span>
                    </div>
                    <div className="h-1 bg-black-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-cyan"
                        initial={{ width: 0 }}
                        animate={{ width: `${executionProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}

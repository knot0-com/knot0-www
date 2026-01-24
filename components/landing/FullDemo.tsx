'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
  // Scenario 1: Incident Response
  {
    id: 'incident',
    type: 'incident',
    title: 'INCIDENT DETECTED',
    subtitle: 'Auto-remediation',
    request: 'payment-svc memory leak in production',
    discoveries: [
      { source: 'Prometheus', finding: 'memory_usage > 2GB on payment-svc' },
      { source: 'Git History', finding: 'Recent commit: "Add session caching"' },
      { source: 'Source Code', finding: 'Unbounded HashMap in PaymentProcessor.java' },
      { source: 'Kubernetes', finding: '3 pods affected, 2 in CrashLoopBackOff' },
    ],
    files: [{
      name: 'fix-memory-leak.patch',
      content: `--- a/PaymentProcessor.java
+++ b/PaymentProcessor.java
@@ -12,7 +12,12 @@
-  private Map<String, Session> cache = new HashMap<>();
+  private static final int MAX = 1000;
+  private Map<String, Session> cache = new LinkedHashMap<>(
+    MAX, 0.75f, true
+  ) {
+    protected boolean removeEldestEntry(Entry e) {
+      return size() > MAX;
+    }
+  };`
    }],
    runners: [
      { id: 'r1', name: 'prod-k8s-01', platform: 'Kubernetes', status: 'idle' },
      { id: 'r2', name: 'prod-k8s-02', platform: 'Kubernetes', status: 'idle' },
    ],
    approvalText: 'Apply fix to payment-svc (2 pods)',
    resultText: 'Memory leak fixed',
    resultStats: '2 pods patched • 0 downtime • 8 seconds',
  },

  // Scenario 2: App Generation (Long Running)
  {
    id: 'app_generation',
    type: 'app_generation',
    title: 'BUILD REQUEST',
    subtitle: 'App generation',
    request: '"Build a real-time metrics dashboard for our API"',
    discoveries: [
      { source: 'Codebase', finding: 'Found: Express API with 23 endpoints' },
      { source: 'Prometheus', finding: 'Existing metrics: latency, errors, throughput' },
      { source: 'Package.json', finding: 'Stack: React 18, TypeScript, TailwindCSS' },
      { source: 'Auth System', finding: 'JWT auth with role-based access' },
    ],
    plan: [
      'Create dashboard layout with grid system',
      'Add real-time WebSocket connection',
      'Build metric cards (latency, errors, throughput)',
      'Add time range selector and auto-refresh',
      'Integrate with existing auth middleware',
    ],
    files: [
      {
        name: 'Dashboard.tsx',
        content: `export function Dashboard() {
  const { metrics } = useMetrics()
  const { user } = useAuth()

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard
        title="Latency"
        value={metrics.p99}
        unit="ms"
        trend={metrics.latencyTrend}
      />
      <MetricCard
        title="Error Rate"
        value={metrics.errorRate}
        unit="%"
        threshold={5}
      />
      <MetricCard
        title="Throughput"
        value={metrics.rps}
        unit="req/s"
      />
      <TimeSeriesChart data={metrics.history} />
    </div>
  )
}`
      },
      {
        name: 'useMetrics.ts',
        content: `export function useMetrics() {
  const [metrics, setMetrics] = useState<Metrics>()

  useEffect(() => {
    const ws = new WebSocket(METRICS_WS)
    ws.onmessage = (e) => {
      setMetrics(JSON.parse(e.data))
    }
    return () => ws.close()
  }, [])

  return { metrics, isConnected: !!metrics }
}`
      },
      {
        name: 'api/metrics.ts',
        content: `export async function GET(req: Request) {
  const metrics = await prometheus.query({
    queries: [
      'http_request_duration_seconds',
      'http_requests_total',
      'http_errors_total'
    ],
    range: '1h'
  })

  return Response.json(metrics)
}`
      }
    ],
    runners: [
      { id: 'r1', name: 'dev-k8s', platform: 'Kubernetes', status: 'idle' },
      { id: 'r2', name: 'staging-k8s', platform: 'Kubernetes', status: 'idle' },
      { id: 'r3', name: 'vercel-preview', platform: 'Vercel', status: 'idle' },
    ],
    approvalText: 'Deploy dashboard to staging',
    resultText: 'Dashboard deployed',
    resultStats: '3 files • 847 lines • Live at staging.acme.io/dashboard',
  },

  // Scenario 3: Knowledge Discovery
  {
    id: 'knowledge',
    type: 'knowledge',
    title: 'KNOWLEDGE QUERY',
    subtitle: 'Codebase exploration',
    request: '"How does our authentication system work?"',
    discoveries: [
      { source: 'src/auth/', finding: 'JWT-based auth with refresh tokens' },
      { source: 'middleware/', finding: 'Role-based access control (RBAC)' },
      { source: 'Database', finding: 'Users table with bcrypt password hashing' },
      { source: 'API Routes', finding: '/login, /logout, /refresh, /me endpoints' },
      { source: 'Config', finding: 'Token expiry: 15m access, 7d refresh' },
      { source: 'Tests', finding: '94% coverage on auth module' },
    ],
    files: [{
      name: 'AUTH_ARCHITECTURE.md',
      content: `# Authentication Architecture

## Flow
1. User submits credentials to /api/auth/login
2. Server validates against bcrypt hash
3. Returns JWT access token (15m) + refresh token (7d)
4. Client stores refresh token in httpOnly cookie
5. Access token sent via Authorization header

## Security
- Passwords: bcrypt with cost factor 12
- Tokens: RS256 signed JWTs
- RBAC: admin, user, readonly roles
- Rate limiting: 5 attempts per minute

## Key Files
- src/auth/jwt.ts - Token generation
- src/auth/middleware.ts - Route protection
- src/auth/rbac.ts - Permission checks`
    }],
    runners: [],
    approvalText: 'Save documentation to repo',
    resultText: 'Knowledge captured',
    resultStats: 'Explored 47 files • Generated architecture doc',
  },
]

export function FullDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [phase, setPhase] = useState<DemoPhase>('idle')
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

  // Auto-start demo on mount and scenario change
  useEffect(() => {
    const timer = setTimeout(startDemo, 1000)
    return () => clearTimeout(timer)
  }, [startDemo])

  // Phase progression
  useEffect(() => {
    clearTimeouts()

    switch (phase) {
      case 'request':
        timeoutRef.current = setTimeout(() => setPhase('discovering'), 2000)
        break

      case 'discovering':
        if (visibleDiscoveries < scenario.discoveries.length) {
          timeoutRef.current = setTimeout(() => {
            setVisibleDiscoveries(prev => prev + 1)
          }, 600)
        } else {
          timeoutRef.current = setTimeout(() => {
            if (scenario.plan) {
              setPhase('planning')
            } else {
              setPhase('writing_code')
            }
          }, 500)
        }
        break

      case 'planning':
        if (visiblePlanSteps < (scenario.plan?.length || 0)) {
          timeoutRef.current = setTimeout(() => {
            setVisiblePlanSteps(prev => prev + 1)
          }, 400)
        } else {
          timeoutRef.current = setTimeout(() => setPhase('writing_code'), 500)
        }
        break

      case 'writing_code':
        const currentFile = scenario.files[currentFileIndex]
        if (visibleCodeChars < currentFile.content.length) {
          const char = currentFile.content[visibleCodeChars]
          const delay = char === '\n' ? 25 : char === ' ' ? 5 : 10
          timeoutRef.current = setTimeout(() => {
            setVisibleCodeChars(prev => prev + 1)
          }, delay)
        } else if (currentFileIndex < scenario.files.length - 1) {
          // Move to next file
          timeoutRef.current = setTimeout(() => {
            setCurrentFileIndex(prev => prev + 1)
            setVisibleCodeChars(0)
          }, 800)
        } else {
          timeoutRef.current = setTimeout(() => setPhase('awaiting_approval'), 500)
        }
        break

      case 'awaiting_approval':
        timeoutRef.current = setTimeout(() => {
          if (!hasInteracted) {
            handleApprove()
          }
        }, 8000)
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
            setTimeout(() => setPhase('executing'), 400)
          }
        }, 250)
        return () => clearInterval(deployInterval)

      case 'executing':
        const execInterval = setInterval(() => {
          setExecutionProgress(prev => {
            if (prev >= 100) {
              clearInterval(execInterval)
              setRunners(r => r.map(runner => ({ ...runner, status: 'done' })))
              setTimeout(() => setPhase('resolved'), 500)
              return 100
            }
            const progress = prev + 8
            // Update runner statuses
            const doneCount = Math.floor((progress / 100) * scenario.runners.length)
            setRunners(r => r.map((runner, i) => ({
              ...runner,
              status: i < doneCount ? 'done' : i === doneCount ? 'executing' : runner.status
            })))
            return progress
          })
        }, 120)
        return () => clearInterval(execInterval)

      case 'resolved':
        timeoutRef.current = setTimeout(() => {
          nextScenario()
          setTimeout(() => {
            resetDemo()
            setTimeout(startDemo, 500)
          }, 100)
        }, 4000)
        break
    }

    return clearTimeouts
  }, [phase, visibleDiscoveries, visiblePlanSteps, currentFileIndex, visibleCodeChars, scenario, hasInteracted, handleApprove, resetDemo, startDemo, nextScenario])

  const currentFile = scenario.files[currentFileIndex]

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Status Bar */}
      <div className="border-b border-black-border bg-black-light px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-amber font-mono text-sm font-medium">CONTROL ROOM</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-white-dim text-xs font-mono">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-white-muted">
            {/* Scenario indicators */}
            <div className="flex items-center gap-2">
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setScenarioIndex(i)
                    resetDemo()
                    setTimeout(startDemo, 100)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === scenarioIndex ? 'bg-amber' : 'bg-white-muted hover:bg-white-dim'
                  }`}
                  title={s.subtitle}
                />
              ))}
            </div>
            <span className="text-amber">{scenario.subtitle}</span>
          </div>
        </div>
      </div>

      {/* Main Demo Area */}
      <div className="flex-1 flex">
        {/* Left: Activity Feed */}
        <div className="w-1/2 border-r border-black-border p-6 overflow-hidden">
          <div className="text-white-muted text-xs font-mono mb-4">AGENT ACTIVITY</div>

          <div className="space-y-3 font-mono text-sm">
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

            {/* Request */}
            <AnimatePresence>
              {phase !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className={scenario.type === 'incident' ? 'text-red-500' : 'text-amber'}>
                    {scenario.type === 'incident' ? '●' : '▶'}
                  </span>
                  <div>
                    <div className={`font-medium ${scenario.type === 'incident' ? 'text-red-500' : 'text-amber'}`}>
                      {scenario.title}
                    </div>
                    <div className="text-white">{scenario.request}</div>
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

            {/* Resolved */}
            <AnimatePresence>
              {phase === 'resolved' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-green-500">✓</span>
                  <div className="text-green-500 font-medium">{scenario.resultText}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Code & Runners */}
        <div className="w-1/2 flex flex-col">
          {/* Code Panel */}
          <div className="flex-1 p-6 border-b border-black-border overflow-hidden">
            <div className="text-white-muted text-xs font-mono mb-4 flex items-center justify-between">
              <span>OUTPUT</span>
              {visibleCodeChars > 0 && (
                <div className="flex items-center gap-2">
                  {scenario.files.length > 1 && (
                    <div className="flex gap-1">
                      {scenario.files.map((f, i) => (
                        <span
                          key={f.name}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < currentFileIndex ? 'bg-green-500' :
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
            <div className="bg-black-light rounded border border-black-border p-4 font-mono text-xs h-64 overflow-hidden">
              <pre className="text-white whitespace-pre-wrap">
                {currentFile.content.slice(0, visibleCodeChars)}
                {phase === 'writing_code' && (
                  <span className="inline-block w-2 h-4 bg-amber animate-pulse" />
                )}
              </pre>
            </div>
          </div>

          {/* Runners Panel */}
          {scenario.runners.length > 0 && (
            <div className="p-6">
              <div className="text-white-muted text-xs font-mono mb-4">RUNNERS</div>
              <div className="grid grid-cols-2 gap-3">
                {runners.map((runner) => (
                  <motion.div
                    key={runner.id}
                    className={`
                      border rounded p-3 font-mono text-xs transition-colors
                      ${runner.status === 'idle' ? 'border-black-border text-white-dim' : ''}
                      ${runner.status === 'receiving' ? 'border-amber bg-amber/5 text-amber' : ''}
                      ${runner.status === 'executing' ? 'border-cyan bg-cyan/5 text-cyan' : ''}
                      ${runner.status === 'done' ? 'border-green-500 bg-green-500/5 text-green-500' : ''}
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
                        'bg-green-500'
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

          {/* Knowledge output - no runners */}
          {scenario.type === 'knowledge' && scenario.runners.length === 0 && (
            <div className="p-6">
              <div className="text-white-muted text-xs font-mono mb-4">KNOWLEDGE GRAPH</div>
              <div className="border border-black-border rounded p-4 text-xs font-mono">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-cyan">●</span>
                  <span className="text-white">Authentication System</span>
                </div>
                <div className="pl-4 space-y-2 text-white-dim">
                  <div className="flex items-center gap-2">
                    <span className="text-white-muted">├─</span>
                    <span>JWT Tokens (RS256)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white-muted">├─</span>
                    <span>RBAC (3 roles)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white-muted">├─</span>
                    <span>Password Hashing (bcrypt)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white-muted">└─</span>
                    <span>4 API endpoints</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Bar */}
      <AnimatePresence>
        {phase === 'awaiting_approval' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="border-t border-black-border bg-black-light p-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="font-mono text-sm">
                  <div className="text-white mb-1">{scenario.approvalText}</div>
                  <div className="text-white-muted text-xs">
                    {scenario.files.length} file{scenario.files.length > 1 ? 's' : ''} •
                    {scenario.type === 'incident' ? ' Rollback available' : ' Preview available'}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    className="px-8 py-3 bg-amber text-black font-mono text-sm font-medium rounded hover:bg-amber/90 transition-colors animate-pulse"
                  >
                    APPROVE
                  </button>
                  <button
                    onClick={handleDeny}
                    className="px-8 py-3 border border-white-muted text-white font-mono text-sm rounded hover:bg-white/5 transition-colors"
                  >
                    SKIP
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Banner */}
      <AnimatePresence>
        {phase === 'resolved' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="border-t border-green-500/30 bg-green-500/10 p-6"
          >
            <div className="max-w-4xl mx-auto text-center font-mono">
              <div className="text-green-500 text-lg font-medium mb-2">
                ✓ {scenario.resultText}
              </div>
              <div className="text-white-dim text-sm">
                {scenario.resultStats}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { Header } from './Header'
import { MissionFeed } from './MissionFeed'
import { TrefoilLogo } from '../logo'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Copy */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
            >
              AI that builds and runs automations.
              <br />
              <span className="text-amber">Governed.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white-dim max-w-2xl mx-auto font-mono"
            >
              Describe what you need. Agent discovers context and writes the code.
              Runners execute it anywhere. You stay in control.
            </motion.p>
          </div>

          {/* Live Demo - Mission Feed */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MissionFeed />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 border-t border-black-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            <span className="text-white-muted">01.</span> How It Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-amber flex items-center justify-center mx-auto mb-6">
                <span className="text-amber text-2xl font-mono">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Describe Intent</h3>
              <p className="text-white-dim font-mono text-sm">
                Tell the agent what you need in plain language.
                "Fix the memory leak" or "Set up nightly backups"
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-cyan flex items-center justify-center mx-auto mb-6">
                <span className="text-cyan text-2xl font-mono">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Agent Discovers & Writes</h3>
              <p className="text-white-dim font-mono text-sm">
                Agent analyzes your infrastructure, finds context,
                and synthesizes the exact code needed.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                <span className="text-green-500 text-2xl font-mono">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">You Approve, Runners Execute</h3>
              <p className="text-white-dim font-mono text-sm">
                Review the plan, click approve.
                Runners deploy to your infrastructure instantly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Runners Section */}
      <section id="runners" className="py-24 px-4 border-t border-black-border bg-black-light">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            <span className="text-white-muted">02.</span> Runners
          </h2>
          <p className="text-center text-white-dim font-mono mb-16 max-w-2xl mx-auto">
            Lightweight agents that execute anywhere. Install in 60 seconds.
          </p>

          {/* Install Command */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="bg-black border border-black-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-black-border">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-white-muted text-xs ml-2 font-mono">terminal</span>
              </div>
              <div className="p-4 font-mono text-sm">
                <span className="text-green-500">$</span>
                <span className="text-white"> curl -fsSL https://knot0.com/install | sh</span>
              </div>
            </div>
          </div>

          {/* Platform Pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {['Linux', 'macOS', 'Windows', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure'].map((platform) => (
              <span
                key={platform}
                className="px-4 py-2 border border-black-border rounded-full text-sm font-mono text-white-dim hover:border-amber hover:text-amber transition-colors cursor-default"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Governance Section */}
      <section id="governance" className="py-24 px-4 border-t border-black-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">
            <span className="text-white-muted">03.</span> Governance
          </h2>
          <p className="text-center text-white-dim font-mono mb-16 max-w-2xl mx-auto">
            The Three Laws of Knot0. Robots work. Humans authorize.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Law 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="border border-black-border rounded-lg p-6"
            >
              <div className="text-amber text-4xl font-bold mb-4">I</div>
              <h3 className="text-lg font-bold mb-3">Never Execute Without Approval</h3>
              <p className="text-white-dim text-sm font-mono">
                High-impact changes always require human authorization.
                No surprises, no accidents.
              </p>
            </motion.div>

            {/* Law 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-black-border rounded-lg p-6"
            >
              <div className="text-amber text-4xl font-bold mb-4">II</div>
              <h3 className="text-lg font-bold mb-3">Full Audit Trail</h3>
              <p className="text-white-dim text-sm font-mono">
                Every decision, every action, every outcome is logged.
                Complete visibility into what happened and why.
              </p>
            </motion.div>

            {/* Law 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="border border-black-border rounded-lg p-6"
            >
              <div className="text-amber text-4xl font-bold mb-4">III</div>
              <h3 className="text-lg font-bold mb-3">Automatic Rollback</h3>
              <p className="text-white-dim text-sm font-mono">
                If something goes wrong, we revert immediately.
                Safety nets are built into every operation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-black-border bg-black-light">
        <div className="max-w-2xl mx-auto text-center">
          <TrefoilLogo size={64} className="mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">Ready to take control?</h2>
          <p className="text-white-dim font-mono mb-8">
            Start with the free tier. Scale as you grow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/get-started"
              className="px-8 py-3 bg-amber text-black font-mono font-medium rounded hover:bg-amber/90 transition-colors"
            >
              GET STARTED
            </a>
            <a
              href="/demo"
              className="px-8 py-3 border border-white-muted text-white font-mono rounded hover:bg-white/5 transition-colors"
            >
              BOOK A DEMO
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-black-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-mono text-white-muted">
          <div className="flex items-center gap-2">
            <TrefoilLogo size={20} />
            <span>Knot0</span>
          </div>
          <div className="flex gap-6">
            <a href="/writing" className="hover:text-white transition-colors">Writing</a>
            <a href="https://github.com/knot0" className="hover:text-white transition-colors">GitHub</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          </div>
          <div>© 2026 Knot0</div>
        </div>
      </footer>
    </div>
  )
}

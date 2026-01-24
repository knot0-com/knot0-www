'use client'

import { useState, useEffect, useCallback } from 'react'
import { TabBar } from './TabBar'
import { StatusBar } from './StatusBar'
import { OverviewPanel } from './panels/Overview'
import { AgentPanel } from './panels/Agent'
import { RunnersPanel } from './panels/Runners'
import { GovernancePanel } from './panels/Governance'
import { DeployPanel } from './panels/Deploy'

export type TabId = 'overview' | 'agent' | 'runners' | 'governance' | 'deploy'

const TABS: { id: TabId; label: string; key: string }[] = [
  { id: 'overview', label: 'OVERVIEW', key: '1' },
  { id: 'agent', label: 'AGENT', key: '2' },
  { id: 'runners', label: 'RUNNERS', key: '3' },
  { id: 'governance', label: 'GOVERNANCE', key: '4' },
  { id: 'deploy', label: 'DEPLOY', key: '5' },
]

export function ControlRoom() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [visitedTabs, setVisitedTabs] = useState<Set<TabId>>(new Set(['overview']))

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab)
    setVisitedTabs(prev => new Set([...prev, tab]))
  }, [])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Number keys 1-5 for tabs
      const num = parseInt(e.key)
      if (num >= 1 && num <= 5) {
        handleTabChange(TABS[num - 1].id)
        return
      }

      // ? for help (future)
      if (e.key === '?') {
        // TODO: Show keyboard shortcuts modal
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleTabChange])

  const isFirstVisit = !visitedTabs.has(activeTab)

  return (
    <div className="h-screen w-screen flex flex-col bg-black scanlines grain">
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <main className="flex-1 overflow-hidden">
        {activeTab === 'overview' && <OverviewPanel animate={isFirstVisit} />}
        {activeTab === 'agent' && <AgentPanel animate={isFirstVisit} />}
        {activeTab === 'runners' && <RunnersPanel animate={isFirstVisit} />}
        {activeTab === 'governance' && <GovernancePanel animate={isFirstVisit} />}
        {activeTab === 'deploy' && <DeployPanel animate={isFirstVisit} />}
      </main>

      <StatusBar />
    </div>
  )
}

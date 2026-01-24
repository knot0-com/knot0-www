import { TabId } from './ControlRoom'
import { Knot0Wordmark } from '../logo'

interface TabBarProps {
  tabs: { id: TabId; label: string; key: string }[]
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <header className="flex items-center border-b border-black-border bg-black-light">
      {/* Animated Logo */}
      <div className="px-6 py-3 border-r border-black-border">
        <Knot0Wordmark size={28} />
      </div>

      {/* Tabs */}
      <nav className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-6 py-4 text-sm tracking-wide transition-colors
              border-r border-black-border
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-inset
              ${activeTab === tab.id
                ? 'text-amber bg-black'
                : 'text-white-dim hover:text-white hover:bg-black/50'
              }
            `}
          >
            <span className="text-white-muted mr-2">{tab.key}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side links */}
      <div className="flex items-center px-4 gap-4 text-sm text-white-dim">
        <a href="/docs" className="hover:text-white transition-colors">DOCS</a>
        <a href="https://github.com/knot0" className="hover:text-white transition-colors">GITHUB</a>
      </div>
    </header>
  )
}

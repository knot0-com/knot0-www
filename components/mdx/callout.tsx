import { ReactNode } from 'react'
import { Info, AlertTriangle, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip'
  children: ReactNode
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  tip: Lightbulb,
}

const styles = {
  info: 'bg-muted-cyan/10 border-muted-cyan/30 text-ink',
  warning: 'bg-safety-orange/10 border-safety-orange/30 text-ink',
  tip: 'bg-green-500/10 border-green-500/30 text-ink',
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const Icon = icons[type]

  return (
    <div className={cn('rounded-lg border p-4 my-6 flex gap-3', styles[type])}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="prose prose-sm max-w-none">{children}</div>
    </div>
  )
}

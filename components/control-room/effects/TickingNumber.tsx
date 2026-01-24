'use client'

import { useState, useEffect, useRef } from 'react'

interface TickingNumberProps {
  value: number
  className?: string
}

export function TickingNumber({ value, className }: TickingNumberProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Randomly tick the value up or down occasionally
    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.7) {
        setDisplayValue(prev => {
          const delta = Math.random() > 0.5 ? 1 : -1
          const newValue = prev + delta
          // Keep within 10% of original value
          const min = Math.floor(value * 0.9)
          const max = Math.ceil(value * 1.1)
          return Math.max(min, Math.min(max, newValue))
        })
      }
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [value])

  return (
    <span className={`tabular-nums transition-all duration-200 ${className || ''}`}>
      {displayValue.toLocaleString()}
    </span>
  )
}

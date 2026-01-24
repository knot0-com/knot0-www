'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface StreamingTextProps {
  text: string
  delay?: number
  onComplete?: () => void
  className?: string
}

export function StreamingText({ text, delay = 0, onComplete, className }: StreamingTextProps) {
  const [displayedChars, setDisplayedChars] = useState(0)

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedChars(prev => {
          if (prev >= text.length) {
            clearInterval(interval)
            onComplete?.()
            return prev
          }
          return prev + 1
        })
      }, 20)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay, onComplete])

  return (
    <span className={className}>
      {text.slice(0, displayedChars)}
      {displayedChars < text.length && (
        <motion.span
          className="inline-block w-2 h-4 bg-amber ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </span>
  )
}

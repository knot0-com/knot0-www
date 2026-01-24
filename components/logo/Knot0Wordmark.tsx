'use client'

import { motion, useAnimation, Variants } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Knot0WordmarkProps {
  size?: number
  className?: string
  autoPlay?: boolean
  interval?: number // ms between animations
}

// Trefoil knot path - fits in a square that aligns with text
const TREFOIL_PATH = "M 12 3 Q 21 3 21 12 Q 21 16 12 16 Q 3 16 3 21 Q 3 27 12 27 Q 21 27 21 21 Q 21 16 12 16 Q 3 16 3 12 Q 3 3 12 3"

// Circle path (the "0") - same viewBox, positioned to align with text
const ZERO_PATH = "M 12 3 A 12 12 0 1 1 11.99 3"

export function Knot0Wordmark({
  size = 32,
  className,
  autoPlay = true,
  interval = 5000
}: Knot0WordmarkProps) {
  const [isKnotted, setIsKnotted] = useState(true)
  const pathControls = useAnimation()
  const dotControls = useAnimation()

  // Animation variants for the knot when in trefoil state (subtle pulse)
  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const morphToZero = async () => {
    // Morph knot to circle (the "0")
    await Promise.all([
      pathControls.start({
        d: ZERO_PATH,
        transition: { duration: 1.2, ease: "easeInOut" }
      }),
      dotControls.start({
        scale: 0,
        opacity: 0,
        transition: { duration: 0.6, ease: "easeIn" }
      })
    ])
    setIsKnotted(false)
  }

  const morphToKnot = async () => {
    // Morph circle back to trefoil
    await Promise.all([
      pathControls.start({
        d: TREFOIL_PATH,
        transition: { duration: 1.2, ease: "easeInOut" }
      }),
      dotControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.6, delay: 0.6, ease: "easeOut" }
      })
    ])
    setIsKnotted(true)
  }

  useEffect(() => {
    if (!autoPlay) return

    const animate = async () => {
      while (true) {
        // Hold as knot
        await new Promise(r => setTimeout(r, interval))

        // Unfold to zero
        await morphToZero()

        // Hold as zero
        await new Promise(r => setTimeout(r, interval / 2))

        // Fold back to knot
        await morphToKnot()
      }
    }

    animate()
  }, [autoPlay, interval])

  // Calculate proportional sizes
  const letterHeight = size
  const letterWidth = size * 0.65
  const knotSize = size * 0.9
  const fontSize = size * 0.85
  const totalWidth = (letterWidth * 4) + knotSize + (size * 0.1) // KNOT + 0 + spacing

  return (
    <div
      className={`inline-flex items-center ${className || ''}`}
      style={{ height: letterHeight }}
    >
      {/* KNOT text */}
      <span
        className="font-bold tracking-tight text-amber"
        style={{
          fontSize,
          lineHeight: 1,
          fontFamily: "'JetBrains Mono', monospace"
        }}
      >
        KNOT
      </span>

      {/* Animated knot/zero */}
      <motion.svg
        width={knotSize}
        height={knotSize}
        viewBox="0 0 24 30"
        fill="none"
        style={{ marginLeft: size * 0.02 }}
        variants={pulseVariants}
        animate={isKnotted ? "pulse" : undefined}
      >
        <motion.path
          d={TREFOIL_PATH}
          stroke="#ffb000"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
          animate={pathControls}
        />

        {/* Center dot - only visible in knot state */}
        <motion.circle
          cx={12}
          cy={15}
          r={2}
          fill="#4ecdc4"
          animate={dotControls}
        />
      </motion.svg>
    </div>
  )
}

// Compact version for nav/headers
export function Knot0WordmarkCompact({
  className,
  onClick
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-0.5 ${className || ''}`}
    >
      <span className="font-bold text-amber tracking-tight">KNOT</span>
      <svg
        width={20}
        height={24}
        viewBox="0 0 24 30"
        fill="none"
      >
        <path
          d={TREFOIL_PATH}
          stroke="#ffb000"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <circle cx={12} cy={15} r={2} fill="#4ecdc4" />
      </svg>
    </button>
  )
}

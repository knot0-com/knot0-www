'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

interface Knot0WordmarkProps {
  size?: number
  className?: string
}

// Clean trefoil knot SVG - 3 lobes with proper crossings
// Oriented vertically: top lobe up, two lobes at bottom
// viewBox is 0 0 100 120 to fit a tall "0" shape
const TREFOIL_PATHS = {
  // Top lobe (the vertical oval at top)
  topLobe: "M 50 10 C 70 10, 80 30, 80 45 C 80 55, 70 60, 55 58",
  // Right side going down
  rightDown: "M 55 58 C 45 56, 42 52, 50 45 C 58 38, 70 42, 75 55",
  // Right bottom lobe
  rightLobe: "M 75 55 C 85 75, 80 95, 65 100 C 55 103, 48 95, 50 85",
  // Bottom crossing to left
  bottomCross: "M 50 85 C 52 75, 45 70, 35 75",
  // Left bottom lobe
  leftLobe: "M 35 75 C 20 85, 15 100, 25 105 C 40 112, 55 100, 50 85",
  // Left side going up
  leftUp: "M 25 70 C 15 55, 20 40, 35 35 C 42 33, 48 38, 50 45",
  // Back to top
  toTop: "M 50 45 C 52 35, 45 25, 50 10"
}

// Single continuous trefoil path
const TREFOIL_PATH = `
  M 50 8
  C 72 8, 82 28, 82 48
  C 82 62, 72 70, 58 68
  C 52 67, 48 63, 50 55
  C 52 48, 62 45, 72 52
  C 88 62, 88 88, 70 100
  C 58 108, 46 102, 50 88
  C 52 80, 48 76, 42 78
  C 30 82, 18 100, 30 108
  C 42 116, 58 108, 50 88
  C 46 78, 38 72, 28 68
  C 12 62, 12 38, 28 24
  C 38 16, 48 18, 50 28
  C 52 38, 48 48, 50 55
  C 52 62, 42 68, 30 62
  C 18 56, 18 36, 32 24
  C 40 18, 50 8, 50 8
`.trim()

// Simple ellipse for the "0" - same viewBox dimensions
const ZERO_PATH = `
  M 50 8
  C 78 8, 92 35, 92 60
  C 92 85, 78 112, 50 112
  C 22 112, 8 85, 8 60
  C 8 35, 22 8, 50 8
  Z
`.trim()

export function Knot0Wordmark({ size = 32, className }: Knot0WordmarkProps) {
  const { scrollY } = useScroll()

  // Map scroll to animation progress: 0 at top, 1 after 300px scroll
  const progress = useTransform(scrollY, [0, 300], [0, 1])

  // Zero fades out, trefoil fades in
  const zeroOpacity = useTransform(progress, [0, 0.4, 0.6], [1, 1, 0])
  const trefoilOpacity = useTransform(progress, [0.4, 0.6, 1], [0, 0, 1])

  // Dot appears with trefoil
  const dotOpacity = useTransform(progress, [0.5, 0.8], [0, 1])
  const dotScale = useTransform(progress, [0.5, 0.8], [0, 1])

  const fontSize = size
  const knotWidth = size * 0.6
  const knotHeight = size * 0.72

  return (
    <div className={`inline-flex items-baseline ${className || ''}`}>
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

      {/* The "0" that transforms into trefoil on scroll */}
      <svg
        width={knotWidth}
        height={knotHeight}
        viewBox="0 0 100 120"
        fill="none"
        style={{ marginLeft: size * 0.03, marginBottom: -size * 0.05 }}
      >
        {/* Zero (unknot) - visible at top of page */}
        <motion.path
          d={ZERO_PATH}
          stroke="#ffb000"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ opacity: zeroOpacity }}
        />

        {/* Trefoil - visible when scrolled */}
        <motion.path
          d={TREFOIL_PATH}
          stroke="#ffb000"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ opacity: trefoilOpacity }}
        />

        {/* Center dot - appears with trefoil */}
        <motion.circle
          cx={50}
          cy={60}
          r={5}
          fill="#4ecdc4"
          style={{
            opacity: dotOpacity,
            scale: dotScale
          }}
        />
      </svg>
    </div>
  )
}

// Static version for use without scroll context
export function Knot0WordmarkStatic({
  size = 32,
  variant = 'zero',
  className
}: {
  size?: number
  variant?: 'zero' | 'trefoil'
  className?: string
}) {
  const fontSize = size
  const knotWidth = size * 0.6
  const knotHeight = size * 0.72

  return (
    <div className={`inline-flex items-baseline ${className || ''}`}>
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

      <svg
        width={knotWidth}
        height={knotHeight}
        viewBox="0 0 100 120"
        fill="none"
        style={{ marginLeft: size * 0.03, marginBottom: -size * 0.05 }}
      >
        <path
          d={variant === 'zero' ? ZERO_PATH : TREFOIL_PATH}
          stroke="#ffb000"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {variant === 'trefoil' && (
          <circle cx={50} cy={60} r={5} fill="#4ecdc4" />
        )}
      </svg>
    </div>
  )
}

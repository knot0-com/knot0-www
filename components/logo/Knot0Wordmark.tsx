'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

interface Knot0WordmarkProps {
  size?: number
  className?: string
}

// Clean trefoil knot - based on the minimal v3 reference
const TREFOIL_PATH = `
  M 50 12
  C 72 12, 82 30, 82 50
  C 82 65, 70 75, 55 72
  C 48 71, 45 65, 50 58
  C 55 51, 68 52, 75 62
  C 85 78, 78 95, 62 102
  C 50 107, 40 100, 45 88
  C 48 80, 42 75, 35 78
  C 22 82, 15 95, 25 102
  C 38 110, 50 100, 50 88
  C 50 78, 40 72, 28 68
  C 15 62, 15 35, 30 22
  C 40 15, 50 12, 50 12
`.trim()

export function Knot0Wordmark({ size = 32, className }: Knot0WordmarkProps) {
  const { scrollY } = useScroll()

  // Map scroll to animation progress: 0 at top, 1 after 300px scroll
  const progress = useTransform(scrollY, [0, 300], [0, 1])

  // Text fades out, trefoil fades in
  const textOpacity = useTransform(progress, [0, 0.3, 0.5], [1, 1, 0])
  const textScale = useTransform(progress, [0, 0.3, 0.5], [1, 1, 0.8])
  const trefoilOpacity = useTransform(progress, [0.3, 0.5, 0.7], [0, 0, 1])
  const trefoilScale = useTransform(progress, [0.3, 0.5, 0.7], [0.8, 0.8, 1])

  // Dot appears with trefoil
  const dotOpacity = useTransform(progress, [0.5, 0.7], [0, 1])

  const fontSize = size
  const trefoilSize = size * 1.2

  return (
    <div className={`relative inline-flex items-center justify-center ${className || ''}`}>
      {/* Text wordmark - visible at top */}
      <motion.span
        className="font-bold tracking-tight text-amber"
        style={{
          fontSize,
          lineHeight: 1,
          fontFamily: "'JetBrains Mono', monospace",
          opacity: textOpacity,
          scale: textScale,
        }}
      >
        KNOT0
      </motion.span>

      {/* Trefoil symbol - visible when scrolled */}
      <motion.svg
        width={trefoilSize}
        height={trefoilSize}
        viewBox="0 0 100 115"
        fill="none"
        className="absolute"
        style={{
          opacity: trefoilOpacity,
          scale: trefoilScale,
        }}
      >
        <motion.path
          d={TREFOIL_PATH}
          stroke="#ffb000"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Center dot */}
        <motion.circle
          cx={50}
          cy={62}
          r={4}
          fill="#4ecdc4"
          style={{ opacity: dotOpacity }}
        />
      </motion.svg>
    </div>
  )
}

// Static versions
export function Knot0WordmarkStatic({
  size = 32,
  variant = 'text',
  className
}: {
  size?: number
  variant?: 'text' | 'trefoil'
  className?: string
}) {
  const fontSize = size
  const trefoilSize = size * 1.2

  if (variant === 'text') {
    return (
      <span
        className={`font-bold tracking-tight text-amber ${className || ''}`}
        style={{
          fontSize,
          lineHeight: 1,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        KNOT0
      </span>
    )
  }

  return (
    <svg
      width={trefoilSize}
      height={trefoilSize}
      viewBox="0 0 100 115"
      fill="none"
      className={className}
    >
      <path
        d={TREFOIL_PATH}
        stroke="#ffb000"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx={50} cy={62} r={4} fill="#4ecdc4" />
    </svg>
  )
}

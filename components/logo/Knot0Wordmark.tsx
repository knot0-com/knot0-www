
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

interface Knot0WordmarkProps {
  size?: number
  className?: string
}

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

      {/* Trefoil symbol - 3 overlapping ellipses */}
      <motion.svg
        width={trefoilSize}
        height={trefoilSize}
        viewBox="0 0 100 100"
        fill="none"
        className="absolute"
        style={{
          opacity: trefoilOpacity,
          scale: trefoilScale,
        }}
      >
        {/* Top lobe - vertical ellipse */}
        <ellipse
          cx="50"
          cy="30"
          rx="18"
          ry="25"
          stroke="#ffb000"
          strokeWidth="3"
          fill="none"
        />
        {/* Bottom-left lobe - rotated ellipse */}
        <ellipse
          cx="35"
          cy="68"
          rx="18"
          ry="25"
          stroke="#ffb000"
          strokeWidth="3"
          fill="none"
          transform="rotate(-60 35 68)"
        />
        {/* Bottom-right lobe - rotated ellipse */}
        <ellipse
          cx="65"
          cy="68"
          rx="18"
          ry="25"
          stroke="#ffb000"
          strokeWidth="3"
          fill="none"
          transform="rotate(60 65 68)"
        />
        {/* Center dot */}
        <motion.circle
          cx="50"
          cy="55"
          r="4"
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
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* Top lobe */}
      <ellipse
        cx="50"
        cy="30"
        rx="18"
        ry="25"
        stroke="#ffb000"
        strokeWidth="3"
        fill="none"
      />
      {/* Bottom-left lobe */}
      <ellipse
        cx="35"
        cy="68"
        rx="18"
        ry="25"
        stroke="#ffb000"
        strokeWidth="3"
        fill="none"
        transform="rotate(-60 35 68)"
      />
      {/* Bottom-right lobe */}
      <ellipse
        cx="65"
        cy="68"
        rx="18"
        ry="25"
        stroke="#ffb000"
        strokeWidth="3"
        fill="none"
        transform="rotate(60 65 68)"
      />
      {/* Center dot */}
      <circle cx="50" cy="55" r="4" fill="#4ecdc4" />
    </svg>
  )
}

// Standalone trefoil logo component
export function TrefoilLogo({
  size = 40,
  className
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <ellipse
        cx="50"
        cy="30"
        rx="18"
        ry="25"
        stroke="#ffb000"
        strokeWidth="3"
        fill="none"
      />
      <ellipse
        cx="35"
        cy="68"
        rx="18"
        ry="25"
        stroke="#ffb000"
        strokeWidth="3"
        fill="none"
        transform="rotate(-60 35 68)"
      />
      <ellipse
        cx="65"
        cy="68"
        rx="18"
        ry="25"
        stroke="#ffb000"
        strokeWidth="3"
        fill="none"
        transform="rotate(60 65 68)"
      />
      <circle cx="50" cy="55" r="4" fill="#4ecdc4" />
    </svg>
  )
}

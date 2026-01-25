
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

// Mathematically correct trefoil knot path (flat version)
// Generated from parametric equations: x = sin(t) + 2*sin(2t), y = cos(t) - 2*cos(2t)
const TREFOIL_PATH = "M 50.00 68.00 C 53.72 68.00 57.62 67.51 61.15 66.63 C 64.68 65.75 68.18 64.35 71.16 62.70 C 74.14 61.05 76.88 58.93 79.02 56.74 C 81.15 54.55 82.87 51.99 83.96 49.56 C 85.05 47.12 85.59 44.47 85.56 42.13 C 85.53 39.79 84.88 37.42 83.77 35.50 C 82.67 33.58 80.94 31.83 78.93 30.64 C 76.92 29.44 74.35 28.58 71.70 28.31 C 69.04 28.04 65.96 28.25 63.00 29.00 C 60.04 29.75 56.83 31.07 53.91 32.83 C 50.99 34.58 48.03 36.92 45.50 39.53 C 42.98 42.14 40.60 45.28 38.74 48.50 C 36.88 51.72 35.35 55.35 34.35 58.84 C 33.36 62.34 32.81 66.07 32.75 69.47 C 32.69 72.88 33.15 76.32 33.98 79.26 C 34.81 82.20 36.17 84.97 37.73 87.13 C 39.30 89.30 41.32 91.09 43.36 92.23 C 45.41 93.38 47.79 94.00 50.00 94.00 C 52.21 94.00 54.59 93.38 56.64 92.23 C 58.68 91.09 60.70 89.30 62.27 87.13 C 63.83 84.97 65.19 82.20 66.02 79.26 C 66.85 76.32 67.31 72.88 67.25 69.47 C 67.19 66.07 66.64 62.34 65.65 58.84 C 64.65 55.35 63.12 51.72 61.26 48.50 C 59.40 45.28 57.02 42.14 54.50 39.53 C 51.97 36.92 49.01 34.58 46.09 32.83 C 43.17 31.07 39.96 29.75 37.00 29.00 C 34.04 28.25 30.96 28.04 28.30 28.31 C 25.65 28.58 23.08 29.44 21.07 30.64 C 19.06 31.83 17.33 33.58 16.23 35.50 C 15.12 37.42 14.47 39.79 14.44 42.13 C 14.41 44.47 14.95 47.12 16.04 49.56 C 17.13 51.99 18.85 54.55 20.98 56.74 C 23.12 58.93 25.86 61.05 28.84 62.70 C 31.82 64.35 35.32 65.75 38.85 66.63 C 42.38 67.51 46.28 68.00 50.00 68.00 Z"

// 3D Trefoil with over/under crossings - 6 segments with gaps
const KNOT_SEGMENTS = {
  // Under strands (darker, drawn first)
  under: [
    "M 80.58 31.79 C 80.12 31.50 78.82 30.53 77.82 30.04 C 76.83 29.54 75.74 29.14 74.60 28.84 C 73.46 28.54 72.24 28.34 70.99 28.25 C 69.73 28.16 68.42 28.17 67.09 28.29 C 65.76 28.42 64.38 28.65 63.00 29.00 C 61.62 29.35 60.22 29.80 58.83 30.37 C 57.44 30.93 56.05 31.60 54.68 32.37 C 53.32 33.15 51.97 34.03 50.66 35.00 C 49.36 35.97 48.08 37.04 46.86 38.19 C 45.65 39.33 43.96 41.26 43.38 41.88",
    "M 56.62 41.88 C 56.04 41.26 54.35 39.33 53.14 38.19 C 51.92 37.04 50.64 35.97 49.34 35.00 C 48.03 34.03 46.68 33.15 45.32 32.37 C 43.95 31.60 42.56 30.93 41.17 30.37 C 39.78 29.80 38.38 29.35 37.00 29.00 C 35.62 28.65 34.24 28.42 32.91 28.29 C 31.58 28.17 30.27 28.16 29.01 28.25 C 27.76 28.34 26.54 28.54 25.40 28.84 C 24.26 29.14 23.17 29.54 22.18 30.04 C 21.18 30.53 19.88 31.50 19.42 31.79",
    "M 54.81 93.09 C 55.29 92.84 56.78 92.20 57.71 91.58 C 58.63 90.96 59.53 90.22 60.36 89.38 C 61.19 88.54 61.97 87.59 62.68 86.55 C 63.38 85.51 64.03 84.37 64.58 83.15 C 65.14 81.93 65.63 80.62 66.02 79.26 C 66.41 77.89 66.71 76.45 66.92 74.97 C 67.12 73.48 67.24 71.93 67.25 70.37 C 67.26 68.80 67.18 67.19 66.99 65.58 C 66.80 63.96 66.52 62.32 66.13 60.69 C 65.74 59.07 64.92 56.64 64.67 55.83",
  ],
  // Over strands (brighter, drawn on top with shadow)
  over: [
    "M 58.05 67.29 C 58.88 67.10 61.39 66.60 62.99 66.12 C 64.59 65.64 66.16 65.07 67.65 64.43 C 69.14 63.78 70.59 63.05 71.94 62.26 C 73.29 61.46 74.57 60.59 75.75 59.67 C 76.93 58.75 78.03 57.76 79.02 56.74 C 80.00 55.72 80.90 54.65 81.67 53.56 C 82.45 52.47 83.11 51.33 83.66 50.20 C 84.21 49.07 84.64 47.91 84.96 46.78 C 85.27 45.64 85.46 44.49 85.53 43.39 C 85.61 42.28 85.42 40.67 85.39 40.12",
    "M 35.33 55.83 C 35.08 56.64 34.26 59.07 33.87 60.69 C 33.48 62.32 33.20 63.96 33.01 65.58 C 32.82 67.19 32.74 68.80 32.75 70.37 C 32.76 71.93 32.88 73.48 33.08 74.97 C 33.29 76.45 33.59 77.89 33.98 79.26 C 34.37 80.62 34.86 81.93 35.42 83.15 C 35.97 84.37 36.62 85.51 37.32 86.55 C 38.03 87.59 38.81 88.54 39.64 89.38 C 40.47 90.22 41.37 90.96 42.29 91.58 C 43.22 92.20 44.71 92.84 45.19 93.09",
    "M 14.61 40.12 C 14.58 40.67 14.39 42.28 14.47 43.39 C 14.54 44.49 14.73 45.64 15.04 46.78 C 15.36 47.91 15.79 49.07 16.34 50.20 C 16.89 51.33 17.55 52.47 18.33 53.56 C 19.10 54.65 20.00 55.72 20.98 56.74 C 21.97 57.76 23.07 58.75 24.25 59.67 C 25.43 60.59 26.71 61.46 28.06 62.26 C 29.41 63.05 30.86 63.78 32.35 64.43 C 33.84 65.07 35.41 65.64 37.01 66.12 C 38.61 66.60 41.12 67.10 41.95 67.29",
  ],
}

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

      {/* Mathematically correct trefoil knot */}
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
        <defs>
          <linearGradient id="wordmarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb000"/>
            <stop offset="50%" stopColor="#ffc933"/>
            <stop offset="100%" stopColor="#ffb000"/>
          </linearGradient>
        </defs>
        {/* Trefoil knot path */}
        <path
          d="M 50.00 68.00 C 53.72 68.00 57.62 67.51 61.15 66.63 C 64.68 65.75 68.18 64.35 71.16 62.70 C 74.14 61.05 76.88 58.93 79.02 56.74 C 81.15 54.55 82.87 51.99 83.96 49.56 C 85.05 47.12 85.59 44.47 85.56 42.13 C 85.53 39.79 84.88 37.42 83.77 35.50 C 82.67 33.58 80.94 31.83 78.93 30.64 C 76.92 29.44 74.35 28.58 71.70 28.31 C 69.04 28.04 65.96 28.25 63.00 29.00 C 60.04 29.75 56.83 31.07 53.91 32.83 C 50.99 34.58 48.03 36.92 45.50 39.53 C 42.98 42.14 40.60 45.28 38.74 48.50 C 36.88 51.72 35.35 55.35 34.35 58.84 C 33.36 62.34 32.81 66.07 32.75 69.47 C 32.69 72.88 33.15 76.32 33.98 79.26 C 34.81 82.20 36.17 84.97 37.73 87.13 C 39.30 89.30 41.32 91.09 43.36 92.23 C 45.41 93.38 47.79 94.00 50.00 94.00 C 52.21 94.00 54.59 93.38 56.64 92.23 C 58.68 91.09 60.70 89.30 62.27 87.13 C 63.83 84.97 65.19 82.20 66.02 79.26 C 66.85 76.32 67.31 72.88 67.25 69.47 C 67.19 66.07 66.64 62.34 65.65 58.84 C 64.65 55.35 63.12 51.72 61.26 48.50 C 59.40 45.28 57.02 42.14 54.50 39.53 C 51.97 36.92 49.01 34.58 46.09 32.83 C 43.17 31.07 39.96 29.75 37.00 29.00 C 34.04 28.25 30.96 28.04 28.30 28.31 C 25.65 28.58 23.08 29.44 21.07 30.64 C 19.06 31.83 17.33 33.58 16.23 35.50 C 15.12 37.42 14.47 39.79 14.44 42.13 C 14.41 44.47 14.95 47.12 16.04 49.56 C 17.13 51.99 18.85 54.55 20.98 56.74 C 23.12 58.93 25.86 61.05 28.84 62.70 C 31.82 64.35 35.32 65.75 38.85 66.63 C 42.38 67.51 46.28 68.00 50.00 68.00 Z"
          stroke="url(#wordmarkGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Center dot */}
        <motion.circle
          cx="50"
          cy="58"
          r="5"
          fill="#4ecdc4"
          style={{ opacity: dotOpacity }}
        />
        {/* Inner highlight */}
        <motion.circle
          cx="48"
          cy="56"
          r="1.5"
          fill="#7eeee6"
          opacity="0.8"
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
      <defs>
        <linearGradient id="staticGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb000"/>
          <stop offset="50%" stopColor="#ffc933"/>
          <stop offset="100%" stopColor="#ffb000"/>
        </linearGradient>
      </defs>
      {/* Mathematically correct trefoil knot */}
      <path
        d={TREFOIL_PATH}
        stroke="url(#staticGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Center dot */}
      <circle cx="50" cy="58" r="5" fill="#4ecdc4" />
      {/* Inner highlight */}
      <circle cx="48" cy="56" r="1.5" fill="#7eeee6" opacity="0.8"/>
    </svg>
  )
}

// Standalone trefoil logo component - mathematically correct version
export function TrefoilLogo({
  size = 40,
  className,
  animated = false
}: {
  size?: number
  className?: string
  animated?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="trefoilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb000"/>
          <stop offset="50%" stopColor="#ffc933"/>
          <stop offset="100%" stopColor="#ffb000"/>
        </linearGradient>
        <filter id="trefoilGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Mathematically correct trefoil knot */}
      <path
        d={TREFOIL_PATH}
        stroke="url(#trefoilGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center node with glow */}
      <circle
        cx="50"
        cy="58"
        r="6"
        fill="#4ecdc4"
        filter="url(#trefoilGlow)"
      >
        {animated && (
          <animate
            attributeName="r"
            values="5;6;5"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Inner highlight */}
      <circle cx="48" cy="56" r="2" fill="#7eeee6" opacity="0.8"/>

      {/* Outer glow ring */}
      {animated && (
        <circle
          cx="50"
          cy="58"
          r="10"
          fill="none"
          stroke="#4ecdc4"
          strokeWidth="1"
          opacity="0.3"
        >
          <animate
            attributeName="r"
            values="9;12;9"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.1;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  )
}

// 3D Trefoil with over/under crossings - shows proper knot topology
export function Trefoil3D({
  size = 40,
  className,
  animated = false
}: {
  size?: number
  className?: string
  animated?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <defs>
        {/* Gradient for over strands (brighter) */}
        <linearGradient id="overGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb000"/>
          <stop offset="50%" stopColor="#ffd966"/>
          <stop offset="100%" stopColor="#ffb000"/>
        </linearGradient>

        {/* Gradient for under strands (darker for depth) */}
        <linearGradient id="underGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cc8800"/>
          <stop offset="50%" stopColor="#e6a800"/>
          <stop offset="100%" stopColor="#cc8800"/>
        </linearGradient>

        {/* Shadow filter for over strands */}
        <filter id="overShadow3d" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.4"/>
        </filter>

        {/* Glow filter for center node */}
        <filter id="nodeGlow3d" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* UNDER STRANDS - drawn first, darker */}
      {KNOT_SEGMENTS.under.map((d, i) => (
        <path
          key={`under-${i}`}
          d={d}
          fill="none"
          stroke="url(#underGradient)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}

      {/* OVER STRANDS - drawn on top, brighter with shadow */}
      {KNOT_SEGMENTS.over.map((d, i) => (
        <path
          key={`over-${i}`}
          d={d}
          fill="none"
          stroke="url(#overGradient)"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#overShadow3d)"
        />
      ))}

      {/* Center node */}
      <circle
        cx="50"
        cy="58"
        r="6"
        fill="#4ecdc4"
        filter="url(#nodeGlow3d)"
      >
        {animated && (
          <animate
            attributeName="r"
            values="5.5;6.5;5.5"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Inner highlight */}
      <circle cx="48" cy="56" r="2" fill="#7eeee6" opacity="0.9"/>
    </svg>
  )
}

// Golden rings logo - three interlocking elliptical rings
export function GoldenRings({
  size = 40,
  className,
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
      <defs>
        {/* Bright golden gradient */}
        <linearGradient id="ringsGoldBright" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff9c4"/>
          <stop offset="15%" stopColor="#ffee58"/>
          <stop offset="40%" stopColor="#ffc107"/>
          <stop offset="70%" stopColor="#ff9800"/>
          <stop offset="100%" stopColor="#ef6c00"/>
        </linearGradient>

        {/* Darker gold for under segments */}
        <linearGradient id="ringsGoldDark" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd54f"/>
          <stop offset="25%" stopColor="#ffb300"/>
          <stop offset="55%" stopColor="#ff8f00"/>
          <stop offset="100%" stopColor="#e65100"/>
        </linearGradient>

        {/* Subtle shadow */}
        <filter id="ringsDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#7f3f00" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* UNDER SEGMENTS */}
      <path d="M 48 45 Q 55 38, 55 30 Q 55 23, 45 23 Q 35 23, 28 30"
            fill="none" stroke="url(#ringsGoldDark)" strokeWidth="7" strokeLinecap="round"/>
      <path d="M 28 55 Q 22 58, 25 65 Q 28 72, 38 74"
            fill="none" stroke="url(#ringsGoldDark)" strokeWidth="7" strokeLinecap="round"/>
      <path d="M 72 55 Q 78 58, 75 65 Q 72 72, 62 74"
            fill="none" stroke="url(#ringsGoldDark)" strokeWidth="7" strokeLinecap="round"/>

      {/* OVER SEGMENTS */}
      <path d="M 52 45 Q 45 38, 45 30 Q 45 23, 55 23 Q 65 23, 72 30 Q 79 37, 79 45 Q 79 53, 72 55"
            fill="none" stroke="url(#ringsGoldBright)" strokeWidth="7" strokeLinecap="round"
            filter="url(#ringsDropShadow)"/>
      <path d="M 28 30 Q 21 37, 21 45 Q 21 53, 28 55 Q 35 57, 42 52 Q 49 47, 48 45"
            fill="none" stroke="url(#ringsGoldBright)" strokeWidth="7" strokeLinecap="round"
            filter="url(#ringsDropShadow)"/>
      <path d="M 38 74 Q 48 76, 50 76 Q 60 76, 62 74 Q 72 72, 75 65 Q 78 58, 72 55 Q 66 52, 58 52 Q 50 52, 42 52"
            fill="none" stroke="url(#ringsGoldBright)" strokeWidth="7" strokeLinecap="round"
            filter="url(#ringsDropShadow)"/>

      {/* HIGHLIGHT LINES */}
      <g stroke="#fffde7" strokeWidth="1.5" fill="none" opacity="0.45" strokeLinecap="round">
        <path d="M 54 43 Q 47 37, 47 31 Q 47 25, 55 25 Q 63 25, 69 31 Q 75 37, 75 44"/>
        <path d="M 30 31 Q 24 37, 24 44 Q 24 51, 30 54"/>
        <path d="M 40 73 Q 48 74, 50 74 Q 58 74, 60 73"/>
      </g>
    </svg>
  )
}

// Rope-style trefoil - golden amber rope with proper over/under crossings
export function RopeTrefoil({
  size = 40,
  className,
  showNode = false
}: {
  size?: number
  className?: string
  showNode?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <defs>
        {/* Rope gradient for "over" strands - warm golden amber */}
        <linearGradient id="ropeOverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe066"/>
          <stop offset="30%" stopColor="#ffcc00"/>
          <stop offset="70%" stopColor="#e6a800"/>
          <stop offset="100%" stopColor="#cc9200"/>
        </linearGradient>

        {/* Rope gradient for "under" strands - deeper amber/bronze */}
        <linearGradient id="ropeUnderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a000"/>
          <stop offset="30%" stopColor="#b38600"/>
          <stop offset="70%" stopColor="#8c6900"/>
          <stop offset="100%" stopColor="#705500"/>
        </linearGradient>

        {/* Subtle shadow for depth on over strands */}
        <filter id="ropeOverShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#3d2800" floodOpacity="0.4"/>
        </filter>

        {/* Glow for center node */}
        <filter id="ropeNodeGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* UNDER STRANDS (drawn first, darker) */}
      {KNOT_SEGMENTS.under.map((d, i) => (
        <path
          key={`rope-under-${i}`}
          d={d}
          fill="none"
          stroke="url(#ropeUnderGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />
      ))}

      {/* OVER STRANDS (drawn on top, brighter with shadow) */}
      {KNOT_SEGMENTS.over.map((d, i) => (
        <path
          key={`rope-over-${i}`}
          d={d}
          fill="none"
          stroke="url(#ropeOverGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#ropeOverShadow)"
        />
      ))}

      {/* Highlight lines for rope texture */}
      <g opacity="0.3" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M 58 66 C 62 65 68 63 72 61 C 76 59 80 55 83 50 C 85 46 86 42 85.5 40"/>
        <path d="M 35 56 C 34 59 33 65 33 70 C 33 76 34 82 37 87 C 40 90 43 92 45 93"/>
        <path d="M 15 40 C 15 45 16 50 19 54 C 22 58 26 61 30 63 C 34 65 39 67 42 67"/>
      </g>

      {/* Optional center node */}
      {showNode && (
        <>
          <circle
            cx="50"
            cy="58"
            r="5"
            fill="#4ecdc4"
            filter="url(#ropeNodeGlow)"
          />
          <circle cx="48" cy="56" r="1.5" fill="#7eeee6" opacity="0.9"/>
        </>
      )}
    </svg>
  )
}

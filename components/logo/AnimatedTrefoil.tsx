'use client'

import { motion } from 'framer-motion'

// Mathematically correct trefoil knot path
const TREFOIL_PATH = "M 50.00 68.00 C 53.72 68.00 57.62 67.51 61.15 66.63 C 64.68 65.75 68.18 64.35 71.16 62.70 C 74.14 61.05 76.88 58.93 79.02 56.74 C 81.15 54.55 82.87 51.99 83.96 49.56 C 85.05 47.12 85.59 44.47 85.56 42.13 C 85.53 39.79 84.88 37.42 83.77 35.50 C 82.67 33.58 80.94 31.83 78.93 30.64 C 76.92 29.44 74.35 28.58 71.70 28.31 C 69.04 28.04 65.96 28.25 63.00 29.00 C 60.04 29.75 56.83 31.07 53.91 32.83 C 50.99 34.58 48.03 36.92 45.50 39.53 C 42.98 42.14 40.60 45.28 38.74 48.50 C 36.88 51.72 35.35 55.35 34.35 58.84 C 33.36 62.34 32.81 66.07 32.75 69.47 C 32.69 72.88 33.15 76.32 33.98 79.26 C 34.81 82.20 36.17 84.97 37.73 87.13 C 39.30 89.30 41.32 91.09 43.36 92.23 C 45.41 93.38 47.79 94.00 50.00 94.00 C 52.21 94.00 54.59 93.38 56.64 92.23 C 58.68 91.09 60.70 89.30 62.27 87.13 C 63.83 84.97 65.19 82.20 66.02 79.26 C 66.85 76.32 67.31 72.88 67.25 69.47 C 67.19 66.07 66.64 62.34 65.65 58.84 C 64.65 55.35 63.12 51.72 61.26 48.50 C 59.40 45.28 57.02 42.14 54.50 39.53 C 51.97 36.92 49.01 34.58 46.09 32.83 C 43.17 31.07 39.96 29.75 37.00 29.00 C 34.04 28.25 30.96 28.04 28.30 28.31 C 25.65 28.58 23.08 29.44 21.07 30.64 C 19.06 31.83 17.33 33.58 16.23 35.50 C 15.12 37.42 14.47 39.79 14.44 42.13 C 14.41 44.47 14.95 47.12 16.04 49.56 C 17.13 51.99 18.85 54.55 20.98 56.74 C 23.12 58.93 25.86 61.05 28.84 62.70 C 31.82 64.35 35.32 65.75 38.85 66.63 C 42.38 67.51 46.28 68.00 50.00 68.00 Z"

interface AnimatedTrefoilProps {
  size?: number
  className?: string
  delay?: number
  loop?: boolean
}

export function AnimatedTrefoil({
  size = 100,
  className,
  delay = 0,
  loop = true
}: AnimatedTrefoilProps) {
  const pathLength = 600

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb000"/>
          <stop offset="50%" stopColor="#ffc933"/>
          <stop offset="100%" stopColor="#ffb000"/>
        </linearGradient>

        <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="centerGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Trefoil path with draw animation */}
      <motion.path
        d={TREFOIL_PATH}
        fill="none"
        stroke="url(#animatedGradient)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#pathGlow)"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration: 2,
            delay,
            ease: "easeInOut",
            repeat: loop ? Infinity : 0,
            repeatDelay: 3
          },
          opacity: { duration: 0.5, delay }
        }}
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: 0
        }}
      />

      {/* Expanding rings */}
      {[0, 0.5, 1].map((ringDelay, i) => (
        <motion.circle
          key={i}
          cx="50"
          cy="58"
          fill="none"
          stroke="#4ecdc4"
          strokeWidth="1"
          initial={{ r: 6, opacity: 0 }}
          animate={{
            r: [6, 20],
            opacity: [0.5, 0]
          }}
          transition={{
            duration: 1.5,
            delay: delay + 1.8 + ringDelay,
            repeat: loop ? Infinity : 0,
            repeatDelay: 1.5 + (2 - ringDelay)
          }}
        />
      ))}

      {/* Center node */}
      <motion.circle
        cx="50"
        cy="58"
        fill="#4ecdc4"
        filter="url(#centerGlow)"
        initial={{ r: 0, opacity: 0 }}
        animate={{
          r: [0, 7, 6],
          opacity: [0, 1, 1]
        }}
        transition={{
          duration: 0.5,
          delay: delay + 1.5,
          times: [0, 0.7, 1],
          repeat: loop ? Infinity : 0,
          repeatDelay: 4.5
        }}
      />

      {/* Pulsing glow on center node */}
      <motion.circle
        cx="50"
        cy="58"
        fill="#4ecdc4"
        initial={{ r: 6, opacity: 0 }}
        animate={{
          r: [6, 7, 6],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 2,
          delay: delay + 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Inner highlight */}
      <motion.circle
        cx="48"
        cy="56"
        r="2"
        fill="#7eeee6"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: delay + 1.7,
          repeat: loop ? Infinity : 0,
          repeatDelay: 4.7
        }}
      />
    </svg>
  )
}

// Continuous spinning version
export function SpinningTrefoil({
  size = 100,
  className,
  duration = 20
}: {
  size?: number
  className?: string
  duration?: number
}) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{ width: size, height: size }}
      className={className}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
      >
        <defs>
          <linearGradient id="spinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffb000"/>
            <stop offset="50%" stopColor="#ffc933"/>
            <stop offset="100%" stopColor="#ffb000"/>
          </linearGradient>
          <filter id="spinGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <path
          d={TREFOIL_PATH}
          fill="none"
          stroke="url(#spinGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#spinGlow)"
        />

        <circle cx="50" cy="58" r="6" fill="#4ecdc4"/>
        <circle cx="48" cy="56" r="2" fill="#7eeee6" opacity="0.9"/>
      </svg>
    </motion.div>
  )
}

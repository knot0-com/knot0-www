'use client'

import { motion } from 'framer-motion'

interface DrawingKnotLogoProps {
  size?: number
  className?: string
  duration?: number
}

// Logo that draws itself in, then morphs to unknot
export function DrawingKnotLogo({
  size = 100,
  className,
  duration = 2
}: DrawingKnotLogoProps) {
  const trefoilPath = "M 50 15 Q 75 15 75 40 Q 75 55 50 55 Q 25 55 25 70 Q 25 85 50 85 Q 75 85 75 70 Q 75 55 50 55 Q 25 55 25 40 Q 25 15 50 15"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* Drawing knot path */}
      <motion.path
        d={trefoilPath}
        stroke="#ffb000"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
      />

      {/* Center dot appears after path draws */}
      <motion.circle
        cx={50}
        cy={50}
        r={3}
        fill="#4ecdc4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: duration,
          duration: 0.3,
          ease: "easeOut"
        }}
      />
    </svg>
  )
}

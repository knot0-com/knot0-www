'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

interface AnimatedKnotLogoProps {
  size?: number
  className?: string
}

// Trefoil knot path (3 crossings)
const TREFOIL_PATH = "M 50 15 Q 75 15 75 40 Q 75 55 50 55 Q 25 55 25 70 Q 25 85 50 85 Q 75 85 75 70 Q 75 55 50 55 Q 25 55 25 40 Q 25 15 50 15"

// Unknot path (simple circle with same point count for smooth morph)
const UNKNOT_PATH = "M 50 15 Q 72 15 85 28 Q 85 50 85 50 Q 85 72 72 85 Q 50 85 50 85 Q 28 85 15 72 Q 15 50 15 50 Q 15 28 28 15 Q 50 15 50 15"

export function AnimatedKnotLogo({ size = 100, className }: AnimatedKnotLogoProps) {
  const pathControls = useAnimation()
  const dotControls = useAnimation()

  useEffect(() => {
    const animate = async () => {
      while (true) {
        // Hold trefoil
        await new Promise(r => setTimeout(r, 2000))

        // Morph to unknot
        await Promise.all([
          pathControls.start({
            d: UNKNOT_PATH,
            transition: { duration: 1.5, ease: "easeInOut" }
          }),
          dotControls.start({
            scale: 1.5,
            opacity: 0.7,
            transition: { duration: 1.5, ease: "easeInOut" }
          })
        ])

        // Hold unknot
        await new Promise(r => setTimeout(r, 1500))

        // Morph back to trefoil
        await Promise.all([
          pathControls.start({
            d: TREFOIL_PATH,
            transition: { duration: 1.5, ease: "easeInOut" }
          }),
          dotControls.start({
            scale: 1,
            opacity: 1,
            transition: { duration: 1.5, ease: "easeInOut" }
          })
        ])
      }
    }

    animate()
  }, [pathControls, dotControls])

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      {/* Animated knot path */}
      <motion.path
        d={TREFOIL_PATH}
        stroke="#ffb000"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
        animate={pathControls}
      />

      {/* Center dot */}
      <motion.circle
        cx={50}
        cy={50}
        r={3}
        fill="#4ecdc4"
        animate={dotControls}
      />
    </svg>
  )
}

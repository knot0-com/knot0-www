'use client'

import { motion } from 'framer-motion'

interface ConnectionAnimationProps {
  isActive: boolean
  runnerCount?: number
}

export function ConnectionAnimation({ isActive, runnerCount = 4 }: ConnectionAnimationProps) {
  // Generate runner positions in a semi-circle below the center
  const runners = Array.from({ length: runnerCount }, (_, i) => {
    const angle = (Math.PI / (runnerCount + 1)) * (i + 1)
    const x = 50 + Math.cos(angle - Math.PI / 2) * 35
    const y = 50 + Math.sin(angle - Math.PI / 2) * 30 + 10
    return { x, y, id: i }
  })

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Central hub (control room) */}
        <motion.circle
          cx={50}
          cy={25}
          r={3}
          fill={isActive ? '#ffb000' : '#333'}
          animate={isActive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
        />

        {/* Connection lines to runners */}
        {runners.map((runner, i) => (
          <g key={runner.id}>
            {/* Line path */}
            <motion.path
              d={`M 50 25 Q ${50 + (runner.x - 50) / 2} ${25 + (runner.y - 25) / 3} ${runner.x} ${runner.y}`}
              fill="none"
              stroke={isActive ? '#ffb000' : '#222'}
              strokeWidth={0.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isActive ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />

            {/* Data pulse along the line */}
            {isActive && (
              <motion.circle
                r={0.8}
                fill="#4ecdc4"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  offsetDistance: ['0%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.2 + 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                style={{
                  offsetPath: `path("M 50 25 Q ${50 + (runner.x - 50) / 2} ${25 + (runner.y - 25) / 3} ${runner.x} ${runner.y}")`,
                }}
              />
            )}

            {/* Runner node */}
            <motion.circle
              cx={runner.x}
              cy={runner.y}
              r={2}
              fill={isActive ? '#4ecdc4' : '#333'}
              animate={
                isActive
                  ? {
                      scale: [1, 1.3, 1],
                      fill: ['#333', '#4ecdc4', '#4ecdc4'],
                    }
                  : {}
              }
              transition={{
                duration: 0.5,
                delay: i * 0.1 + 0.8,
                repeat: isActive ? 0 : 0,
              }}
            />

            {/* Runner label */}
            <text
              x={runner.x}
              y={runner.y + 5}
              textAnchor="middle"
              className="fill-white-muted text-[2px] font-mono"
            >
              R{i + 1}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

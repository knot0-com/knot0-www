'use client'

interface KnotLogoProps {
  size?: number
  variant?: 'trefoil' | 'unknot'
  className?: string
  animated?: boolean
}

// Static logo component
export function KnotLogo({
  size = 40,
  variant = 'trefoil',
  className
}: KnotLogoProps) {
  const trefoilPath = "M 50 15 Q 75 15 75 40 Q 75 55 50 55 Q 25 55 25 70 Q 25 85 50 85 Q 75 85 75 70 Q 75 55 50 55 Q 25 55 25 40 Q 25 15 50 15"
  const unknotPath = "M 50 15 A 35 35 0 1 1 49.99 15"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <path
        d={variant === 'trefoil' ? trefoilPath : unknotPath}
        stroke="#ffb000"
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <circle
        cx={50}
        cy={50}
        r={3}
        fill="#4ecdc4"
      />
    </svg>
  )
}

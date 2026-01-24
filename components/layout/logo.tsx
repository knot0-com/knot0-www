import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-orange rounded">
      <span className="text-2xl font-bold text-ink">
        Knot0
      </span>
    </Link>
  )
}

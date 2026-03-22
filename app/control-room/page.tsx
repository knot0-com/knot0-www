import type { Metadata } from 'next'
import { ControlRoom } from '@/components/control-room'

export const metadata: Metadata = {
  title: 'Control Room - Knot0',
  description: 'Real-time agent orchestration and monitoring dashboard.',
  openGraph: {
    title: 'Control Room - Knot0',
    description: 'Real-time agent orchestration and monitoring dashboard.',
    url: 'https://www.knot0.com/control-room',
  },
}

export default function ControlRoomPage() {
  return <ControlRoom />
}

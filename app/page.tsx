import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { Flow } from '@/components/sections/flow'
import { Discovery } from '@/components/sections/discovery'

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Flow />
        <Discovery />
      </main>
    </>
  )
}

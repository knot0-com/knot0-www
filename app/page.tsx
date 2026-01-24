import { Header } from '@/components/layout/header'
import { Hero } from '@/components/sections/hero'
import { Flow } from '@/components/sections/flow'
import { Discovery } from '@/components/sections/discovery'
import { Runners } from '@/components/sections/runners'
import { SyntheticSoftware } from '@/components/sections/synthetic-software'
import { Governance } from '@/components/sections/governance'

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Flow />
        <Discovery />
        <Runners />
        <SyntheticSoftware />
        <Governance />
      </main>
    </>
  )
}

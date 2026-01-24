import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/sections/hero'
import { Flow } from '@/components/sections/flow'
import { Discovery } from '@/components/sections/discovery'
import { Runners } from '@/components/sections/runners'
import { SyntheticSoftware } from '@/components/sections/synthetic-software'
import { Governance } from '@/components/sections/governance'
import { Autonomous } from '@/components/sections/autonomous'
import { UseCases } from '@/components/sections/use-cases'
import { Comparison } from '@/components/sections/comparison'
import { CTA } from '@/components/sections/cta'

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
        <Autonomous />
        <UseCases />
        <Comparison />
        <CTA />
      </main>
      <Footer />
    </>
  )
}

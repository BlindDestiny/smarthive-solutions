import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import StatsStrip from '@/components/stats-strip'
import Philosophy from '@/components/philosophy'
import PracticeAreasPreview from '@/components/practice-areas-preview'
import Testimonials from '@/components/testimonials'
import TeamPreview from '@/components/team-preview'
import OfficesPreview from '@/components/offices-preview'
import CTA from '@/components/cta'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsStrip />
      <Philosophy />
      <PracticeAreasPreview />
      <Testimonials />
      <TeamPreview />
      <OfficesPreview />
      <CTA />
      <Footer />
    </main>
  )
}

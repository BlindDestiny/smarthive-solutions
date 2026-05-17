import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import StatsStrip from '@/components/stats-strip'
import Story from '@/components/story'
import MenuPreview from '@/components/menu-preview'
import Testimonials from '@/components/testimonials'
import Gallery from '@/components/gallery'
import HoursMap from '@/components/hours-map'
import CTA from '@/components/cta'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsStrip />
      <Story />
      <MenuPreview />
      <Testimonials />
      <Gallery />
      <HoursMap />
      <CTA />
      <Footer />
    </main>
  )
}

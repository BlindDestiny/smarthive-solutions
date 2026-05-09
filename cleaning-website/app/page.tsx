import Navbar       from '@/components/navbar'
import Hero         from '@/components/hero'
import Logos        from '@/components/logos'
import Services     from '@/components/services'
import Process      from '@/components/process'
import Stats        from '@/components/stats'
import Pricing      from '@/components/pricing'
import Testimonials from '@/components/testimonials'
import Gallery      from '@/components/gallery'
import Contact      from '@/components/contact'
import Footer       from '@/components/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Logos />
      <Services />
      <Process />
      <Stats />
      <Pricing />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
    </>
  )
}

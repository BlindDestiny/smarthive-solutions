import Navbar       from '@/components/navbar'
import Hero         from '@/components/hero'
import About        from '@/components/about'
import Menu         from '@/components/menu'
import Stats        from '@/components/stats'
import Events       from '@/components/events'
import Testimonials from '@/components/testimonials'
import Gallery      from '@/components/gallery'
import Reservation  from '@/components/reservation'
import Footer       from '@/components/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Stats />
      <Events />
      <Testimonials />
      <Gallery />
      <Reservation />
      <Footer />
    </>
  )
}

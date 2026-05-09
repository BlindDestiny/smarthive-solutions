import Navbar       from '@/components/navbar'
import Hero         from '@/components/hero'
import About        from '@/components/about'
import Menu         from '@/components/menu'
import Stats        from '@/components/stats'
import Specials     from '@/components/specials'
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
      <Specials />
      <Testimonials />
      <Gallery />
      <Reservation />
      <Footer />
    </>
  )
}

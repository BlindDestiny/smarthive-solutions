import Navbar      from '@/components/navbar'
import Hero        from '@/components/hero'
import About       from '@/components/about'
import Menu        from '@/components/menu'
import Events      from '@/components/events'
import Gallery     from '@/components/gallery'
import Testimonials from '@/components/testimonials'
import Reservation from '@/components/reservation'
import Footer      from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Menu />
      <Events />
      <Gallery />
      <Testimonials />
      <Reservation />
      <Footer />
    </main>
  )
}

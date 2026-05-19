import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Marquee from '@/components/marquee'
import Story from '@/components/story'
import ServicesSection from '@/components/services-section'
import PortfolioGallery from '@/components/portfolio-gallery'
import ProcessSection from '@/components/process-section'
import Differentiators from '@/components/differentiators'
import Testimonials from '@/components/testimonials'
import FAQAccordion from '@/components/faq-accordion'
import LocationMap from '@/components/location-map'
import ContactCTA from '@/components/contact-cta'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <Story />
      <ServicesSection />
      <PortfolioGallery limit={6} />
      <ProcessSection />
      <Differentiators />
      <Testimonials />
      <FAQAccordion />
      <LocationMap />
      <ContactCTA />
      <Footer />
    </main>
  )
}

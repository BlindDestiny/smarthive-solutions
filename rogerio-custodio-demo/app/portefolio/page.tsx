import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import PortfolioGallery from '@/components/portfolio-gallery'
import ContactCTA from '@/components/contact-cta'

export const metadata = {
  title: 'Portefólio — Rogério Custódio · Cozinhas, roupeiros, interiores',
  description: 'Galeria de projetos recentes: cozinhas por medida, roupeiros, mobiliário personalizado, projetos residenciais e comerciais em todo o Algarve.',
}

export default function Portefolio() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Portefólio"
        title="Projetos"
        italic="que executámos."
        description="Uma seleção de trabalhos realizados nos últimos anos para clientes residenciais e comerciais em todo o Algarve. Filtre por categoria para encontrar o que procura."
      />
      <PortfolioGallery showFilters={true} />
      <ContactCTA />
      <Footer />
    </main>
  )
}

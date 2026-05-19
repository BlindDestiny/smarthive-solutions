import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import ContactCTA from '@/components/contact-cta'
import QuoteButton from '@/components/quote-button'
import FAQAccordion from '@/components/faq-accordion'
import { Check } from 'lucide-react'
import { services } from '@/lib/content'

export const metadata = {
  title: 'Serviços — Rogério Custódio · Cozinhas, roupeiros, mobiliário por medida',
  description: 'Carpintaria personalizada em Estoi e Algarve: cozinhas por medida, roupeiros, mobiliário personalizado, carpintaria interior, projetos comerciais e restauro.',
}

export default function Servicos() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="O que fazemos"
        title="Serviços"
        italic="à medida do seu espaço."
        description="Seis áreas que cobrem a quase totalidade dos pedidos que recebemos. Cada projeto é tratado com a mesma metodologia rigorosa — independentemente da escala."
      />

      {/* Each service detailed */}
      <section className="bg-rc-bg">
        <div className="container-rc">
          {services.map((s, i) => {
            const Icon = s.icon
            const reverse = i % 2 === 1
            return (
              <article
                key={s.slug}
                id={s.slug}
                className={`scroll-mt-32 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 py-24 ${
                  i < services.length - 1 ? 'border-b border-rc-line' : ''
                }`}
              >
                <div className={`lg:col-span-6 ${reverse ? 'lg:order-2' : ''}`}>
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    style={{ backgroundImage: `url('${s.image}')` }}
                  />
                </div>

                <div className={`lg:col-span-5 ${reverse ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-8'}`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-display text-sm text-rc-gold italic">{String(i + 1).padStart(2, '0')}</span>
                    <span className="rule" />
                  </div>

                  <div className="w-14 h-14 border border-rc-line flex items-center justify-center mb-6">
                    <Icon size={22} className="text-rc-gold" strokeWidth={1.5} />
                  </div>

                  <h2 className="font-display text-4xl text-rc-ink leading-[1.05]">{s.title}</h2>

                  <p className="mt-6 text-rc-body leading-relaxed">{s.full}</p>

                  <ul className="mt-8 space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm text-rc-body">
                        <span className="mt-1 w-5 h-5 border border-rc-line flex items-center justify-center shrink-0">
                          <Check size={11} className="text-rc-gold" />
                        </span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-10">
                    <QuoteButton preselectedService={s.slug} variant="ghost">
                      Pedir orçamento — {s.title}
                    </QuoteButton>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <FAQAccordion />
      <ContactCTA />
      <Footer />
    </main>
  )
}

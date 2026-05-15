import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import CTA from '@/components/cta'
import { practiceAreas } from '@/lib/content'

export const metadata = {
  title: 'Áreas de Prática — Reis & Pellicano',
  description:
    'Direito imobiliário, nacionalidade portuguesa, vistos gold, fiscal, empresarial e compliance — soluções jurídicas para clientes nacionais e internacionais em Portugal.',
}

export default function AreasDePratica() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="O que fazemos"
        title="Áreas de"
        italic="prática"
        description="Seis áreas complementares para acompanhar a vida pessoal, profissional e patrimonial dos nossos clientes em Portugal. Selecione uma área para conhecer em detalhe."
      />

      <section className="bg-white">
        <div className="container-rp py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rp-line border border-rp-line">
            {practiceAreas.map((area, i) => {
              const Icon = area.icon
              return (
                <Link
                  key={area.slug}
                  href={`/areas-de-pratica/${area.slug}`}
                  className="group bg-white p-10 hover:bg-rp-ink transition-colors flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-display text-xs text-rp-gold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="gold-rule" />
                  </div>

                  <div className="w-12 h-12 border border-rp-line group-hover:border-rp-gold flex items-center justify-center mb-8 transition-colors">
                    <Icon size={22} className="text-rp-gold" />
                  </div>

                  <h2 className="font-display text-2xl text-rp-ink group-hover:text-white transition-colors leading-tight">
                    {area.title}
                  </h2>

                  <p className="mt-4 text-sm text-rp-body/85 group-hover:text-white/70 transition-colors leading-relaxed flex-1">
                    {area.short}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-rp-muted group-hover:text-rp-gold transition-colors">
                    Saber mais <ArrowUpRight size={12} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  )
}

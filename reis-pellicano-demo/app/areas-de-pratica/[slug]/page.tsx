import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import CTA from '@/components/cta'
import FAQAccordion from '@/components/faq-accordion'
import { practiceAreas, faqsByArea } from '@/lib/content'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return practiceAreas.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: Props) {
  const area = practiceAreas.find((a) => a.slug === params.slug)
  if (!area) return {}
  return {
    title: area.metaTitle,
    description: area.metaDescription,
  }
}

export default function PracticeAreaPage({ params }: Props) {
  const area = practiceAreas.find((a) => a.slug === params.slug)
  if (!area) return notFound()

  const others = practiceAreas.filter((a) => a.slug !== area.slug)
  const Icon = area.icon
  const index = practiceAreas.findIndex((a) => a.slug === area.slug) + 1
  const faqs = faqsByArea[area.slug]

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-20 bg-rp-ink text-white">
        <div className="container-rp">
          <Link
            href="/areas-de-pratica"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-white/65 hover:text-rp-gold transition-colors mb-12"
          >
            <ArrowLeft size={14} />
            Áreas de Prática
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-display text-sm text-rp-gold">{String(index).padStart(2, '0')}</span>
                <span className="gold-rule" />
                <span className="eyebrow-dark">Área de Prática</span>
              </div>

              <div className="w-16 h-16 border border-white/20 flex items-center justify-center mb-8">
                <Icon size={28} className="text-rp-gold" />
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.05]">
                {area.title}
              </h1>
            </div>

            <div className="lg:col-span-5">
              <p className="text-lg text-white/75 leading-relaxed">
                {area.short}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section bg-white">
        <div className="container-rp grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">Como Trabalhamos</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-rp-ink leading-tight mb-8">
              A nossa abordagem
            </h2>
            <p className="text-lg text-rp-body leading-relaxed font-light">
              {area.full}
            </p>

            <div className="mt-16">
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-rule" />
                <span className="eyebrow">Serviços incluídos</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-rp-ink leading-tight mb-10">
                O que tratamos
              </h2>

              <ul className="space-y-4">
                {area.services.map((s) => (
                  <li key={s} className="flex items-start gap-4 group">
                    <div className="mt-1 w-6 h-6 border border-rp-line flex items-center justify-center shrink-0 group-hover:border-rp-gold transition-colors">
                      <Check size={12} className="text-rp-gold" />
                    </div>
                    <span className="text-rp-body leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:col-start-9 space-y-10">
            <div className="bg-rp-panel p-8 border border-rp-line">
              <div className="flex items-center gap-3 mb-5">
                <span className="gold-rule" />
                <span className="eyebrow">Para quem</span>
              </div>
              <p className="text-sm text-rp-body leading-relaxed">
                {area.forWhom}
              </p>
            </div>

            <div className="bg-rp-ink p-8 text-white">
              <div className="font-display text-2xl leading-tight mb-3">
                Tem uma situação em curso?
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Avaliamos o seu caso e sugerimos o caminho mais célere — sem compromisso.
              </p>
              <Link
                href="/contactos"
                className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest2 text-rp-gold hover:text-white transition-colors"
              >
                Falar com um Advogado
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQs (apenas se a área tem perguntas frequentes definidas) */}
      {faqs && faqs.length > 0 && <FAQAccordion faqs={faqs} />}

      {/* Outras áreas */}
      <section className={`section ${faqs && faqs.length > 0 ? 'bg-white' : 'bg-rp-panel'}`}>
        <div className="container-rp">
          <div className="flex items-center gap-3 mb-12">
            <span className="gold-rule" />
            <span className="eyebrow">Outras Áreas</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rp-line border border-rp-line">
            {others.map((a) => {
              const I = a.icon
              return (
                <Link
                  key={a.slug}
                  href={`/areas-de-pratica/${a.slug}`}
                  className={`group p-8 hover:bg-rp-ink transition-colors ${faqs && faqs.length > 0 ? 'bg-rp-panel' : 'bg-white'}`}
                >
                  <div className="w-10 h-10 border border-rp-line group-hover:border-rp-gold flex items-center justify-center mb-5 transition-colors">
                    <I size={18} className="text-rp-gold" />
                  </div>
                  <h3 className="font-display text-xl text-rp-ink group-hover:text-white transition-colors leading-tight">
                    {a.title}
                  </h3>
                  <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-rp-muted group-hover:text-rp-gold transition-colors">
                    Ver área <ArrowUpRight size={12} />
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

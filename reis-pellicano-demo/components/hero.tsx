'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useBooking } from './booking-provider'

export default function Hero() {
  const { openBooking } = useBooking()
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-rp-ink via-rp-ink/70 to-rp-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-rp-ink/85 via-rp-ink/30 to-transparent" />

      <div className="relative container-rp pb-24 md:pb-32 pt-40 text-white">
        <div className="max-w-3xl animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <span className="gold-rule" />
            <span className="eyebrow-dark">Sociedade de Advogados · Desde 2019</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-white">
            Soluções jurídicas
            <span className="block italic text-rp-goldLight">precisas e céleres</span>
            para clientes internacionais.
          </h1>

          <p className="mt-10 text-lg md:text-xl text-white/75 max-w-2xl font-light leading-relaxed">
            Multicultural por natureza, internacional por experiência. Acompanhamos
            cidadãos e empresas em Portugal — do investimento à nacionalidade, da
            fiscalidade ao imobiliário.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link href="/areas-de-pratica" className="btn-light group">
              Áreas de Prática
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button onClick={openBooking} className="inline-flex items-center gap-2 px-6 py-4 text-[13px] uppercase tracking-widest2 text-white border border-white/30 hover:border-rp-gold hover:text-rp-gold transition-colors">
              Agendar Consulta
            </button>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rp-gold/40 to-transparent" />
    </section>
  )
}

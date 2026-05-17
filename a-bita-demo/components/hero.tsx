'use client'

import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { useReservation } from './reservation-provider'

export default function Hero() {
  const { openReservation } = useReservation()

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-bita-ink via-bita-ink/65 to-bita-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-bita-ink/80 via-bita-ink/20 to-transparent" />

      <div className="relative container-bita pb-24 md:pb-32 pt-40 text-bita-cream">
        <div className="max-w-3xl animate-fade-up">
          {/* Top rating chip */}
          <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-bita-cream/20 bg-bita-ink/30 backdrop-blur-sm">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-bita-gold text-bita-gold" />
              ))}
            </div>
            <span className="text-[11px] uppercase tracking-widest2 text-bita-cream/85">
              4,7 / 5 · 250 críticas no Google
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-bita-cream italic">
            Refeições caseiras<br />
            <span className="not-italic">no </span>
            <span className="font-script not-italic text-bita-goldLight text-7xl md:text-8xl">País das Maravilhas</span>
          </h1>

          <p className="mt-10 text-lg md:text-xl text-bita-cream/80 max-w-2xl font-light leading-relaxed">
            Brunch, bolos caseiros e refeições para terminar no forno de casa.
            Em Vila Nova de Gaia, feito por uma família — para a sua mesa.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <button onClick={openReservation} className="btn-cream group">
              Reservar Mesa
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/menu" className="inline-flex items-center gap-2 px-6 py-4 text-[13px] uppercase tracking-widest2 text-bita-cream border border-bita-cream/30 hover:border-bita-gold hover:text-bita-gold transition-colors">
              Ver Menu
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-bita-gold/40 to-transparent" />
    </section>
  )
}

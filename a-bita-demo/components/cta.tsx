'use client'

import { Phone, Mail, ArrowRight } from 'lucide-react'
import { restaurant } from '@/lib/content'
import { useReservation } from './reservation-provider'

export default function CTA() {
  const { openReservation } = useReservation()

  return (
    <section className="section bg-bita-bg">
      <div className="container-bita">
        <div className="bg-bita-cream border border-bita-line p-12 md:p-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
          {/* Decorative script note */}
          <div className="hidden md:block absolute -top-3 right-12 max-w-[200px] bg-bita-gold px-4 py-3 shadow-lg rotate-[4deg]">
            <p className="font-script text-lg text-white leading-tight">
              "venha quando o coelho aparecer"
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">Próxima paragem</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-bita-ink leading-tight italic">
              Há uma mesa
              <span className="block font-script not-italic text-6xl md:text-7xl text-bita-gold mt-1">só à sua espera</span>
            </h2>
            <p className="mt-6 text-bita-body leading-relaxed max-w-xl">
              Reserve em segundos — ou se preferir conversar primeiro,
              ligue diretamente. Estamos abertos de terça a domingo.
            </p>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-bita-line lg:pl-12 space-y-4">
            <a
              href={`tel:${restaurant.phoneTel}`}
              className="flex items-center justify-between gap-4 p-5 bg-bita-surface border border-bita-line hover:border-bita-gold transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-bita-gold" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest2 text-bita-muted">Telefone</div>
                  <div className="text-bita-ink font-medium mt-1">{restaurant.phoneDisplay}</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-bita-muted group-hover:text-bita-gold group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href={`mailto:${restaurant.email}`}
              className="flex items-center justify-between gap-4 p-5 bg-bita-surface border border-bita-line hover:border-bita-gold transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-bita-gold" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest2 text-bita-muted">Email</div>
                  <div className="text-bita-ink font-medium mt-1">{restaurant.email}</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-bita-muted group-hover:text-bita-gold group-hover:translate-x-1 transition-all" />
            </a>

            <button onClick={openReservation} className="btn-primary w-full justify-center mt-2">
              Reservar Mesa Online
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

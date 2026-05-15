'use client'

import { Phone, Mail, ArrowRight } from 'lucide-react'
import { firm } from '@/lib/content'
import { useBooking } from './booking-provider'

export default function CTA() {
  const { openBooking } = useBooking()
  return (
    <section className="section bg-rp-panel">
      <div className="container-rp">
        <div className="bg-white border border-rp-line p-12 md:p-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">Próximo passo</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-rp-ink leading-tight">
              Tem dúvidas ou precisa de
              <span className="block italic text-rp-gold">assessoria jurídica?</span>
            </h2>
            <p className="mt-6 text-rp-body/85 leading-relaxed max-w-xl">
              Envie-nos as suas questões e a nossa equipa irá contactá-lo para
              avaliar as suas necessidades — sem compromisso.
            </p>
          </div>

          <div className="lg:col-span-5 lg:border-l lg:border-rp-line lg:pl-12 space-y-4">
            <a
              href={`tel:${firm.phoneTel}`}
              className="flex items-center justify-between gap-4 p-5 border border-rp-line hover:border-rp-gold transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Phone size={20} className="text-rp-gold" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest2 text-rp-muted">Telefone</div>
                  <div className="text-rp-ink font-medium mt-1">{firm.phoneDisplay}</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-rp-muted group-hover:text-rp-gold group-hover:translate-x-1 transition-all" />
            </a>

            <a
              href={`mailto:${firm.email}`}
              className="flex items-center justify-between gap-4 p-5 border border-rp-line hover:border-rp-gold transition-colors group"
            >
              <div className="flex items-center gap-4">
                <Mail size={20} className="text-rp-gold" />
                <div>
                  <div className="text-[11px] uppercase tracking-widest2 text-rp-muted">Email</div>
                  <div className="text-rp-ink font-medium mt-1">{firm.email}</div>
                </div>
              </div>
              <ArrowRight size={16} className="text-rp-muted group-hover:text-rp-gold group-hover:translate-x-1 transition-all" />
            </a>

            <button onClick={openBooking} className="btn-primary w-full justify-center mt-2">
              Marcar Consulta
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

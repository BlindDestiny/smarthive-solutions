import { Quote, Star } from 'lucide-react'
import { testimonials } from '@/lib/content'

export default function Testimonials() {
  return (
    <section className="section bg-white">
      <div className="container-rp">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="gold-rule" />
            <span className="eyebrow">Prova Social</span>
            <span className="gold-rule" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-rp-ink leading-tight">
            O que dizem<br />os nossos clientes.
          </h2>
          <div className="mt-8 inline-flex items-center gap-3 text-sm text-rp-body">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-rp-gold text-rp-gold" />
              ))}
            </div>
            <span className="font-medium text-rp-ink">4.9 / 5</span>
            <span className="text-rp-muted">·</span>
            <span className="text-rp-muted">56 críticas no Google</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rp-line border border-rp-line">
          {testimonials.map((t) => (
            <article key={t.name} className="bg-white p-10 flex flex-col">
              <Quote size={28} className="text-rp-gold mb-6" strokeWidth={1.5} />

              <p className="text-[15px] text-rp-body leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>

              <div className="mt-8 pt-6 border-t border-rp-line">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display text-lg text-rp-ink">{t.name}</div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-rp-gold text-rp-gold" />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] uppercase tracking-widest2 text-rp-muted">
                  {t.meta}
                </div>
                <div className="text-xs text-rp-muted/70 mt-1">{t.date} · Google</div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/search?q=Reis+%26+Pellicano+International+Lawyers"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest2 text-rp-muted hover:text-rp-gold transition-colors"
          >
            Ver todas as críticas no Google →
          </a>
        </div>
      </div>
    </section>
  )
}

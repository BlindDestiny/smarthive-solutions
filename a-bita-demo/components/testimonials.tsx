import { Quote, Star } from 'lucide-react'
import { testimonials } from '@/lib/content'

export default function Testimonials() {
  return (
    <section className="section bg-bita-bg">
      <div className="container-bita">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="gold-rule" />
            <span className="eyebrow">Prova Social</span>
            <span className="gold-rule" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-bita-ink leading-tight italic">
            O que dizem<br />
            <span className="font-script not-italic text-bita-gold text-6xl md:text-7xl">os nossos visitantes</span>
          </h2>
          <div className="mt-8 inline-flex items-center gap-3 text-sm text-bita-body">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-bita-gold text-bita-gold" />
              ))}
            </div>
            <span className="font-medium text-bita-ink">4,7 / 5</span>
            <span className="text-bita-muted">·</span>
            <span className="text-bita-muted">250 críticas no Google</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bita-line border border-bita-line">
          {testimonials.map((t) => (
            <article key={t.name} className="bg-bita-surface p-10 flex flex-col">
              <Quote size={28} className="text-bita-gold mb-6" strokeWidth={1.5} />

              <p className="text-[15px] text-bita-body leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>

              <div className="mt-8 pt-6 border-t border-bita-line">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-display text-lg text-bita-ink">{t.name}</div>
                  <div className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-bita-gold text-bita-gold" />
                    ))}
                  </div>
                </div>
                <div className="text-[11px] uppercase tracking-widest2 text-bita-muted">
                  {t.meta}
                </div>
                <div className="text-xs text-bita-muted/70 mt-1">{t.date} · Google</div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://www.google.com/search?q=A+Bita+Vila+Nova+de+Gaia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-widest2 text-bita-muted hover:text-bita-gold transition-colors"
          >
            Ver todas as 250 críticas no Google →
          </a>
        </div>
      </div>
    </section>
  )
}

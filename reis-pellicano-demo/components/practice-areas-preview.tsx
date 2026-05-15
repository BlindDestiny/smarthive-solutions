import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { practiceAreas } from '@/lib/content'

export default function PracticeAreasPreview() {
  return (
    <section className="section bg-rp-panel">
      <div className="container-rp">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">O que fazemos</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-rp-ink leading-tight max-w-xl">
              Áreas de prática
            </h2>
          </div>
          <Link
            href="/areas-de-pratica"
            className="text-[13px] uppercase tracking-widest2 text-rp-ink hover:text-rp-gold inline-flex items-center gap-2 transition-colors self-start md:self-end"
          >
            Ver todas <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rp-line border border-rp-line">
          {practiceAreas.map((area) => {
            const Icon = area.icon
            return (
              <Link
                key={area.slug}
                href={`/areas-de-pratica/${area.slug}`}
                className="group bg-white p-10 transition-colors hover:bg-rp-ink"
              >
                <div className="w-12 h-12 border border-rp-line group-hover:border-rp-gold flex items-center justify-center mb-8 transition-colors">
                  <Icon size={22} className="text-rp-gold" />
                </div>

                <h3 className="font-display text-2xl text-rp-ink group-hover:text-white transition-colors leading-tight">
                  {area.title}
                </h3>

                <p className="mt-4 text-sm text-rp-body/85 group-hover:text-white/70 transition-colors leading-relaxed">
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
  )
}

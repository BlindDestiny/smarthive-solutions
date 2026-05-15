import { firm } from '@/lib/content'

export default function Philosophy() {
  return (
    <section className="section bg-white">
      <div className="container-rp grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="gold-rule" />
            <span className="eyebrow">A Firma</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-rp-ink leading-tight">
            Advocacia preventiva,
            <span className="block italic text-rp-gold">com proximidade.</span>
          </h2>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <p className="text-lg md:text-xl text-rp-body leading-relaxed font-light">
            {firm.philosophy}
          </p>
          <p className="text-base text-rp-body/85 leading-relaxed">
            {firm.differentiator}
          </p>

          <blockquote className="pl-6 border-l-2 border-rp-gold mt-12">
            <p className="font-display text-2xl md:text-3xl text-rp-ink italic leading-snug">
              "{firm.preventive}"
            </p>
          </blockquote>

          <div className="grid grid-cols-3 gap-6 pt-8 mt-12 border-t border-rp-line">
            <Stat n="6" label="Áreas de prática" />
            <Stat n="3" label="Escritórios em Portugal" />
            <Stat n={`${new Date().getFullYear() - firm.founded}+`} label="Anos de experiência" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="font-display text-4xl md:text-5xl text-rp-gold">{n}</div>
      <div className="mt-2 text-xs uppercase tracking-widest2 text-rp-muted">{label}</div>
    </div>
  )
}

import { team } from '@/lib/content'

const portraits = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80',
]

export default function TeamPreview() {
  return (
    <section className="section bg-white">
      <div className="container-rp">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="gold-rule" />
            <span className="eyebrow">A Equipa</span>
            <span className="gold-rule" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-rp-ink leading-tight">
            Conheça quem<br />o vai acompanhar.
          </h2>
          <p className="mt-6 text-rp-body/85 leading-relaxed">
            Uma equipa multicultural com experiência internacional, dedicada a
            assegurar resultados precisos com transparência total.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-rp-line border border-rp-line">
          {team.map((m, i) => (
            <div key={m.name} className="bg-white p-6 group">
              <div
                className="aspect-[3/4] bg-cover bg-center mb-5 grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{ backgroundImage: `url('${portraits[i % portraits.length]}')` }}
              />
              <h3 className="font-display text-xl text-rp-ink leading-tight">{m.name}</h3>
              <p className="text-[11px] uppercase tracking-widest2 text-rp-gold mt-2">
                {m.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

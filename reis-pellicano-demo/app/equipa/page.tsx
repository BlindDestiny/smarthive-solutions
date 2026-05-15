import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import CTA from '@/components/cta'
import { team } from '@/lib/content'

const portraits = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80',
]

export const metadata = {
  title: 'Equipa — Reis & Pellicano',
  description: 'Conheça os sócios fundadores e advogados da Reis & Pellicano International Lawyers.',
}

export default function Equipa() {
  const founders = team.slice(0, 2)
  const lawyers = team.slice(2)

  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="A Equipa"
        title="Multicultural."
        italic="Internacional. Dedicada."
        description="Uma equipa portuguesa com experiência internacional, que combina rigor jurídico com proximidade humana em cada caso."
      />

      {/* Sócios fundadores */}
      <section className="section bg-white">
        <div className="container-rp">
          <div className="flex items-center gap-3 mb-12">
            <span className="gold-rule" />
            <span className="eyebrow">Sócios Fundadores</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {founders.map((m, i) => (
              <article key={m.name} className="group">
                <div
                  className="aspect-[4/5] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700"
                  style={{ backgroundImage: `url('${portraits[i]}')` }}
                />
                <h2 className="font-display text-3xl text-rp-ink mt-8 leading-tight">
                  {m.name}
                </h2>
                <p className="text-[11px] uppercase tracking-widest2 text-rp-gold mt-3">
                  {m.role}
                </p>
                {m.bio && (
                  <p className="text-rp-body/85 mt-5 leading-relaxed max-w-md">
                    {m.bio}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Advogadas */}
      <section className="section bg-rp-panel">
        <div className="container-rp">
          <div className="flex items-center gap-3 mb-12">
            <span className="gold-rule" />
            <span className="eyebrow">Equipa Jurídica</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rp-line border border-rp-line">
            {lawyers.map((m, i) => (
              <div key={m.name} className="bg-white p-8 group">
                <div
                  className="aspect-[3/4] bg-cover bg-center mb-6 grayscale group-hover:grayscale-0 transition-all duration-700"
                  style={{ backgroundImage: `url('${portraits[i + 2]}')` }}
                />
                <h3 className="font-display text-2xl text-rp-ink leading-tight">{m.name}</h3>
                <p className="text-[11px] uppercase tracking-widest2 text-rp-gold mt-2">
                  {m.role}
                </p>
                {m.bio && (
                  <p className="text-sm text-rp-body/85 mt-4 leading-relaxed">{m.bio}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  )
}

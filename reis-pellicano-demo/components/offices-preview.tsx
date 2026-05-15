import Link from 'next/link'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { offices } from '@/lib/content'

const cityImages = [
  'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80',
]

export default function OfficesPreview() {
  return (
    <section className="section bg-rp-ink text-white">
      <div className="container-rp">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow-dark">Presença Nacional</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
              Três escritórios.
              <span className="block italic text-rp-goldLight">Uma só sociedade.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="text-white/70 leading-relaxed">
              Atendemos presencialmente em Lisboa, Porto e Faro — e digitalmente em qualquer
              ponto do mundo. Cada cliente tem um interlocutor único, independentemente da
              cidade onde nos encontre.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offices.map((office, i) => (
            <div key={office.city} className="group">
              <div
                className="aspect-[4/3] bg-cover bg-center mb-6 overflow-hidden"
                style={{ backgroundImage: `url('${cityImages[i % cityImages.length]}')` }}
              >
                <div className="w-full h-full bg-rp-ink/30 group-hover:bg-rp-ink/0 transition-colors duration-700" />
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-rp-gold mt-1 shrink-0" />
                <div>
                  <h3 className="font-display text-2xl text-white">{office.city}</h3>
                  <p className="text-sm text-white/65 mt-2 leading-relaxed">
                    {office.street}<br />
                    {office.postal}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${office.mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-[11px] uppercase tracking-widest2 text-rp-gold hover:text-white transition-colors"
                  >
                    Ver no mapa <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/contactos" className="btn-light">Contactar</Link>
        </div>
      </div>
    </section>
  )
}

import { Clock, MapPin, Phone, ArrowUpRight, Utensils, Leaf, Truck, Sun } from 'lucide-react'
import { restaurant, hours } from '@/lib/content'

const serviceIcons: Record<string, any> = {
  utensils: Utensils,
  sun: Sun,
  leaf: Leaf,
  truck: Truck,
  box: Truck,
}

export default function HoursMap() {
  return (
    <section className="section bg-bita-forest text-bita-cream">
      <div className="container-bita grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3 mb-5">
            <span className="cream-rule" />
            <span className="eyebrow-cream">Visite-nos</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl italic text-bita-cream leading-tight">
            Onde nos
            <span className="block font-script not-italic text-bita-goldLight text-6xl md:text-7xl">encontra</span>
          </h2>

          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-bita-goldLight mt-1 shrink-0" />
              <div>
                <div className="eyebrow-cream mb-1">Morada</div>
                <div className="text-bita-cream/90 leading-relaxed">
                  {restaurant.addressShort}<br />
                  {restaurant.postal}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone size={20} className="text-bita-goldLight mt-1 shrink-0" />
              <div>
                <div className="eyebrow-cream mb-1">Reservas e take-away</div>
                <a href={`tel:${restaurant.phoneTel}`} className="text-bita-cream/90 hover:text-bita-gold transition-colors">
                  {restaurant.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={20} className="text-bita-goldLight mt-1 shrink-0" />
              <div className="w-full">
                <div className="eyebrow-cream mb-3">Horário</div>
                <ul className="space-y-1.5 text-sm max-w-xs">
                  {hours.map((h) => (
                    <li key={h.day} className="flex items-center justify-between gap-4">
                      <span className="text-bita-cream/70">{h.day}</span>
                      <span className={`tabular-nums ${h.closed ? 'text-bita-cream/40' : 'text-bita-cream'}`}>
                        {h.open}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mt-10 pt-8 border-t border-bita-cream/10">
            <div className="eyebrow-cream mb-4">Disponível</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Esplanada', icon: Sun },
                { label: 'Vegetariano', icon: Leaf },
                { label: 'Take-away', icon: Utensils },
                { label: 'Entregas', icon: Truck },
              ].map((s) => (
                <span key={s.label} className="inline-flex items-center gap-2 px-3 py-1.5 border border-bita-cream/15 text-xs text-bita-cream/85">
                  <s.icon size={12} className="text-bita-goldLight" />
                  {s.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="aspect-[4/3] lg:aspect-auto lg:h-full relative overflow-hidden">
            <iframe
              title="Mapa da A Bita"
              src={`https://maps.google.com/maps?q=${restaurant.mapsQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400, filter: 'grayscale(0.3) contrast(1.05)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${restaurant.mapsQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-[11px] uppercase tracking-widest2 text-bita-goldLight hover:text-bita-cream transition-colors"
          >
            Abrir no Google Maps <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </section>
  )
}

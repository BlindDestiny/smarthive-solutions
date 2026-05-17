import Link from 'next/link'
import { Instagram, Facebook, Mail, Phone, MapPin, Clock } from 'lucide-react'
import { restaurant, navigation, hours } from '@/lib/content'

export default function Footer() {
  return (
    <footer className="bg-bita-forest text-bita-cream/85">
      <div className="container-bita pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="font-display text-4xl italic text-bita-cream leading-tight">
              A Bita
            </div>
            <div className="font-script text-2xl text-bita-goldLight mt-2">
              um pequeno país das maravilhas
            </div>
            <p className="mt-6 text-sm leading-relaxed text-bita-cream/65 max-w-xs">
              Refeições caseiras, brunch e sobremesas com alma — em Vila Nova de
              Gaia, desde uma família para a sua mesa.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a href="https://instagram.com/abita" aria-label="Instagram" className="text-bita-cream/60 hover:text-bita-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com/abita" aria-label="Facebook" className="text-bita-cream/60 hover:text-bita-gold transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow-cream mb-5">Navegação</div>
            <ul className="space-y-3">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-bita-cream/75 hover:text-bita-gold transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow-cream mb-5">Visite-nos</div>
            <ul className="space-y-3 text-sm text-bita-cream/75">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-bita-goldLight mt-0.5 shrink-0" />
                <span>
                  {restaurant.addressShort}<br />
                  {restaurant.postal}
                </span>
              </li>
              <li>
                <a href={`tel:${restaurant.phoneTel}`} className="flex items-center gap-2 hover:text-bita-gold transition-colors">
                  <Phone size={14} className="text-bita-goldLight" />
                  {restaurant.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${restaurant.email}`} className="flex items-center gap-2 hover:text-bita-gold transition-colors">
                  <Mail size={14} className="text-bita-goldLight" />
                  {restaurant.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow-cream mb-5 flex items-center gap-2">
              <Clock size={12} /> Horário
            </div>
            <ul className="space-y-1.5 text-sm">
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

        <div className="mt-16 pt-8 border-t border-bita-cream/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-xs text-bita-cream/45">
            © {new Date().getFullYear()} A Bita · Vila Nova de Gaia. Feito com 💛 e ovos rotos.
          </div>
          <div className="flex items-center gap-6 text-xs text-bita-cream/45">
            <Link href="/politica-privacidade" className="hover:text-bita-gold transition-colors">Privacidade</Link>
            <Link href="/politica-cookies" className="hover:text-bita-gold transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

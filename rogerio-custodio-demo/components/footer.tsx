import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Facebook, Clock } from 'lucide-react'
import { company, navigation, services } from '@/lib/content'

export default function Footer() {
  return (
    <footer className="bg-rc-graphite text-white/85">
      <div className="container-rc pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <div className="font-display text-4xl text-white leading-tight">Rogério Custódio</div>
            <div className="eyebrow-light mt-3">Carpintaria · Desde 2006</div>
            <p className="mt-6 text-sm leading-relaxed text-white/65 max-w-xs">
              Carpintaria e marcenaria por medida. Cozinhas, roupeiros, mobiliário personalizado
              e projetos de interiores. Em Estoi, ao serviço do Algarve.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a href="https://instagram.com/rogeriocustodio.faro" aria-label="Instagram" className="text-white/60 hover:text-rc-goldLight transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com/rogeriocustodio.faro" aria-label="Facebook" className="text-white/60 hover:text-rc-goldLight transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-2">
            <div className="eyebrow-light mb-5">Navegação</div>
            <ul className="space-y-3">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-white/75 hover:text-rc-goldLight transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="md:col-span-3">
            <div className="eyebrow-light mb-5">Serviços</div>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/servicos#${s.slug}`} className="text-sm text-white/75 hover:text-rc-goldLight transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <div className="eyebrow-light mb-5">Contacto</div>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-rc-goldLight mt-0.5 shrink-0" />
                <span>{company.address}</span>
              </li>
              <li>
                <a href={`tel:${company.phoneTel}`} className="flex items-center gap-2 hover:text-rc-goldLight transition-colors">
                  <Phone size={14} className="text-rc-goldLight" />
                  {company.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.emails[1].address}`} className="flex items-center gap-2 hover:text-rc-goldLight transition-colors">
                  <Mail size={14} className="text-rc-goldLight" />
                  {company.emails[1].address}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-2 text-xs text-white/55">
                <Clock size={13} className="text-rc-goldLight mt-0.5 shrink-0" />
                <span>Seg–Sex · 08:30–13:00 · 14:00–16:30</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-xs text-white/45">
            © {new Date().getFullYear()} {company.legal} · NIPC 5XX XXX XXX · Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6 text-xs text-white/45">
            <Link href="/politica-privacidade" className="hover:text-rc-goldLight transition-colors">Privacidade</Link>
            <Link href="/politica-cookies" className="hover:text-rc-goldLight transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'
import { Instagram, Facebook, Linkedin, Mail, Phone } from 'lucide-react'
import { firm, navigation, offices } from '@/lib/content'

export default function Footer() {
  return (
    <footer className="bg-rp-ink text-white/80">
      <div className="container-rp pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="font-display text-3xl text-white leading-tight">
              Reis &amp; Pellicano
            </div>
            <div className="eyebrow-dark mt-3">International Lawyers</div>
            <p className="mt-6 text-sm leading-relaxed text-white/65 max-w-xs">
              Sociedade de advogados multicultural, com presença em Lisboa,
              Porto e Faro. Direito imobiliário, fiscal, empresarial e processos
              de nacionalidade.
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a href="https://instagram.com/reispellicano" aria-label="Instagram" className="text-white/60 hover:text-rp-gold transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com/reispellicano" aria-label="Facebook" className="text-white/60 hover:text-rp-gold transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://linkedin.com/company/reis-pellicano-international-lawyers" aria-label="LinkedIn" className="text-white/60 hover:text-rp-gold transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="eyebrow-dark mb-5">Navegação</div>
            <ul className="space-y-3">
              {navigation.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-white/75 hover:text-rp-gold transition-colors">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow-dark mb-5">Contacto</div>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`tel:${firm.phoneTel}`} className="flex items-center gap-2 text-white/75 hover:text-rp-gold transition-colors">
                  <Phone size={14} /> {firm.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${firm.email}`} className="flex items-center gap-2 text-white/75 hover:text-rp-gold transition-colors">
                  <Mail size={14} /> {firm.email}
                </a>
              </li>
              <li className="text-white/55 text-xs leading-relaxed pt-2 max-w-[14rem]">
                {firm.hours}
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="eyebrow-dark mb-5">Escritórios</div>
            <ul className="space-y-4 text-sm">
              {offices.map((o) => (
                <li key={o.city} className="text-white/70">
                  <div className="text-white font-medium tracking-wider">{o.city}</div>
                  <div className="text-xs text-white/55 mt-1 leading-relaxed">
                    {o.street}<br />{o.postal}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-xs text-white/45">
            © {new Date().getFullYear()} Reis &amp; Pellicano · International Lawyers. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-6 text-xs text-white/45">
            <Link href="/politica-privacidade" className="hover:text-rp-gold transition-colors">Política de Privacidade</Link>
            <Link href="/politica-cookies" className="hover:text-rp-gold transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

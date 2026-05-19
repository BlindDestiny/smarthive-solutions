'use client'
import { motion } from 'framer-motion'
import { Instagram, Phone, MapPin, Clock } from 'lucide-react'
import type { SiteContent } from '@/lib/content'

export default function Footer({ content = {} }: { content?: SiteContent }) {
  const tagline     = content['footer.tagline']      ?? 'Comida Brasileira Autêntica'
  const description = content['footer.description']  ?? 'Sabores autênticos do Brasil no coração do Porto. Uma família que serve família.'
  const instagram   = content['footer.instagram']    ?? '@portodosribeiros'
  const phone       = content['contact.phone']       ?? '963 349 411'
  const address     = content['contact.address']     ?? 'Rua da Constituição 982'
  const hoursWeek   = content['contact.hours_weekday'] ?? 'Dom–Qui: 07h–22h'
  const hoursWknd   = content['contact.hours_weekend'] ?? 'Sex–Sáb: 07h–00h'
  return (
    <footer className="bg-[#030803] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="font-serif text-2xl font-bold text-white">Porto dos Ribeiros</div>
              <div className="font-sans text-[11px] tracking-[0.35em] uppercase text-[#00a651] mt-1">{tagline}</div>
            </div>
            {/* Brazilian flag */}
            <div className="flex h-1 w-20 mb-5 overflow-hidden">
              <div className="flex-1 bg-[#009c3b]" />
              <div className="flex-1 bg-[#FFD700]" />
              <div className="flex-1 bg-[#002776]" />
            </div>
            <p className="font-sans text-white/30 text-sm leading-relaxed max-w-xs mb-6">
              {description}
            </p>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/30 hover:text-[#00a651] transition-colors duration-300 font-sans text-sm">
              <Instagram className="w-4 h-4" />
              {instagram}
            </a>
          </div>

          {/* Info */}
          <div>
            <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">Informações</div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#00a651] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-sans text-white/60 text-sm">R. da Constituição 982</div>
                  <div className="font-sans text-white/30 text-xs">4200-196 Porto</div>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#00a651] flex-shrink-0" />
                <a href="tel:963349411" className="font-sans text-white/60 text-sm hover:text-[#00a651] transition-colors">
                  963 349 411
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#00a651] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-sans text-white/60 text-sm">Dom–Qui: 07h–22h</div>
                  <div className="font-sans text-white/60 text-sm">Sex–Sáb: 07h–00h</div>
                  <div className="font-sans text-[#00a651] text-xs mt-1">⚠️ Não fechamos à tarde</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Menu links */}
          <div>
            <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">Menu</div>
            <ul className="space-y-3">
              {['Entradas', 'Pratos Principais', 'Feijoada', 'Sobremesas', 'Caipirinhas', 'Opções Vegetarianas'].map(l => (
                <li key={l}>
                  <a href="#menu" className="font-sans text-white/40 text-sm hover:text-[#00a651] transition-colors duration-300">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-white/20 text-xs">
            © 2026 Porto dos Ribeiros · Todos os direitos reservados
          </p>
          <p className="font-sans text-white/10 text-xs">
            Website por{' '}
            <span className="text-[#00a651]/50 hover:text-[#00a651] transition-colors cursor-pointer">
              SmartHive Solutions
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

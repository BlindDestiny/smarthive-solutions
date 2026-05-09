'use client'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Youtube } from 'lucide-react'

const LINKS = {
  'The Venue':    ['Sobre nós', 'A nossa história', 'A nossa equipa', 'Sustentabilidade'],
  'Experiências': ['Menu à la carte', 'Degustação', 'Eventos privados', 'Wine & Dine'],
  'Info':         ['Reservas', 'Horários & Morada', 'FAQ', 'Imprensa'],
}

export default function Footer() {
  return (
    <footer className="bg-[#030303] border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            >
              <div className="font-serif text-2xl tracking-[0.25em] text-white mb-4">✦ THE VENUE</div>
              <p className="font-sans text-white/25 text-sm leading-relaxed max-w-xs mb-6">
                Fine dining, cocktails artesanais e música ao vivo em Lisboa. Uma experiência para os sentidos.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Youtube].map((Icon, i) => (
                  <a key={i} href="#"
                    className="w-9 h-9 border border-white/10 hover:border-gold/50 flex items-center justify-center text-white/30 hover:text-gold transition-all duration-300">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">{title}</div>
              <ul className="space-y-3">
                {links.map(l => (
                  <li key={l}>
                    <a href="#" className="font-sans text-white/40 text-sm hover:text-gold transition-colors duration-300">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-white/20 text-xs">
            © 2026 The Venue Lisboa. Todos os direitos reservados.
          </p>
          <p className="font-sans text-white/10 text-xs">
            Website por{' '}
            <span className="text-gold/40 hover:text-gold transition-colors cursor-pointer">
              SmartHive Solutions
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

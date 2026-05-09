'use client'
import { motion } from 'framer-motion'
import { Sparkles, Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white"/>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Spark<span className="text-sky-400">Clean</span>
              </span>
            </a>
            <p className="font-sans text-white/35 text-sm leading-relaxed max-w-xs mb-6">
              Limpeza profissional para casas e escritórios em Lisboa. Equipas certificadas, resultados garantidos.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook].map((Icon,i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/30 hover:text-sky-400 hover:border-sky-500/30 transition-all duration-200">
                  <Icon className="w-4 h-4"/>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">Serviços</div>
            <ul className="space-y-3">
              {['Residencial','Escritórios','Limpeza Profunda','Mudanças','Janelas','Pós-Obra'].map(s => (
                <li key={s}><a href="#services" className="font-sans text-white/40 text-sm hover:text-sky-400 transition-colors">{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/25 mb-5">Contacto</div>
            <ul className="space-y-4">
              {[
                { Icon:Phone,  val:'912 345 678',      href:'tel:912345678' },
                { Icon:Mail,   val:'ola@sparkclean.pt',href:'mailto:ola@sparkclean.pt' },
                { Icon:MapPin, val:'Lisboa & Área Metro', href:'#' },
              ].map(c => (
                <li key={c.val}>
                  <a href={c.href} className="flex items-center gap-3 group">
                    <c.Icon className="w-3.5 h-3.5 text-sky-600/60 flex-shrink-0 group-hover:text-sky-400 transition-colors"/>
                    <span className="font-sans text-white/40 text-sm group-hover:text-white/70 transition-colors">{c.val}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-white/20 text-xs">© 2026 SparkClean. Todos os direitos reservados.</p>
          <p className="font-sans text-white/10 text-xs">
            Website por <span className="text-sky-600/40 hover:text-sky-400 transition-colors cursor-pointer">SmartHive Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

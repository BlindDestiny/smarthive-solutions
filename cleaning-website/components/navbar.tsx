'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Menu, X, Phone } from 'lucide-react'

const LINKS = [
  { label:'Serviços',   href:'#services' },
  { label:'Como Funciona', href:'#process' },
  { label:'Preços',     href:'#pricing' },
  { label:'Opiniões',   href:'#testimonials' },
  { label:'Contacto',   href:'#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y:-80, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#06090f]/80 backdrop-blur-2xl border-b border-sky-500/10 shadow-lg shadow-black/20' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            Spark<span className="gradient-text">Clean</span>
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="font-sans text-[13px] text-white/50 hover:text-white transition-colors duration-200">
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:912345678"
            className="flex items-center gap-2 font-sans text-[13px] text-white/50 hover:text-sky-400 transition-colors">
            <Phone className="w-3.5 h-3.5" /> 912 345 678
          </a>
          <a href="#contact"
            className="group relative overflow-hidden bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-sans text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/25 hover:scale-105">
            Orçamento Grátis
          </a>
        </div>

        <button onClick={() => setMobileOpen(v=>!v)} className="lg:hidden text-white/70 p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            className="lg:hidden bg-[#06090f]/95 backdrop-blur-2xl border-t border-sky-500/10 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-5">
              {LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block font-sans text-white/60 hover:text-sky-400 transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setMobileOpen(false)}
                className="block bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-sans font-semibold px-5 py-3 rounded-xl text-center mt-4">
                Orçamento Grátis
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

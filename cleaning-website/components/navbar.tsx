'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Menu, X, Phone } from 'lucide-react'

const LINKS = [
  { label:'Serviços',      href:'#services' },
  { label:'Como Funciona', href:'#process' },
  { label:'Preços',        href:'#pricing' },
  { label:'Opiniões',      href:'#testimonials' },
  { label:'Contacto',      href:'#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y:-70, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">

        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-600/25 group-hover:shadow-sky-600/40 transition-shadow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Spark<span className="text-sky-400">Clean</span>
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className={`font-sans text-[13px] transition-colors duration-200 ${
                scrolled ? 'text-slate-500 hover:text-sky-600' : 'text-white/60 hover:text-white'
              }`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:912345678"
            className={`flex items-center gap-2 font-sans text-[13px] transition-colors ${
              scrolled ? 'text-slate-500 hover:text-sky-600' : 'text-white/50 hover:text-white'
            }`}>
            <Phone className="w-3.5 h-3.5" /> 912 345 678
          </a>
          <a href="#contact"
            className="bg-sky-600 hover:bg-sky-700 text-white font-sans text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-sky-600/20">
            Orçamento Grátis
          </a>
        </div>

        <button onClick={() => setMobileOpen(v=>!v)}
          className={`lg:hidden p-1 ${scrolled ? 'text-slate-700' : 'text-white/70'}`}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.3 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-lg"
          >
            <div className="px-6 py-7 space-y-4">
              {LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block font-sans text-slate-600 hover:text-sky-600 transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="#contact" onClick={() => setMobileOpen(false)}
                className="block bg-sky-600 text-white font-sans font-semibold px-5 py-3 rounded-xl text-center mt-4 hover:bg-sky-700 transition-colors">
                Orçamento Grátis
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'

const LINKS = [
  { label: 'Menu',      href: '#menu' },
  { label: 'Sobre nós', href: '#about' },
  { label: 'Galeria',   href: '#gallery' },
  { label: 'Contacto',  href: '#contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0f08]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex flex-col leading-tight">
          <span className="font-serif text-lg font-bold text-white tracking-wide">Porto dos Ribeiros</span>
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#00a651]">Comida Brasileira</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-[#00a651] transition-colors duration-300">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Phone CTA */}
        <a href="tel:963349411"
          className="hidden md:flex items-center gap-2 bg-[#00a651] hover:bg-[#00c060] text-white font-sans text-[11px] tracking-[0.15em] uppercase px-5 py-3 transition-all duration-300">
          <Phone className="w-3.5 h-3.5" />
          963 349 411
        </a>

        <button onClick={() => setMobileOpen(v => !v)} className="md:hidden text-white p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="md:hidden bg-[#0a0f08]/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-5">
              {LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block font-sans text-sm tracking-[0.2em] uppercase text-white/60 hover:text-[#00a651] transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="tel:963349411" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 bg-[#00a651] text-white font-sans text-sm tracking-wide px-5 py-3 mt-4 justify-center">
                <Phone className="w-4 h-4" /> 963 349 411
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

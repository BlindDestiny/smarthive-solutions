'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Menu',     href: '#menu' },
  { label: 'Eventos',  href: '#events' },
  { label: 'Galeria',  href: '#gallery' },
  { label: 'Sobre',    href: '#about' },
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
      transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-black/85 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="font-serif text-lg tracking-[0.25em] text-white hover:text-gold transition-colors duration-300">
          ✦ THE VENUE
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="font-sans text-[11px] tracking-[0.25em] uppercase text-white/50 hover:text-gold transition-colors duration-300">
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#reservar"
          className="hidden md:block font-sans text-[11px] tracking-[0.25em] uppercase border border-gold/50 hover:border-gold text-gold px-6 py-3 transition-all duration-300 hover:bg-gold/10">
          Reservar
        </a>

        {/* Mobile toggle */}
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
            transition={{ duration: 0.4 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-5">
              {LINKS.map(l => (
                <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  className="block font-sans text-sm tracking-[0.25em] uppercase text-white/60 hover:text-gold transition-colors">
                  {l.label}
                </a>
              ))}
              <a href="#reservar" onClick={() => setMobileOpen(false)}
                className="block mt-6 border border-gold/50 text-gold font-sans text-sm tracking-[0.25em] uppercase px-5 py-3 text-center">
                Reservar
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

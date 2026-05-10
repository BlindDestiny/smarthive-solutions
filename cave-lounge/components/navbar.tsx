'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import CaveLogo from './logo'

const LINKS = [
  { label: 'About',   href: '#about'   },
  { label: 'Menu',    href: '#menu'    },
  { label: 'Events',  href: '#events'  },
  { label: 'Gallery', href: '#gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? 'glass border-b border-white/[0.05]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 h-20 flex items-center justify-between">

        <a href="#" className="flex items-center gap-3 group">
          <CaveLogo size={38} />
          <span className="font-display tracking-[0.25em] text-[#ff6a00] glow-text hidden sm:block"
            style={{ fontSize: '0.82rem' }}>
            CAVE LOUNGE
          </span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="font-display text-[10px] tracking-[0.22em] text-white/40 hover:text-[#e84800] transition-colors duration-300 uppercase">
              {l.label}
            </a>
          ))}
        </div>

        <a href="#reservation"
          className="hidden md:block font-display text-[10px] tracking-[0.2em] uppercase px-6 py-2.5 border border-[rgba(232,72,0,0.35)] text-[#e84800] hover:bg-[#e84800] hover:text-white transition-all duration-300">
          Reserve
        </a>

        <button className="md:hidden text-white/40 hover:text-white/70 transition-colors"
          onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/[0.05] px-8 pb-8 pt-4 space-y-5">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block font-display text-[10px] tracking-[0.22em] text-white/40 hover:text-[#e84800] transition-colors uppercase py-2">
                {l.label}
              </a>
            ))}
            <a href="#reservation" onClick={() => setOpen(false)}
              className="block text-center font-display text-[10px] tracking-[0.2em] uppercase px-6 py-3 border border-[rgba(232,72,0,0.35)] text-[#e84800] hover:bg-[#e84800] hover:text-white transition-all duration-300 mt-4">
              Reserve a Table
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

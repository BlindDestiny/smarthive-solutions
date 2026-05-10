'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'About',       href: '#about' },
  { label: 'Menu',        href: '#menu' },
  { label: 'Events',      href: '#events' },
  { label: 'Gallery',     href: '#gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#080808]/95 backdrop-blur-md border-b border-[rgba(232,72,0,0.1)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <Image src="/logo.jpeg" alt="Cave Lounge" width={44} height={44} className="rounded-sm" />
          <span className="font-display text-lg text-[#ff6a00] tracking-widest glow-text hidden sm:block">
            CAVE LOUNGE
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <a key={l.href} href={l.href}
              className="font-display text-xs tracking-[0.2em] text-cave-muted hover:text-[#ff6a00] transition-colors duration-200 uppercase">
              {l.label}
            </a>
          ))}
        </div>

        <a href="#reservation"
          className="hidden md:flex items-center gap-2 border border-[rgba(232,72,0,0.5)] text-[#ff6a00] font-display text-xs tracking-[0.15em] px-5 py-2.5 hover:bg-[#e84800] hover:text-white transition-all duration-300 uppercase">
          Reserve
        </a>

        <button className="md:hidden text-cave-muted" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#080808] border-t border-[rgba(232,72,0,0.1)] px-6 pb-6 pt-4 space-y-4">
            {LINKS.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="block font-display text-xs tracking-[0.2em] text-cave-muted hover:text-[#ff6a00] transition-colors uppercase py-2">
                {l.label}
              </a>
            ))}
            <a href="#reservation" onClick={() => setOpen(false)}
              className="block text-center border border-[rgba(232,72,0,0.5)] text-[#ff6a00] font-display text-xs tracking-[0.15em] px-5 py-3 hover:bg-[#e84800] hover:text-white transition-all duration-300 uppercase mt-4">
              Reserve a Table
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

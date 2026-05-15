'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { navigation, firm } from '@/lib/content'
import { useBooking } from './booking-provider'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { openBooking } = useBooking()
  const onDark = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || pathname !== '/'
          ? 'bg-white/95 backdrop-blur-sm border-b border-rp-line'
          : 'bg-transparent'
      }`}
    >
      <div className="container-rp flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${
            onDark ? 'border-white/40 group-hover:border-rp-gold' : 'border-rp-ink/30 group-hover:border-rp-gold'
          }`}>
            <span className={`font-display text-xl ${onDark ? 'text-white' : 'text-rp-ink'}`}>R</span>
          </div>
          <div className="hidden sm:block">
            <div className={`font-display text-lg leading-none ${onDark ? 'text-white' : 'text-rp-ink'}`}>
              Reis &amp; Pellicano
            </div>
            <div className={`text-[10px] uppercase tracking-widest2 mt-1 ${onDark ? 'text-white/60' : 'text-rp-muted'}`}>
              International Lawyers
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {navigation.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] uppercase tracking-widest2 transition-colors ${
                  onDark
                    ? active ? 'text-rp-gold' : 'text-white/85 hover:text-rp-gold'
                    : active ? 'text-rp-gold' : 'text-rp-ink hover:text-rp-gold'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className={`hidden md:flex items-center text-[11px] uppercase tracking-widest2 ${
            onDark ? 'text-white/70' : 'text-rp-muted'
          }`}>
            <span className="opacity-60 mr-2">PT</span>
            <span className="opacity-30 mx-1">/</span>
            <span className="opacity-60 ml-2">EN</span>
          </div>

          <a
            href={`tel:${firm.phoneTel}`}
            className={`hidden md:inline text-[13px] tracking-wider transition-colors ${
              onDark ? 'text-white hover:text-rp-gold' : 'text-rp-ink hover:text-rp-gold'
            }`}
          >
            {firm.phoneDisplay}
          </a>

          <button
            onClick={openBooking}
            className={`hidden lg:inline-flex items-center px-4 py-2.5 text-[11px] uppercase tracking-widest2 transition-colors ${
              onDark
                ? 'bg-rp-gold text-white hover:bg-white hover:text-rp-ink'
                : 'bg-rp-ink text-white hover:bg-rp-gold'
            }`}
          >
            Agendar
          </button>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden ${onDark ? 'text-white' : 'text-rp-ink'}`}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-rp-line">
          <div className="container-rp py-6 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[14px] uppercase tracking-widest2 text-rp-ink py-2 border-b border-rp-line/60"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); openBooking() }}
              className="mt-4 btn-primary self-start"
            >
              Agendar Consulta
            </button>
            <a
              href={`tel:${firm.phoneTel}`}
              className="text-rp-muted text-sm tracking-wider self-start"
            >
              {firm.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

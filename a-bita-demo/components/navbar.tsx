'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { navigation, restaurant } from '@/lib/content'
import { useReservation } from './reservation-provider'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { openReservation } = useReservation()
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
          ? 'bg-bita-bg/95 backdrop-blur-sm border-b border-bita-line'
          : 'bg-transparent'
      }`}
    >
      <div className="container-bita flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`relative w-11 h-11 rounded-full border-2 flex items-center justify-center transition-colors ${
            onDark ? 'border-bita-cream/40 group-hover:border-bita-gold' : 'border-bita-ink/30 group-hover:border-bita-gold'
          }`}>
            <span className={`font-script text-2xl leading-none mt-1 ${onDark ? 'text-bita-cream' : 'text-bita-ink'}`}>
              ab
            </span>
          </div>
          <div className="hidden sm:block">
            <div className={`font-display text-xl italic leading-none ${onDark ? 'text-bita-cream' : 'text-bita-ink'}`}>
              A Bita
            </div>
            <div className={`text-[10px] uppercase tracking-widest2 mt-1 ${onDark ? 'text-bita-cream/65' : 'text-bita-muted'}`}>
              Vila Nova de Gaia · est. 2018
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
                    ? active ? 'text-bita-gold' : 'text-bita-cream/90 hover:text-bita-gold'
                    : active ? 'text-bita-gold' : 'text-bita-ink hover:text-bita-gold'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${restaurant.phoneTel}`}
            className={`hidden md:inline text-[13px] tracking-wider transition-colors ${
              onDark ? 'text-bita-cream hover:text-bita-gold' : 'text-bita-ink hover:text-bita-gold'
            }`}
          >
            {restaurant.phoneDisplay}
          </a>

          <button
            onClick={openReservation}
            className={`hidden lg:inline-flex items-center px-4 py-2.5 text-[11px] uppercase tracking-widest2 font-medium transition-colors ${
              onDark
                ? 'bg-bita-gold text-white hover:bg-bita-cream hover:text-bita-ink'
                : 'bg-bita-forest text-bita-cream hover:bg-bita-gold'
            }`}
          >
            Reservar Mesa
          </button>

          <button
            onClick={() => setOpen(!open)}
            className={`lg:hidden ${onDark ? 'text-bita-cream' : 'text-bita-ink'}`}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-bita-bg border-t border-bita-line">
          <div className="container-bita py-6 flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[14px] uppercase tracking-widest2 text-bita-ink py-2 border-b border-bita-line/60"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { setOpen(false); openReservation() }}
              className="mt-4 btn-primary self-start"
            >
              Reservar Mesa
            </button>
            <a
              href={`tel:${restaurant.phoneTel}`}
              className="text-bita-muted text-sm tracking-wider self-start"
            >
              {restaurant.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

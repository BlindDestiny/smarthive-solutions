'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import { navigation, company } from '@/lib/content'
import { useQuote } from './quote-provider'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { openQuote } = useQuote()
  const onDark = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || pathname !== '/'
          ? 'bg-rc-surface/95 backdrop-blur-md border-b border-rc-line'
          : 'bg-transparent'
      }`}
    >
      <div className="container-rc flex items-center justify-between h-24">
        <Link href="/" className="flex items-center gap-3 group">
          <div className={`w-11 h-11 border flex items-center justify-center transition-all duration-500 ${
            onDark ? 'border-white/40 group-hover:border-rc-goldLight' : 'border-rc-ink/30 group-hover:border-rc-gold'
          }`}>
            <span className={`font-display text-xl italic ${onDark ? 'text-white' : 'text-rc-ink'}`}>RC</span>
          </div>
          <div className="hidden sm:block">
            <div className={`font-display text-lg leading-none ${onDark ? 'text-white' : 'text-rc-ink'}`}>
              Rogério Custódio
            </div>
            <div className={`text-[10px] uppercase tracking-widest3 mt-1.5 ${onDark ? 'text-white/65' : 'text-rc-muted'}`}>
              Carpintaria · Desde 2006
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
                className={`relative text-[11px] uppercase tracking-widest3 transition-colors ${
                  onDark
                    ? active ? 'text-rc-goldLight' : 'text-white/85 hover:text-rc-goldLight'
                    : active ? 'text-rc-gold' : 'text-rc-ink hover:text-rc-gold'
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className={`absolute -bottom-2 left-0 right-0 h-px ${onDark ? 'bg-rc-goldLight' : 'bg-rc-gold'}`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a href={`tel:${company.phoneTel}`}
            className={`hidden md:inline-flex items-center gap-2 text-[12px] tracking-wider transition-colors ${
              onDark ? 'text-white hover:text-rc-goldLight' : 'text-rc-ink hover:text-rc-gold'
            }`}>
            <Phone size={13} />
            {company.phoneDisplay}
          </a>

          <button onClick={openQuote}
            className={`hidden lg:inline-flex items-center px-5 py-2.5 text-[11px] uppercase tracking-widest2 font-medium transition-all duration-500 ${
              onDark
                ? 'bg-white text-rc-ink hover:bg-rc-gold hover:text-white'
                : 'bg-rc-ink text-white hover:bg-rc-gold'
            }`}>
            Pedir Orçamento
          </button>

          <button onClick={() => setOpen(!open)}
            className={`lg:hidden ${onDark ? 'text-white' : 'text-rc-ink'}`} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="lg:hidden bg-rc-surface border-t border-rc-line overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
              className="container-rc py-8 flex flex-col gap-5"
            >
              {navigation.map((item) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-[13px] uppercase tracking-widest2 text-rc-ink py-2 border-b border-rc-line/60"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                }}
                onClick={() => { setOpen(false); openQuote() }}
                className="mt-4 btn-primary self-start"
              >
                Pedir Orçamento
              </motion.button>
              <motion.a
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: EASE } },
                }}
                href={`tel:${company.phoneTel}`}
                className="text-rc-muted text-sm tracking-wider self-start"
              >
                {company.phoneDisplay}
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

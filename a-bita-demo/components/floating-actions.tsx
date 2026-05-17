'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { restaurant } from '@/lib/content'

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight - 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const waHref = `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(restaurant.whatsappMessage)}`
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="fixed z-40 right-5 md:right-6 bottom-5 md:bottom-6 flex flex-col items-end gap-3 pointer-events-none">
      {/* WhatsApp — sempre em cima */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar connosco no WhatsApp"
        className="pointer-events-auto group relative flex items-center justify-center bg-[#25D366] hover:bg-[#1da955] shadow-xl shadow-[#25D366]/30 transition-all duration-300"
        style={{ width: 60, height: 60, borderRadius: 9999 }}
      >
        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/40" aria-hidden="true" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="relative w-7 h-7 text-white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.149-.669.15-.198.297-.768.967-.941 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488" />
        </svg>
        <span className="absolute right-full mr-4 px-4 py-2 bg-bita-ink text-bita-cream text-xs uppercase tracking-widest2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Reservar via WhatsApp
        </span>
      </a>

      {/* Scroll to top */}
      <button
        onClick={scrollTop}
        aria-label="Voltar ao topo"
        className={`pointer-events-auto bg-bita-ink text-bita-cream flex items-center justify-center shadow-lg shadow-black/15 hover:bg-bita-gold transition-all duration-300 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ width: 52, height: 52 }}
      >
        <ArrowUp size={20} strokeWidth={1.5} />
      </button>
    </div>
  )
}

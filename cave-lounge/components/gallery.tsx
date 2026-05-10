'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'

const PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=85&auto=format&fit=crop', alt: 'Signature cocktail',   span: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1551024709-8f23befc548b?w=700&q=85&auto=format&fit=crop', alt: 'Cave bar',              span: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=85&auto=format&fit=crop', alt: 'Dark lounge interior', span: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=700&q=85&auto=format&fit=crop', alt: 'Evening crowd',        span: 'col-span-1 row-span-2' },
  { url: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=700&q=85&auto=format&fit=crop', alt: 'Premium spirits',      span: 'col-span-1' },
  { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85&auto=format&fit=crop', alt: 'Candlelight ambiance',  span: 'col-span-1' },
]

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      const ctx = gsap.context(() => {
        gsap.from('.gallery-header', {
          scrollTrigger: { trigger: '.gallery-header', start: 'top 85%' },
          opacity: 0, y: 30, duration: 0.8,
        })
        gsap.from('.gallery-photo', {
          scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' },
          opacity: 0, scale: 0.92, y: 30,
          duration: 0.7, stagger: 0.1, ease: 'power3.out',
        })
      }, sectionRef)
      return () => ctx.revert()
    }
    init()
  }, [])

  return (
    <section ref={sectionRef} id="gallery" className="py-28 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="gallery-header text-center mb-16">
          <span className="font-display text-[10px] tracking-[0.4em] text-[#e84800] uppercase block mb-4">
            The Experience
          </span>
          <h2 className="font-display font-bold text-[#f5ede8]" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Life in the Cave
          </h2>
          <div className="mt-4 mx-auto w-16 h-px bg-[#e84800]" />
        </div>

        <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 grid-rows-3 gap-3 h-[600px] md:h-[700px]">
          {PHOTOS.map((p, i) => (
            <div key={i} className={`gallery-photo relative overflow-hidden group ${p.span}`} style={{ borderRadius: 2 }}>
              <Image src={p.url} alt={p.alt} fill
                className="object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out" />
              <div className="absolute inset-0 bg-[#080808]/15 group-hover:bg-[rgba(232,72,0,0.06)] transition-colors duration-500" />
              {/* corner tag */}
              <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="font-display text-[9px] tracking-[0.3em] uppercase text-white/70 bg-[#080808]/60 px-2 py-1 backdrop-blur-sm">
                  {p.alt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

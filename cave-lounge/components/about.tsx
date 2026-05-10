'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Flame, Music, Sparkles } from 'lucide-react'

const PILLARS = [
  { Icon: Flame,    title: 'Craft Cocktails',  desc: 'Every drink is a ritual. Premium spirits and house-made infusions, crafted with obsessive care.' },
  { Icon: Music,    title: 'Live Sounds',       desc: 'From jazz on Thursdays to underground electronic on weekends — the music never stops.' },
  { Icon: Sparkles, title: 'The Atmosphere',    desc: 'Stone walls, candlelight and the warmth of fire. A world apart from the city above.' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!sectionRef.current) return

      const ctx = gsap.context(() => {
        gsap.from('.about-img', {
          scrollTrigger: { trigger: '.about-img', start: 'top 80%' },
          x: -80, opacity: 0, duration: 1.2, ease: 'power3.out',
        })
        gsap.from('.about-stat', {
          scrollTrigger: { trigger: '.about-img', start: 'top 75%' },
          scale: 0.7, opacity: 0, duration: 0.8, delay: 0.4, ease: 'back.out(1.8)',
        })
        gsap.from('.about-tag', {
          scrollTrigger: { trigger: '.about-text', start: 'top 80%' },
          opacity: 0, y: 15, duration: 0.5,
        })
        gsap.from('.about-h2', {
          scrollTrigger: { trigger: '.about-text', start: 'top 78%' },
          opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', delay: 0.1,
        })
        gsap.from('.about-p', {
          scrollTrigger: { trigger: '.about-text', start: 'top 75%' },
          opacity: 0, y: 25, duration: 0.7, stagger: 0.15, delay: 0.2,
        })
        gsap.from('.about-pillar', {
          scrollTrigger: { trigger: '.about-pillars', start: 'top 82%' },
          opacity: 0, x: -30, duration: 0.6, stagger: 0.15, ease: 'power2.out',
        })
      }, sectionRef)
      return () => ctx.revert()
    }
    init()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-28 bg-[#0d0605] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px divider-fire" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-28 bg-[#e84800]/5 blur-[60px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <div className="relative about-img">
            <div className="relative aspect-[4/5] overflow-hidden glow-border" style={{ borderRadius: 2 }}>
              <Image
                src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=85&auto=format&fit=crop"
                alt="Cave Lounge atmosphere" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent" />
            </div>
            <div className="about-stat absolute -bottom-6 -right-6 card-cave p-6 glow-border" style={{ borderRadius: 2 }}>
              <div className="font-display font-bold text-[#e84800] text-4xl glow-text">2018</div>
              <div className="font-sans text-[#7a6055] text-xs tracking-widest uppercase mt-1">Est. Underground</div>
            </div>
          </div>

          <div className="about-text">
            <span className="about-tag font-display text-[10px] tracking-[0.4em] text-[#e84800] uppercase block mb-4">Our Story</span>
            <h2 className="about-h2 font-display font-bold text-[#f5ede8] mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Born from the<br/><span className="text-[#e84800]">depths below</span>
            </h2>
            <p className="about-p font-sans text-[#7a6055] leading-relaxed mb-5">
              Tucked beneath the city streets, Cave Lounge was born from a passion for
              exceptional drinks and the kind of atmosphere that makes time disappear.
              Raw stone walls, flickering fire and a curated soundtrack — the stage for evenings you won't forget.
            </p>
            <p className="about-p font-sans text-[#7a6055] leading-relaxed mb-10">
              Our team of mixologists draws on global traditions to create cocktails as beautiful as they are complex.
              Every detail — from the glassware to the garnish — chosen with obsessive care.
            </p>

            <div className="about-pillars space-y-5">
              {PILLARS.map(({ Icon, title, desc }) => (
                <div key={title} className="about-pillar flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[rgba(232,72,0,0.3)] text-[#e84800] mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display text-[#f5ede8] text-sm tracking-wide mb-1">{title}</div>
                    <div className="font-sans text-[#7a6055] text-sm leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px divider-fire" />
    </section>
  )
}

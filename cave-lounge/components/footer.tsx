'use client'
import { Instagram, Facebook, Twitter } from 'lucide-react'
import Image from 'next/image'
import type { SiteContent } from '@/lib/content'

export default function Footer({ content = {} }: { content?: SiteContent }) {
  const desc    = content['footer.description'] ?? 'Underground bar & lounge. Where the night has no ceiling and every drink tells a story. Bairro Alto, Lisboa.'
  const thuHrs  = content['footer.hours_thu']   ?? '9pm–2am'
  const friHrs  = content['footer.hours_fri']   ?? '10pm–4am'
  const satHrs  = content['footer.hours_sat']   ?? '10pm–5am'
  const sunHrs  = content['footer.hours_sun']   ?? '7pm–11pm'
  return (
    <footer className="bg-[#030303] border-t border-white/[0.04]">
      <div className="max-w-6xl mx-auto px-8 lg:px-16 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-16">

          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-7">
              <Image src="/logo.png" alt="Cave Lounge" width={40} height={40}
                style={{ objectFit: 'contain', mixBlendMode: 'screen' }} />
              <span className="font-display tracking-[0.25em] text-[#ff6a00] glow-text"
                style={{ fontSize: '0.8rem' }}>
                CAVE LOUNGE
              </span>
            </a>
            <p className="font-sans font-light text-white/40 text-sm leading-relaxed max-w-xs mb-8 tracking-wide">
              {desc}
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 flex items-center justify-center glass text-white/25 hover:text-[#e84800] hover:border-[rgba(232,72,0,0.3)] transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-display text-[9px] tracking-[0.35em] uppercase text-white/25 mb-6">Navigate</div>
            <ul className="space-y-3.5">
              {['About','Menu','Events','Gallery','Reserve'].map(s => (
                <li key={s}>
                  <a href={`#${s.toLowerCase()}`}
                    className="font-sans font-light text-white/40 text-sm hover:text-[#e84800] transition-colors tracking-wide">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-display text-[9px] tracking-[0.35em] uppercase text-white/25 mb-6">Hours</div>
            <ul className="space-y-2.5 font-sans font-light text-sm text-white/40 tracking-wide">
              <li className="flex justify-between"><span>Thursday</span><span>{thuHrs}</span></li>
              <li className="flex justify-between"><span>Friday</span><span>{friHrs}</span></li>
              <li className="flex justify-between text-[#e84800]/60"><span>Saturday</span><span>{satHrs}</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>{sunHrs}</span></li>
              <li className="flex justify-between text-white/15 text-xs mt-3"><span>Mon–Wed</span><span>Closed</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans font-light text-white/20 text-xs tracking-wide">
            © 2026 Cave Lounge. All rights reserved.
          </p>
          <p className="font-sans font-light text-white/12 text-xs tracking-wide">
            Website by{' '}
            <span className="text-[#e84800]/35 hover:text-[#e84800]/60 transition-colors cursor-pointer">
              SmartHive Solutions
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'
import Image from 'next/image'
import { Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-cave-warm border-t border-[rgba(232,72,0,0.1)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-5">
              <Image src="/logo.jpeg" alt="Cave Lounge" width={40} height={40} className="rounded-sm" />
              <span className="font-display text-lg text-[#ff6a00] tracking-widest glow-text">CAVE LOUNGE</span>
            </a>
            <p className="font-sans text-cave-muted text-sm leading-relaxed max-w-xs mb-6">
              Underground bar & lounge. Where the night has no ceiling and every drink tells a story.
              Bairro Alto, Lisboa.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 flex items-center justify-center border border-[rgba(232,72,0,0.2)] text-cave-muted hover:text-[#e84800] hover:border-[rgba(232,72,0,0.5)] transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cave-muted/40 mb-5">Navigation</div>
            <ul className="space-y-3">
              {['About', 'Menu', 'Events', 'Gallery', 'Reserve'].map(s => (
                <li key={s}>
                  <a href={`#${s.toLowerCase()}`}
                    className="font-sans text-cave-muted text-sm hover:text-[#e84800] transition-colors">{s}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-display text-[10px] tracking-[0.3em] uppercase text-cave-muted/40 mb-5">Opening Hours</div>
            <ul className="space-y-2 font-sans text-sm text-cave-muted">
              <li className="flex justify-between"><span>Thursday</span><span>9pm – 2am</span></li>
              <li className="flex justify-between"><span>Friday</span><span>10pm – 4am</span></li>
              <li className="flex justify-between text-[#e84800]"><span>Saturday</span><span>10pm – 5am</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>7pm – 11pm</span></li>
              <li className="flex justify-between text-cave-muted/40 text-xs mt-2"><span>Mon–Wed</span><span>Closed</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[rgba(232,72,0,0.08)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-cave-muted/30 text-xs">© 2026 Cave Lounge. All rights reserved.</p>
          <p className="font-sans text-cave-muted/20 text-xs">
            Website by{' '}
            <span className="text-[#e84800]/40 hover:text-[#e84800] transition-colors cursor-pointer">SmartHive Solutions</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

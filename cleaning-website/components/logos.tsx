'use client'
import { motion } from 'framer-motion'

const LOGOS = ['Unilever','Ecolab','Diversey','P&G Professional','Kärcher','Vileda Pro','Scotch-Brite','Cliniflex']

export default function Logos() {
  return (
    <section className="py-12 border-y border-white/[0.05] bg-[#080c14] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="font-sans text-white/20 text-xs text-center tracking-[0.3em] uppercase">
          Produtos certificados das melhores marcas
        </p>
      </div>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...LOGOS,...LOGOS].map((l,i) => (
            <div key={i} className="flex-shrink-0 mx-10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-500/40"/>
              <span className="font-display font-bold text-white/20 text-sm tracking-wide">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

const LOGOS = ['Ecolab','Unilever','Diversey','P&G Pro','Kärcher','Vileda Pro','Scotch-Brite','Cliniflex']

export default function Logos() {
  return (
    <section className="py-10 border-y border-slate-100 bg-slate-50 overflow-hidden">
      <p className="font-sans text-slate-400 text-[11px] text-center tracking-[0.3em] uppercase mb-6">
        Produtos certificados das melhores marcas
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...LOGOS,...LOGOS].map((l,i) => (
            <div key={i} className="flex-shrink-0 mx-10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-sky-300"/>
              <span className="font-display font-bold text-slate-300 text-sm tracking-wide">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

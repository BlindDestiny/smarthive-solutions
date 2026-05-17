import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { restaurant } from '@/lib/content'

export default function Story() {
  return (
    <section className="section bg-bita-bg">
      <div className="container-bita grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div className="relative">
            {/* Main photo */}
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80')" }}
            />
            {/* Overlapping smaller photo */}
            <div
              className="hidden md:block absolute -bottom-12 -right-12 w-52 h-72 bg-cover bg-center border-8 border-bita-bg shadow-xl"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80')" }}
            />
            {/* Decorative script note */}
            <div className="hidden md:block absolute -top-6 -left-6 max-w-[200px] bg-bita-cream px-5 py-4 shadow-lg rotate-[-3deg]">
              <p className="font-script text-xl text-bita-forest leading-tight">
                "feito com amor, servido com calma"
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8 order-1 lg:order-2">
          <div className="flex items-center gap-3 mb-6">
            <span className="gold-rule" />
            <span className="eyebrow">A nossa história</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-bita-ink leading-tight italic">
            Um pequeno
            <span className="block font-script not-italic text-6xl md:text-7xl text-bita-gold mt-2">país das maravilhas</span>
            no coração de Gaia.
          </h2>

          <p className="mt-8 text-lg text-bita-body leading-relaxed font-light">
            {restaurant.story}
          </p>

          <p className="mt-6 text-base text-bita-body/85 leading-relaxed">
            Os nossos clássicos — os <em>ovos rotos</em>, o <em>bolo de cenoura com ganache</em>,
            os bolos para levar para casa — nasceram em cozinha de avó e ganharam vida
            nesta esplanada. Tudo o que servimos sai daqui.
          </p>

          <Link
            href="/sobre"
            className="inline-flex items-center gap-2 mt-10 text-[12px] uppercase tracking-widest2 text-bita-gold hover:text-bita-forest transition-colors"
          >
            Conheça a nossa história <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}

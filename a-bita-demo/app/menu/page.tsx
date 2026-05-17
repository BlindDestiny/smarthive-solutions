import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import CTA from '@/components/cta'
import { Leaf, Star } from 'lucide-react'
import { menu } from '@/lib/content'

export const metadata = {
  title: 'Menu — A Bita · Vila Nova de Gaia',
  description: 'Brunch, refeições caseiras, bolos e sobremesas. Veja o menu completo da A Bita em Vila Nova de Gaia.',
}

export default function Menu() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="A Carta"
        title="O nosso"
        script="menu"
        description="Cozinhamos diariamente, com ingredientes frescos e receitas que passam de geração em geração. Os preços incluem IVA. Avise-nos sobre alergias ou restrições antes de fazer o pedido."
      />

      {/* Category navigation */}
      <section className="sticky top-20 z-30 bg-bita-bg/95 backdrop-blur-sm border-b border-bita-line">
        <div className="container-bita py-4">
          <nav className="flex items-center gap-1 overflow-x-auto -mx-2 px-2">
            {menu.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="shrink-0 px-4 py-2 text-[12px] uppercase tracking-widest2 text-bita-muted hover:text-bita-gold hover:bg-bita-cream transition-colors"
              >
                {cat.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Menu sections */}
      <section className="bg-bita-bg">
        <div className="container-bita py-20 space-y-24">
          {menu.map((cat) => (
            <div key={cat.slug} id={cat.slug} className="scroll-mt-40">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <span className="gold-rule" />
                  <span className="eyebrow">{cat.subtitle}</span>
                  <span className="gold-rule" />
                </div>
                <h2 className="font-display text-4xl md:text-5xl italic text-bita-ink leading-tight">
                  {cat.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-5xl mx-auto">
                {cat.items.map((item) => (
                  <article key={item.name} className="border-b border-bita-line pb-6 group">
                    <div className="flex items-baseline justify-between gap-4 mb-2">
                      <h3 className="font-display text-xl text-bita-ink leading-tight flex items-center gap-2 flex-wrap">
                        {item.name}
                        {item.veg && (
                          <span className="inline-flex items-center" title="Opção vegetariana">
                            <Leaf size={13} className="text-bita-forest" />
                          </span>
                        )}
                        {item.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest2 text-bita-gold px-2 py-0.5 border border-bita-gold/30">
                            <Star size={9} className="fill-bita-gold" /> destaque
                          </span>
                        )}
                      </h3>
                      <div className="flex-1 border-b border-dotted border-bita-muted/30 mb-1 mx-2" />
                      <span className="font-display italic text-xl text-bita-gold tabular-nums">{item.price}€</span>
                    </div>
                    <p className="text-sm text-bita-body leading-relaxed">{item.description}</p>
                    {item.highlight && (
                      <p className="font-script text-lg text-bita-gold mt-2">{item.highlight}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="max-w-3xl mx-auto pt-8 border-t border-bita-line text-center text-xs text-bita-muted">
            <p className="flex items-center justify-center gap-6 flex-wrap">
              <span className="inline-flex items-center gap-2">
                <Leaf size={12} className="text-bita-forest" /> Opção vegetariana
              </span>
              <span className="inline-flex items-center gap-2">
                <Star size={10} className="fill-bita-gold text-bita-gold" /> Destaque da casa
              </span>
              <span>Os nossos pratos podem conter glúten, lactose, frutos secos ou ovo. Pergunte ao serviço.</span>
            </p>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  )
}

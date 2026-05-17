import Link from 'next/link'
import { ArrowUpRight, Leaf, Star } from 'lucide-react'
import { menu } from '@/lib/content'

const featuredImages: Record<string, string> = {
  'Ovos Rotos d’a Bita':           'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80',
  'Carrot Cake com Ganache':       'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80',
  'Avocado Toast':                 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80',
  'Granola d’a Bita':              'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80',
  'Eggs Benedict':                 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=900&q=80',
  'Panquecas Americanas':          'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80',
}

export default function MenuPreview() {
  const featured = menu
    .flatMap((cat) => cat.items.map((item) => ({ ...item, category: cat.title })))
    .filter((i) => i.featured)
    .slice(0, 6)

  // Fallback to filling 6 with brunch items if not enough featured
  const brunchItems = menu.find((c) => c.slug === 'brunch')?.items || []
  while (featured.length < 6 && brunchItems.length > 0) {
    const next = brunchItems.find((i) => !featured.some((f) => f.name === i.name))
    if (!next) break
    featured.push({ ...next, category: 'Brunch' })
  }

  return (
    <section className="section bg-bita-surface">
      <div className="container-bita">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">A nossa cozinha</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-bita-ink leading-tight italic">
              Pratos do
              <span className="font-script not-italic text-bita-gold ml-3">país das maravilhas</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="text-[13px] uppercase tracking-widest2 text-bita-ink hover:text-bita-gold inline-flex items-center gap-2 transition-colors self-start md:self-end"
          >
            Ver menu completo <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-bita-line border border-bita-line">
          {featured.map((item) => (
            <article key={item.name} className="bg-bita-surface group overflow-hidden">
              <div
                className="aspect-[4/3] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url('${featuredImages[item.name] || 'https://images.unsplash.com/photo-1559054663-e8d23213f55c?auto=format&fit=crop&w=900&q=80'}')`,
                }}
              />
              <div className="p-7">
                <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-widest2 text-bita-muted">
                  <span>{item.category}</span>
                  {item.veg && <Leaf size={12} className="text-bita-forest" />}
                  {item.highlight && (
                    <>
                      <span className="text-bita-line">·</span>
                      <span className="text-bita-gold flex items-center gap-1">
                        <Star size={10} className="fill-bita-gold" />
                        {item.highlight}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="font-display text-2xl text-bita-ink leading-tight">{item.name}</h3>
                <p className="mt-3 text-sm text-bita-body leading-relaxed">{item.description}</p>

                <div className="mt-5 flex items-baseline justify-between border-t border-bita-line pt-4">
                  <span className="font-display italic text-2xl text-bita-gold">{item.price}€</span>
                  <span className="text-[10px] uppercase tracking-widest2 text-bita-muted">por pessoa</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

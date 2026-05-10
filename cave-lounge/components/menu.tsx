'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const CATEGORIES = ['Signature', 'Spirits', 'Wines', 'Zero Proof'] as const
type Cat = typeof CATEGORIES[number]

const ITEMS: Record<Cat, { name: string; desc: string; price: string; badge?: string }[]> = {
  'Signature': [
    { name: 'Cave Fire',       desc: 'Mezcal · habanero · smoked orange · dark chocolate bitters',       price: '€14', badge: 'House' },
    { name: 'Ember & Ash',     desc: 'Bourbon · activated charcoal · honey · lemon · rosemary smoke',    price: '€15' },
    { name: 'Underworld',      desc: 'Gin · blackcurrant · lavender · elderflower · edible gold',        price: '€13' },
    { name: 'The Stalactite',  desc: 'Vodka · blue curaçao · coconut · lime · crushed ice',              price: '€12' },
    { name: 'Crimson Tide',    desc: 'Rum · passion fruit · grenadine · lime · ginger beer',             price: '€13', badge: 'Top' },
    { name: 'Midnight Ritual', desc: 'Tequila · espresso · kahlúa · vanilla · salted chocolate rim',    price: '€14' },
  ],
  'Spirits': [
    { name: 'Macallan 12',        desc: 'Single malt Scotch — sherry oak · honey · dried fruit',         price: '€16' },
    { name: 'Blantons Original',  desc: 'Single barrel bourbon — caramel · vanilla · spice',             price: '€18', badge: 'Staff' },
    { name: 'Casamigos Reposado', desc: 'Small batch tequila — caramel · vanilla · light cocoa',         price: '€15' },
    { name: 'Hendrick\'s',        desc: 'Scottish gin — cucumber · rose · 11 botanicals',                price: '€12' },
    { name: 'Grey Goose',         desc: 'French wheat vodka — clean · crisp · perfect with tonic',       price: '€11' },
    { name: 'Diplomático Reserva',desc: 'Venezuelan dark rum — dried fruit · chocolate · oak',           price: '€13' },
  ],
  'Wines': [
    { name: 'Quinta do Crasto',  desc: 'Douro red — dark cherry · cedar · structured tannins',           price: '€9', badge: 'Local' },
    { name: 'Esporão Reserve',   desc: 'Alentejo white — tropical fruit · citrus · mineral finish',      price: '€8' },
    { name: 'Barolo DOCG',       desc: 'Italian red — rose · tar · violet · 3 years aged',              price: '€16' },
    { name: 'Sancerre Blanc',    desc: 'Loire Sauvignon — crisp · grassy · citrus · flint',              price: '€14' },
    { name: 'Prosecco DOC',      desc: 'Italian sparkling — fine bubbles · pear · white peach',          price: '€9' },
    { name: 'Provence Rosé',     desc: 'French dry rosé — strawberry · peach · elegant',                 price: '€10' },
  ],
  'Zero Proof': [
    { name: 'Cave Zero',      desc: 'House shrub · hibiscus · smoked salt · sparkling · fire garnish',   price: '€9', badge: 'Signature' },
    { name: 'Stone Cold',     desc: 'Cold brew · coconut cream · cacao · cardamom · oat milk',           price: '€8' },
    { name: 'Ember Lemonade', desc: 'Charred lemon · turmeric · ginger · honey · soda',                  price: '€7' },
    { name: 'Night Garden',   desc: 'Cucumber · elderflower · mint · yuzu · tonic',                      price: '€7' },
  ],
}

export default function Menu() {
  const [active, setActive] = useState<Cat>('Signature')

  return (
    <section id="menu" className="py-32 bg-[#050505] relative">
      <div className="absolute top-0 left-0 right-0 h-px divider-fire" />

      <div className="max-w-6xl mx-auto px-8 lg:px-16">

        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display text-[9px] tracking-[0.5em] text-[#e84800] uppercase block mb-5">
            Curated Selection
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display font-bold text-[#ede8e4]"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            The Menu
          </motion.h2>
          <div className="mt-5 mx-auto w-12 h-px bg-[#e84800]/50" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-16 glass p-1.5 max-w-md mx-auto" style={{ borderRadius: 2 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`flex-1 font-display text-[9px] tracking-[0.2em] uppercase py-3 transition-all duration-300 ${
                active === cat
                  ? 'bg-[#e84800] text-white'
                  : 'text-white/25 hover:text-white/60'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-x-20 gap-y-0"
          >
            {ITEMS[active].map((item, i) => (
              <motion.div key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-start justify-between gap-6 py-6 group"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-display text-[#ede8e4] text-sm tracking-wide group-hover:text-[#ff6a00] transition-colors duration-300">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="font-sans text-[8px] tracking-widest uppercase border border-[rgba(232,72,0,0.3)] text-[#e84800]/70 px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-sans font-light text-white/20 text-xs leading-relaxed tracking-wide">{item.desc}</p>
                </div>
                <span className="font-display text-[#e84800] text-sm flex-shrink-0 mt-0.5">{item.price}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="text-center font-sans font-light text-white/15 text-[10px] tracking-[0.3em] uppercase mt-14">
          All prices include VAT · Allergen info on request
        </p>
      </div>
    </section>
  )
}

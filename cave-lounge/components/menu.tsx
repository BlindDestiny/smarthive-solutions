'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = ['Signature Cocktails', 'Spirits & Whiskey', 'Wines', 'Non-Alcoholic'] as const
type Cat = typeof CATEGORIES[number]

const ITEMS: Record<Cat, { name: string; desc: string; price: string; badge?: string }[]> = {
  'Signature Cocktails': [
    { name: 'Cave Fire',         desc: 'Mezcal, habanero syrup, smoked orange peel, dark chocolate bitters',        price: '€14', badge: 'House Special' },
    { name: 'Ember & Ash',       desc: 'Bourbon, activated charcoal, honey, lemon, rosemary smoke',                 price: '€15' },
    { name: 'Underworld',        desc: 'Gin, blackcurrant, lavender, elderflower tonic, edible gold',               price: '€13' },
    { name: 'The Stalactite',    desc: 'Vodka, blue curaçao, coconut, lime, crushed ice',                           price: '€12' },
    { name: 'Crimson Tide',      desc: 'Rum, passion fruit, grenadine, lime, ginger beer',                          price: '€13', badge: 'Bestseller' },
    { name: 'Midnight Ritual',   desc: 'Tequila, espresso, kahlúa, vanilla, salted dark chocolate rim',             price: '€14' },
  ],
  'Spirits & Whiskey': [
    { name: 'Macallan 12',       desc: 'Single malt Scotch whisky — sherry oak casks, honey and dried fruit notes', price: '€16' },
    { name: 'Blantons Original', desc: 'Single barrel bourbon — buffalo trace, caramel, vanilla, spice',            price: '€18', badge: 'Staff Pick' },
    { name: 'Casamigos Reposado',desc: 'Small batch tequila — caramel, vanilla, light cocoa',                       price: '€15' },
    { name: 'Hendrick\'s Gin',   desc: 'Scottish gin — cucumber, rose petals, 11 botanicals',                      price: '€12' },
    { name: 'Grey Goose',        desc: 'French wheat vodka — clean, smooth, perfect serve with tonic',              price: '€11' },
    { name: 'Diplomático Reserva',desc:'Venezuelan dark rum — rich, complex, dried fruit and chocolate',            price: '€13' },
  ],
  'Wines': [
    { name: 'Quinta do Crasto',  desc: 'Douro red — structured tannins, dark cherry, cedar, long finish',           price: '€9/glass', badge: 'Local Selection' },
    { name: 'Esporão Reserve',   desc: 'Alentejo white — tropical fruit, citrus zest, mineral finish',              price: '€8/glass' },
    { name: 'Barolo DOCG',       desc: 'Italian red — full body, rose, tar, violet, aged 3 years',                  price: '€16/glass' },
    { name: 'Sancerre Blanc',    desc: 'Loire Valley Sauvignon Blanc — crisp, grassy, citrus, flint',               price: '€14/glass' },
    { name: 'Prosecco DOC',      desc: 'Italian sparkling — fine bubbles, pear, white peach, almond',               price: '€9/glass' },
    { name: 'Rosé Provence',     desc: 'French dry rosé — strawberry, peach, clean and elegant',                   price: '€10/glass' },
  ],
  'Non-Alcoholic': [
    { name: 'Cave Zero',         desc: 'House shrub, hibiscus, smoked sea salt, sparkling water, fire garnish',     price: '€9', badge: 'Signature' },
    { name: 'Stone Cold',        desc: 'Cold brew, coconut cream, cacao, cardamom, oat milk',                       price: '€8' },
    { name: 'Ember Lemonade',    desc: 'Charred lemon, turmeric, ginger, honey, soda water',                        price: '€7' },
    { name: 'Night Garden',      desc: 'Cucumber, elderflower, mint, yuzu, sparkling tonic',                        price: '€7' },
  ],
}

export default function Menu() {
  const [active, setActive] = useState<Cat>('Signature Cocktails')

  return (
    <section id="menu" className="py-28 bg-cave-bg relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display text-[10px] tracking-[0.4em] text-[#e84800] uppercase block mb-4">
            Curated Selection
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display font-bold text-cave-text" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            The Menu
          </motion.h2>
          <div className="mt-4 mx-auto w-16 h-px bg-[#e84800]" />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`font-display text-[10px] tracking-[0.2em] uppercase px-5 py-3 transition-all duration-200 ${
                active === cat
                  ? 'bg-[#e84800] text-white'
                  : 'border border-[rgba(232,72,0,0.25)] text-cave-muted hover:border-[#e84800] hover:text-[#ff6a00]'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-2 gap-x-12 gap-y-0"
          >
            {ITEMS[active].map((item, i) => (
              <motion.div key={item.name}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start justify-between gap-4 py-5 border-b border-[rgba(232,72,0,0.08)] group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-cave-text text-sm tracking-wide group-hover:text-[#ff6a00] transition-colors">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="font-sans text-[9px] tracking-widest uppercase bg-[#e84800]/15 text-[#e84800] px-2 py-0.5 border border-[rgba(232,72,0,0.3)]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-cave-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
                <span className="font-display text-[#e84800] text-sm flex-shrink-0">{item.price}</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-center font-sans text-cave-muted/50 text-xs tracking-widest uppercase mt-10">
          Prices include VAT · Allergen information available on request
        </motion.p>
      </div>
    </section>
  )
}

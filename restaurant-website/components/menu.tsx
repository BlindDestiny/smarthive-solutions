'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = ['Entradas', 'Principais', 'Sobremesas', 'Cocktails'] as const
type Cat = typeof CATEGORIES[number]

const ITEMS: Record<Cat, { name: string; desc: string; price: string; badge?: string }[]> = {
  Entradas: [
    { name: 'Tártaro de Atum',       desc: 'Atum do Atlântico, aguacate, sésamo torrado, creme de wasabi', price: '€28', badge: 'Chef' },
    { name: 'Mousse de Foie Gras',   desc: 'Foie gras de pato, brioche tostado, gel de porto',             price: '€22' },
    { name: 'Ostra Gratinada',       desc: '3 ostras finas, manteiga de alho negro, pão ralado perfumado', price: '€18', badge: 'Sazonal' },
    { name: 'Vieira Grelhada',       desc: 'Vieira de St. Jacques, puré de couve-flor, caviar de truta',   price: '€26' },
    { name: 'Croquete de Lavagante', desc: 'Lavagante breton, bisque concentrado, maionese de yuzu',       price: '€24', badge: 'Novo' },
    { name: 'Polvo Confitado',       desc: 'Polvo do Algarve, puré de batata fumada, azeite de manjericão',price: '€19' },
  ],
  Principais: [
    { name: 'Lombo de Wagyu A5',     desc: 'Wagyu japonês A5, tutano, ervas da montanha, jus intenso',    price: '€72', badge: 'Premium' },
    { name: 'Rodovalho Selvagem',    desc: 'Rodovalho do Atlântico, velouté de marisco, espinafres baby', price: '€44' },
    { name: 'Presa Ibérica',         desc: 'Presa de porco ibérico, migas alentejanas, amêijoas em vinho', price: '€38', badge: 'Chef' },
    { name: 'Risotto de Trufa',      desc: 'Trufa negra Périgord, parmesão 36 meses, manteiga de nozes',  price: '€36' },
    { name: 'Robalo em Crosta',      desc: 'Robalo selvagem, crosta de ervas, beurre blanc de limão',     price: '€42' },
    { name: 'Bacalhau da Casa',      desc: 'Lombos curados, grão com chouriço, ovo a 63°C',               price: '€34', badge: 'Sazonal' },
  ],
  Sobremesas: [
    { name: 'Soufflé de Chocolate',  desc: 'Chocolate Valrhona 72%, gelado de baunilha Madagascar',       price: '€14', badge: 'Clássico' },
    { name: 'Tarte Tatin de Pera',   desc: 'Pera Rocha caramelizada, crème fraîche, caramelo de flor de sal', price: '€12' },
    { name: 'Gelado Artesanal',      desc: 'Selecção do dia em 3 bolas, tuille de amêndoa',               price: '€10' },
    { name: 'Mil-Folhas',            desc: 'Massa folhada estaladiça, creme de baunilha, framboesas',     price: '€13', badge: 'Novo' },
    { name: 'Cheese & Honey',        desc: 'Selecção de queijos portugueses, mel de urze, nozes',         price: '€16' },
    { name: 'Mesa de Petit Fours',   desc: 'Trufa, macaron, nougat, financier — 6 peças por pessoa',      price: '€11' },
  ],
  Cocktails: [
    { name: 'The Venue Signature',   desc: 'Gin Hendricks, pepino, elderflower, tónica artesanal',        price: '€16', badge: 'Exclusivo' },
    { name: 'Porto Negroni',         desc: 'Gin Roku, Porto Tawny, Campari, laranja desidratada',         price: '€14' },
    { name: 'Lisbon Mule',           desc: 'Vodka Belvedere, ginger beer, lima, hortelã do jardim',       price: '€13' },
    { name: 'Smoked Old Fashioned',  desc: 'Bourbon Woodford, Demerara, Angostura, fumo de cerejeira',    price: '€17', badge: 'Chef' },
    { name: 'Rose Garden',           desc: 'Gin de rosas, lychee, água de rosas, prosecco',               price: '€15' },
    { name: 'Zero-Proof Colada',     desc: 'Coco, ananás, lima, leite de amêndoa — sem álcool',           price: '€10' },
  ],
}

export default function Menu() {
  const [active, setActive] = useState<Cat>('Entradas')

  return (
    <section id="menu" className="py-32 lg:py-44 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">02</span>
              <span className="w-12 h-px bg-gold/40" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">A Nossa Carta</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif font-light text-5xl md:text-6xl text-white"
            >
              Menu Sazonal
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-sans text-white/30 text-sm max-w-xs leading-relaxed"
          >
            Ingredientes frescos, sazonais, maioritariamente portugueses. Menu renovado semanalmente.
          </motion.p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 mb-12 border-b border-white/10 pb-0">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className="relative pb-4 px-2 font-sans text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 mr-6"
              style={{ color: active === cat ? '#d4af37' : 'rgba(255,255,255,0.3)' }}
            >
              {cat}
              {active === cat && (
                <motion.div layoutId="menu-tab"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-0"
          >
            {ITEMS[active].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-start justify-between py-6 border-b border-white/[0.06] hover:bg-white/[0.02] px-3 -mx-3 transition-colors duration-300 cursor-default"
              >
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-serif text-lg text-white group-hover:text-gold transition-colors duration-300">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="font-sans text-[9px] tracking-widest uppercase text-gold/70 border border-gold/30 px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-white/30 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="font-serif text-gold text-lg flex-shrink-0">{item.price}</div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 flex items-center gap-6"
        >
          <a href="#reservar"
            className="group relative overflow-hidden border border-gold/50 hover:border-gold text-gold font-sans text-[11px] tracking-[0.3em] uppercase px-8 py-4 transition-all duration-300 hover:bg-gold/10">
            Reservar Mesa
          </a>
          <p className="font-sans text-white/20 text-xs">Alergénios disponíveis a pedido · Menu de degustação €110/pax</p>
        </motion.div>
      </div>
    </section>
  )
}

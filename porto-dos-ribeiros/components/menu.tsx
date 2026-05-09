'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = ['Entradas', 'Pratos Principais', 'Sobremesas', 'Bebidas'] as const
type Cat = typeof CATEGORIES[number]

const ITEMS: Record<Cat, { name: string; desc: string; price: string; badge?: string; veg?: boolean }[]> = {
  Entradas: [
    { name: 'Pão de Queijo (x6)',     desc: 'Pão de queijo mineiro tradicional, crocante por fora, cremoso por dentro', price: '€4.50', badge: '🇧🇷 Clássico', veg: true },
    { name: 'Coxinha de Frango',       desc: 'Coxinha estaladiça com recheio de frango desfiado e catupiry',               price: '€5.00' },
    { name: 'Caldinho de Feijão',      desc: 'Caldo de feijão preto cremoso com bacon crocante e cebolinha',               price: '€4.00' },
    { name: 'Bolinho de Bacalhau BR',  desc: 'Bolinho frito à maneira brasileira, com bacalhau desfiado e ervas',          price: '€5.50' },
    { name: 'Salada Vinagrete',        desc: 'Tomate, cebola, pimento, coentros, azeite e vinagre — leve e fresca',        price: '€4.00', veg: true },
    { name: 'Mandioca Frita',          desc: 'Mandioca crocante frita com vinagrete e molho de alho',                      price: '€4.50', badge: 'Favorito', veg: true },
  ],
  'Pratos Principais': [
    { name: 'Feijoada Completa',       desc: 'Feijão preto, costelinha, paio, linguiça, arroz, couve, farofa e laranja',   price: '€13.50', badge: '🏆 Especialidade' },
    { name: 'Picanha na Chapa',        desc: 'Picanha grelhada com arroz, feijão, farofa e vinagrete',                     price: '€14.00', badge: '🔥 Mais pedido' },
    { name: 'Stroganoff de Frango',    desc: 'Frango cremoso ao stroganoff, arroz e batata palha crocante',                price: '€11.00' },
    { name: 'Moqueca Baiana',          desc: 'Peixe no leite de coco com dendê, coentros e arroz branco',                  price: '€13.00' },
    { name: 'Arroz Carreteiro',        desc: 'Arroz com carne seca desfiada, pimento, cebola e ovo estrelado',             price: '€12.00' },
    { name: 'Frango Grelhado',         desc: 'Frango temperado, grelhado, com arroz, feijão e salada',                     price: '€10.00' },
    { name: 'Prato Vegetariano',       desc: 'Arroz, feijão, legumes grelhados, ovo e farofa de mandioca',                 price: '€9.50', veg: true },
  ],
  Sobremesas: [
    { name: 'Brigadeiro Artesanal',    desc: 'Trufa de chocolate caseira enrolada em granulado — pura nostalgia',          price: '€4.00', badge: '🍫 Clássico', veg: true },
    { name: 'Pudim de Leite',          desc: 'Pudim tradicional brasileiro, aveludado e caramelizado',                     price: '€4.50', veg: true },
    { name: 'Mousse de Maracujá',      desc: 'Mousse leve e refrescante de maracujá fresco',                               price: '€4.50', veg: true },
    { name: 'Açaí na Tigela',          desc: 'Açaí puro com banana, granola, mel e morango',                               price: '€6.00', badge: 'Saudável', veg: true },
  ],
  Bebidas: [
    { name: 'Caipirinha Clássica',     desc: 'Cachaça, lima, açúcar e gelo picado — a rainha das bebidas',                 price: '€6.00', badge: '🍹 Assinatura' },
    { name: 'Caipirinha de Maracujá',  desc: 'Cachaça, maracujá fresco, lima e açúcar',                                    price: '€6.50' },
    { name: 'Caipiroska de Morango',   desc: 'Vodka, morango fresco, lima e açúcar',                                       price: '€7.00' },
    { name: 'Suco Natural',            desc: 'Maracujá, laranja, manga ou goiaba — feito na hora',                         price: '€3.50', veg: true },
    { name: 'Guaraná Antarctica',      desc: 'O refrigerante mais icónico do Brasil, direto ao Porto',                     price: '€2.50', badge: '🇧🇷' },
    { name: 'Água de Coco',            desc: 'Natural, fresca e hidratante',                                               price: '€3.00', veg: true },
  ],
}

export default function Menu() {
  const [active, setActive] = useState<Cat>('Pratos Principais')

  return (
    <section id="menu" className="py-32 lg:py-44 bg-[#060c05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#00a651]">02</span>
              <span className="w-12 h-px bg-[#00a651]/40" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Cardápio</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="font-serif font-bold text-5xl md:text-6xl text-white"
            >
              O nosso<br />
              <span className="text-[#00a651]">Cardápio</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-sans text-white/30 text-sm max-w-xs leading-relaxed"
          >
            Preços entre <span className="text-white/60">5€ e 15€</span>. Alergénios disponíveis a pedido. 🌿 = vegetariano.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-12 border-b border-white/10">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className="relative pb-4 px-2 mr-5 font-sans text-[11px] tracking-[0.15em] uppercase transition-colors duration-300"
              style={{ color: active === cat ? '#00a651' : 'rgba(255,255,255,0.3)' }}
            >
              {cat}
              {active === cat && (
                <motion.div layoutId="menu-tab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00a651]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-2 gap-0"
          >
            {ITEMS[active].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-start justify-between py-5 border-b border-white/[0.06] hover:bg-white/[0.02] px-3 -mx-3 transition-colors duration-300 cursor-default"
              >
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-serif text-lg text-white group-hover:text-[#00a651] transition-colors duration-300">
                      {item.name}
                    </span>
                    {item.veg && <span className="text-[10px] text-[#00a651]">🌿</span>}
                    {item.badge && (
                      <span className="font-sans text-[9px] tracking-wide uppercase text-[#FFD700] border border-[#FFD700]/30 px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-white/30 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <div className="font-serif text-[#00a651] text-lg font-semibold flex-shrink-0">{item.price}</div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-12 flex flex-wrap items-center gap-6"
        >
          <a href="tel:963349411"
            className="group relative overflow-hidden bg-[#00a651] text-white font-sans text-[11px] tracking-[0.25em] uppercase px-8 py-4 transition-all duration-300 hover:bg-[#00c060]">
            📞 Fazer Reserva
          </a>
          <a href="https://wa.me/351963349411" target="_blank" rel="noopener noreferrer"
            className="font-sans text-[11px] tracking-[0.25em] uppercase text-[#25d366] border border-[#25d366]/30 hover:border-[#25d366] px-8 py-4 transition-all duration-300">
            💬 WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}

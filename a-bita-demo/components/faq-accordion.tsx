'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { FAQ } from '@/lib/content'

export default function FAQAccordion({ faqs, dark = false }: { faqs: FAQ[]; dark?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className={`section ${dark ? 'bg-bita-forest text-bita-cream' : 'bg-bita-surface'}`}>
      <div className="container-bita">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <span className={dark ? 'cream-rule' : 'gold-rule'} />
              <span className={dark ? 'eyebrow-cream' : 'eyebrow'}>Perguntas frequentes</span>
            </div>
            <h2 className={`font-display text-4xl md:text-5xl leading-tight italic ${dark ? 'text-bita-cream' : 'text-bita-ink'}`}>
              Tem dúvidas?
              <span className={`block font-script not-italic text-5xl md:text-6xl mt-2 ${dark ? 'text-bita-goldLight' : 'text-bita-gold'}`}>
                temos chá e respostas
              </span>
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className={`${dark ? 'bg-bita-forestLight/30 border-bita-cream/10' : 'bg-bita-bg border-bita-line'} border`}>
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <div
                    key={i}
                    className={`${dark ? 'border-bita-cream/10' : 'border-bita-line'} ${
                      i === faqs.length - 1 ? '' : 'border-b'
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 p-6 md:p-8 text-left group transition-colors hover:bg-black/[0.02]"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-display text-lg md:text-xl leading-tight transition-colors ${
                          isOpen
                            ? 'text-bita-gold'
                            : dark
                              ? 'text-bita-cream group-hover:text-bita-goldLight'
                              : 'text-bita-ink group-hover:text-bita-goldDark'
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`shrink-0 w-9 h-9 border flex items-center justify-center transition-colors ${
                          isOpen
                            ? 'border-bita-gold text-bita-gold'
                            : dark
                              ? 'border-bita-cream/20 text-bita-cream/60'
                              : 'border-bita-line text-bita-muted'
                        }`}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>

                    <div className={`grid transition-all duration-300 ease-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className={`px-6 md:px-8 pb-8 leading-relaxed text-[15px] ${dark ? 'text-bita-cream/85' : 'text-bita-body'}`}>
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

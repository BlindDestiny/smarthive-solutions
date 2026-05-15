'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import type { FAQ } from '@/lib/content'

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="section bg-rp-panel">
      <div className="container-rp">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">Perguntas Frequentes</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-rp-ink leading-tight">
              Esclareça
              <span className="block italic text-rp-gold">as suas dúvidas.</span>
            </h2>
            <p className="mt-6 text-rp-body/85 leading-relaxed">
              As perguntas mais comuns sobre esta área. Se a sua dúvida específica
              não constar, fale connosco — respondemos em 24 horas úteis.
            </p>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="bg-white border border-rp-line">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i
                return (
                  <div
                    key={i}
                    className={`border-b border-rp-line ${
                      i === faqs.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 p-6 md:p-8 text-left group transition-colors hover:bg-rp-panel/50"
                      aria-expanded={isOpen}
                    >
                      <span
                        className={`font-display text-lg md:text-xl leading-tight transition-colors ${
                          isOpen ? 'text-rp-gold' : 'text-rp-ink group-hover:text-rp-goldDark'
                        }`}
                      >
                        {faq.q}
                      </span>
                      <span
                        className={`shrink-0 w-9 h-9 border flex items-center justify-center transition-colors ${
                          isOpen ? 'border-rp-gold text-rp-gold' : 'border-rp-line text-rp-muted'
                        }`}
                      >
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        isOpen
                          ? 'grid-rows-[1fr] opacity-100'
                          : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 md:px-8 pb-8 text-rp-body leading-relaxed text-[15px]">
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

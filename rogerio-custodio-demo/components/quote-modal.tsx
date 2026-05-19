'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, Check, MapPin, Calendar } from 'lucide-react'
import { services } from '@/lib/content'

const EASE = [0.22, 1, 0.36, 1] as const

type Props = { open: boolean; onClose: () => void; preselectedService: string | null }

export default function QuoteModal({ open, onClose, preselectedService }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [service, setService] = useState<string>(preselectedService || '')
  const [budget, setBudget] = useState<string>('')
  const [timeline, setTimeline] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (preselectedService) setService(preselectedService)
  }, [preselectedService])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(1); setService(''); setBudget(''); setTimeline(''); setLocation('')
        setName(''); setEmail(''); setPhone(''); setMessage('')
      }, 400)
      return () => clearTimeout(t)
    }
  }, [open])

  const canNext1 = !!service && !!budget && !!timeline
  const canNext2 = name.trim().length > 1 && /.+@.+\..+/.test(email) && phone.trim().length >= 9

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-rc-ink/75 backdrop-blur-sm" />

          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-rc-surface w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-rc-surface border-b border-rc-line px-8 py-6 flex items-center justify-between">
              <div>
                <div className="eyebrow">Pedido de Orçamento</div>
                <div className="font-display text-2xl text-rc-ink mt-1">
                  Vamos construir <span className="italic text-rc-gold">o seu projeto</span>
                </div>
              </div>
              <button onClick={onClose} aria-label="Fechar"
                className="w-10 h-10 border border-rc-line hover:border-rc-gold flex items-center justify-center transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Stepper */}
            <div className="px-8 pt-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2">
                <Step n={1} label="Projeto" active={step === 1} done={step > 1} />
                <span className="flex-1 h-px bg-rc-line" />
                <Step n={2} label="Contacto" active={step === 2} done={step > 2} />
                <span className="flex-1 h-px bg-rc-line" />
                <Step n={3} label="Confirmação" active={step === 3} done={false} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="px-8 py-8 space-y-8"
                >
                  <div>
                    <label className="eyebrow block mb-3">O que pretende? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {services.map((s) => (
                        <button key={s.slug} onClick={() => setService(s.slug)}
                          className={`p-4 text-left border transition-colors ${
                            service === s.slug
                              ? 'border-rc-gold bg-rc-panel'
                              : 'border-rc-line hover:border-rc-gold'
                          }`}>
                          <div className="font-display text-lg text-rc-ink">{s.title}</div>
                          <div className="text-xs text-rc-muted mt-1">{s.short}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="eyebrow block mb-3">Orçamento estimado *</label>
                      <div className="space-y-2">
                        {['Até 5.000 €', '5.000 – 10.000 €', '10.000 – 20.000 €', 'Mais de 20.000 €', 'Não tenho ideia ainda'].map((opt) => (
                          <button key={opt} onClick={() => setBudget(opt)}
                            className={`block w-full text-left px-4 py-3 text-sm border transition-colors ${
                              budget === opt ? 'border-rc-gold bg-rc-panel text-rc-ink' : 'border-rc-line hover:border-rc-gold text-rc-body'
                            }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="eyebrow block mb-3">Quando precisa? *</label>
                      <div className="space-y-2">
                        {['Urgente (4 semanas)', '1 – 2 meses', '3 – 6 meses', 'Mais de 6 meses', 'Flexível'].map((opt) => (
                          <button key={opt} onClick={() => setTimeline(opt)}
                            className={`block w-full text-left px-4 py-3 text-sm border transition-colors ${
                              timeline === opt ? 'border-rc-gold bg-rc-panel text-rc-ink' : 'border-rc-line hover:border-rc-gold text-rc-body'
                            }`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow block mb-2">Localização da obra (opcional)</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                      className="input-rc" placeholder="Ex: Vilamoura, Loulé, Lisboa..." />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="px-8 py-8 space-y-6 max-w-xl mx-auto"
                >
                  <div>
                    <label className="eyebrow block mb-2">Nome *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-rc" placeholder="O seu nome" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="eyebrow block mb-2">Email *</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-rc" placeholder="email@exemplo.com" />
                    </div>
                    <div>
                      <label className="eyebrow block mb-2">Telefone *</label>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-rc" placeholder="9XX XXX XXX" />
                    </div>
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Detalhes do projeto (opcional)</label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4}
                      className="input-rc resize-none"
                      placeholder="Descreva brevemente o que pretende — dimensões, estilo desejado, restrições do espaço…" />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="px-8 py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                    className="w-20 h-20 mx-auto rounded-full bg-rc-gold/10 flex items-center justify-center mb-8"
                  >
                    <Check size={36} className="text-rc-gold" strokeWidth={1.5} />
                  </motion.div>
                  <h3 className="font-display text-3xl italic text-rc-ink leading-tight">
                    Recebemos o seu pedido.
                  </h3>
                  <p className="mt-4 text-rc-body max-w-md mx-auto leading-relaxed">
                    Vamos analisar o projeto e contactá-lo em <span className="font-medium text-rc-ink">{email}</span> dentro de 24 horas úteis com os próximos passos.
                  </p>
                  <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 p-5 bg-rc-panel border border-rc-line text-sm">
                    <span className="flex items-center gap-2 text-rc-ink">
                      <Calendar size={14} className="text-rc-gold" /> {timeline}
                    </span>
                    <span className="text-rc-muted">·</span>
                    <span className="flex items-center gap-2 text-rc-ink">
                      {services.find((s) => s.slug === service)?.title || service}
                    </span>
                    {location && (<>
                      <span className="text-rc-muted">·</span>
                      <span className="flex items-center gap-2 text-rc-ink">
                        <MapPin size={14} className="text-rc-gold" /> {location}
                      </span>
                    </>)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="sticky bottom-0 bg-rc-surface border-t border-rc-line px-8 py-5 flex items-center justify-between">
              {step > 1 && step < 3 ? (
                <button onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                  className="text-[12px] uppercase tracking-widest2 text-rc-muted hover:text-rc-gold inline-flex items-center gap-2 transition-colors">
                  <ArrowLeft size={12} /> Voltar
                </button>
              ) : <span />}

              {step === 1 && (
                <button onClick={() => canNext1 && setStep(2)} disabled={!canNext1}
                  className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
                  Continuar <ArrowRight size={14} />
                </button>
              )}
              {step === 2 && (
                <button onClick={() => canNext2 && setStep(3)} disabled={!canNext2}
                  className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed">
                  Enviar pedido <ArrowRight size={14} />
                </button>
              )}
              {step === 3 && (
                <button onClick={onClose} className="btn-primary">Fechar</button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-6 h-6 flex items-center justify-center text-xs font-medium transition-colors ${
        done ? 'bg-rc-gold text-white' : active ? 'bg-rc-ink text-white' : 'bg-rc-panel text-rc-muted'
      }`}>
        {done ? <Check size={11} /> : n}
      </span>
      <span className={`hidden sm:inline ${active || done ? 'text-rc-ink' : 'text-rc-muted'}`}>{label}</span>
    </div>
  )
}

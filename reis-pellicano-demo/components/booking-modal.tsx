'use client'

import { useEffect, useState } from 'react'
import { X, Calendar, Clock, ArrowRight, ArrowLeft, Check, User, Video } from 'lucide-react'

type Props = { open: boolean; onClose: () => void }

const TIMES = ['09:30', '10:30', '11:30', '14:00', '15:00', '16:00', '17:00']

function buildCalendarDays(monthOffset: number) {
  const today = new Date()
  const ref = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = ref.getFullYear()
  const month = ref.getMonth()
  const monthName = ref.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7 // Monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: { date: Date | null; disabled: boolean }[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push({ date: null, disabled: true })
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const dow = date.getDay()
    const past = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const weekend = dow === 0 || dow === 6
    cells.push({ date, disabled: past || weekend })
  }
  return { cells, monthName }
}

export default function BookingModal({ open, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  // Lock body scroll while open + ESC to close
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
      // Reset state on close after small delay (so user doesn't see flash)
      const t = setTimeout(() => {
        setStep(1)
        setMonthOffset(0)
        setSelectedDate(null)
        setSelectedTime(null)
        setName('')
        setEmail('')
      }, 300)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  const { cells, monthName } = buildCalendarDays(monthOffset)

  const canNextStep1 = !!selectedDate && !!selectedTime
  const canNextStep2 = name.trim().length > 1 && /.+@.+\..+/.test(email)

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-rp-ink/70 backdrop-blur-sm" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-rp-line px-8 py-6 flex items-center justify-between">
          <div>
            <div className="eyebrow">Agendar Online</div>
            <div className="font-display text-2xl text-rp-ink mt-1">
              Primeira Consulta &middot; <span className="italic text-rp-gold">30 min</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-10 h-10 border border-rp-line hover:border-rp-gold flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2">
            <Step n={1} label="Data e Hora" active={step === 1} done={step > 1} />
            <span className="flex-1 h-px bg-rp-line" />
            <Step n={2} label="Os Seus Dados" active={step === 2} done={step > 2} />
            <span className="flex-1 h-px bg-rp-line" />
            <Step n={3} label="Confirmação" active={step === 3} done={false} />
          </div>
        </div>

        {/* Step 1: Calendar + times */}
        {step === 1 && (
          <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-rp-ink capitalize">{monthName}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
                    disabled={monthOffset === 0}
                    className="w-9 h-9 border border-rp-line hover:border-rp-gold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Mês anterior"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    onClick={() => setMonthOffset((m) => Math.min(2, m + 1))}
                    disabled={monthOffset === 2}
                    className="w-9 h-9 border border-rp-line hover:border-rp-gold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Mês seguinte"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[10px] uppercase tracking-widest2 text-rp-muted text-center py-2">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, i) => {
                  if (!cell.date) return <div key={i} />
                  const selected =
                    selectedDate &&
                    selectedDate.getFullYear() === cell.date.getFullYear() &&
                    selectedDate.getMonth() === cell.date.getMonth() &&
                    selectedDate.getDate() === cell.date.getDate()
                  return (
                    <button
                      key={i}
                      disabled={cell.disabled}
                      onClick={() => setSelectedDate(cell.date)}
                      className={`aspect-square text-sm transition-colors ${
                        cell.disabled
                          ? 'text-rp-muted/40 cursor-not-allowed'
                          : selected
                          ? 'bg-rp-ink text-white'
                          : 'border border-rp-line hover:border-rp-gold hover:text-rp-gold text-rp-ink'
                      }`}
                    >
                      {cell.date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="md:col-span-2 md:border-l md:border-rp-line md:pl-8">
              <div className="flex items-center gap-2 mb-5">
                <Clock size={14} className="text-rp-gold" />
                <span className="text-[11px] uppercase tracking-widest2 text-rp-muted">
                  Horários disponíveis
                </span>
              </div>

              {!selectedDate ? (
                <p className="text-sm text-rp-muted leading-relaxed">
                  Selecione uma data no calendário.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {TIMES.map((t) => {
                    const active = selectedTime === t
                    return (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-3 text-sm transition-colors ${
                          active
                            ? 'bg-rp-gold text-white'
                            : 'border border-rp-line hover:border-rp-gold hover:text-rp-gold text-rp-ink'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="mt-6 text-xs text-rp-muted leading-relaxed">
                <div className="flex items-start gap-2 mb-2">
                  <Video size={12} className="text-rp-gold mt-0.5" />
                  <span>Videochamada (Google Meet) ou presencial em Lisboa, Porto ou Faro.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar size={12} className="text-rp-gold mt-0.5" />
                  <span>Receberá um convite no calendário após confirmar.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="px-8 py-8">
            <div className="max-w-md mx-auto">
              <div className="mb-8 p-5 bg-rp-panel border border-rp-line text-sm">
                <div className="flex items-center gap-3 text-rp-ink">
                  <Calendar size={16} className="text-rp-gold" />
                  <span>
                    {selectedDate?.toLocaleDateString('pt-PT', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}{' '}
                    · {selectedTime}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="eyebrow block mb-2">Nome completo *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-rp"
                    placeholder="O seu nome"
                  />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-rp"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Assunto (opcional)</label>
                  <select className="input-rp">
                    <option>Selecionar área</option>
                    <option>Direito Imobiliário</option>
                    <option>Nacionalidade Portuguesa</option>
                    <option>Vistos Gold</option>
                    <option>Direito Fiscal</option>
                    <option>Outro</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="px-8 py-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-rp-gold/10 flex items-center justify-center mb-8">
              <Check size={36} className="text-rp-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-3xl text-rp-ink leading-tight">
              Consulta agendada.
            </h3>
            <p className="mt-4 text-rp-body max-w-md mx-auto leading-relaxed">
              Enviámos um convite para <span className="font-medium text-rp-ink">{email}</span> com
              os detalhes e o link da videochamada.
            </p>

            <div className="mt-10 inline-flex items-center gap-4 p-5 bg-rp-panel border border-rp-line text-sm">
              <Calendar size={16} className="text-rp-gold" />
              <span className="text-rp-ink">
                {selectedDate?.toLocaleDateString('pt-PT', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                · {selectedTime}
              </span>
              <span className="text-rp-muted">·</span>
              <span className="flex items-center gap-2 text-rp-ink">
                <User size={14} className="text-rp-gold" /> {name}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-rp-line px-8 py-5 flex items-center justify-between">
          {step > 1 && step < 3 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="text-[12px] uppercase tracking-widest2 text-rp-muted hover:text-rp-gold inline-flex items-center gap-2 transition-colors"
            >
              <ArrowLeft size={12} /> Voltar
            </button>
          ) : (
            <span />
          )}

          {step === 1 && (
            <button
              onClick={() => canNextStep1 && setStep(2)}
              disabled={!canNextStep1}
              className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Continuar <ArrowRight size={14} />
            </button>
          )}
          {step === 2 && (
            <button
              onClick={() => canNextStep2 && setStep(3)}
              disabled={!canNextStep2}
              className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Confirmar Agendamento <ArrowRight size={14} />
            </button>
          )}
          {step === 3 && (
            <button onClick={onClose} className="btn-primary">
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-6 h-6 flex items-center justify-center text-xs font-medium transition-colors ${
          done ? 'bg-rp-gold text-white' : active ? 'bg-rp-ink text-white' : 'bg-rp-panel text-rp-muted'
        }`}
      >
        {done ? <Check size={11} /> : n}
      </span>
      <span className={`hidden sm:inline ${active || done ? 'text-rp-ink' : 'text-rp-muted'}`}>
        {label}
      </span>
    </div>
  )
}

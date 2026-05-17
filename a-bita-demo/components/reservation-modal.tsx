'use client'

import { useEffect, useState } from 'react'
import { X, Calendar, Clock, Users, ArrowRight, ArrowLeft, Check, MapPin, Utensils } from 'lucide-react'

type Props = { open: boolean; onClose: () => void }

const LUNCH_TIMES  = ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30']
const DINNER_TIMES = ['17:00', '17:30', '18:00', '18:30']

function buildCalendarDays(monthOffset: number) {
  const today = new Date()
  const ref = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = ref.getFullYear()
  const month = ref.getMonth()
  const monthName = ref.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })

  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: { date: Date | null; disabled: boolean }[] = []
  for (let i = 0; i < firstWeekday; i++) cells.push({ date: null, disabled: true })
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const today0 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const past = date < today0
    const isMonday = date.getDay() === 1
    cells.push({ date, disabled: past || isMonday })
  }
  return { cells, monthName }
}

export default function ReservationModal({ open, onClose }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [people, setPeople] = useState(2)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

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
        setStep(1); setMonthOffset(0); setSelectedDate(null); setSelectedTime(null)
        setPeople(2); setName(''); setEmail(''); setPhone(''); setNotes('')
      }, 300)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  const { cells, monthName } = buildCalendarDays(monthOffset)
  const canNextStep1 = !!selectedDate && !!selectedTime && people > 0
  const canNextStep2 = name.trim().length > 1 && /.+@.+\..+/.test(email) && phone.trim().length >= 9

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-bita-ink/70 backdrop-blur-sm" />

      <div onClick={(e) => e.stopPropagation()} className="relative bg-bita-surface w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-bita-surface border-b border-bita-line px-8 py-6 flex items-center justify-between">
          <div>
            <div className="eyebrow">Reservar Mesa</div>
            <div className="font-display text-2xl text-bita-ink mt-1">
              N'a Bita · <span className="italic text-bita-gold">um lugar à mesa</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-10 h-10 border border-bita-line hover:border-bita-gold flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest2">
            <Step n={1} label="Data, hora e mesa" active={step === 1} done={step > 1} />
            <span className="flex-1 h-px bg-bita-line" />
            <Step n={2} label="Os seus dados" active={step === 2} done={step > 2} />
            <span className="flex-1 h-px bg-bita-line" />
            <Step n={3} label="Confirmação" active={step === 3} done={false} />
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg text-bita-ink capitalize">{monthName}</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
                    disabled={monthOffset === 0}
                    className="w-9 h-9 border border-bita-line hover:border-bita-gold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Mês anterior"
                  >
                    <ArrowLeft size={14} />
                  </button>
                  <button
                    onClick={() => setMonthOffset((m) => Math.min(2, m + 1))}
                    disabled={monthOffset === 2}
                    className="w-9 h-9 border border-bita-line hover:border-bita-gold disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Mês seguinte"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
                  <div key={i} className="text-[10px] uppercase tracking-widest2 text-bita-muted text-center py-2">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((cell, i) => {
                  if (!cell.date) return <div key={i} />
                  const sel = selectedDate &&
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
                          ? 'text-bita-muted/40 cursor-not-allowed'
                          : sel
                          ? 'bg-bita-forest text-bita-cream'
                          : 'border border-bita-line hover:border-bita-gold hover:text-bita-gold text-bita-ink'
                      }`}
                    >
                      {cell.date.getDate()}
                    </button>
                  )
                })}
              </div>

              <p className="text-xs text-bita-muted mt-4 leading-relaxed">
                ⓘ Encerrado às segundas-feiras. A esplanada está sujeita às condições meteorológicas.
              </p>
            </div>

            <div className="md:col-span-2 md:border-l md:border-bita-line md:pl-8">
              <div className="flex items-center gap-2 mb-4">
                <Users size={14} className="text-bita-gold" />
                <span className="text-[11px] uppercase tracking-widest2 text-bita-muted">Pessoas</span>
              </div>
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPeople(n)}
                    className={`w-9 h-9 text-sm transition-colors ${
                      people === n ? 'bg-bita-gold text-white' : 'border border-bita-line hover:border-bita-gold'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPeople(8)}
                  className={`px-3 h-9 text-xs transition-colors ${
                    people > 6 ? 'bg-bita-gold text-white' : 'border border-bita-line hover:border-bita-gold'
                  }`}
                >
                  7+
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-bita-gold" />
                <span className="text-[11px] uppercase tracking-widest2 text-bita-muted">Hora</span>
              </div>

              {!selectedDate ? (
                <p className="text-sm text-bita-muted leading-relaxed">Selecione uma data no calendário.</p>
              ) : (
                <>
                  <div className="text-[10px] uppercase tracking-widest2 text-bita-muted mt-2 mb-1">Brunch / Almoço</div>
                  <div className="grid grid-cols-3 gap-1.5 mb-4">
                    {LUNCH_TIMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 text-sm transition-colors ${
                          selectedTime === t
                            ? 'bg-bita-forest text-bita-cream'
                            : 'border border-bita-line hover:border-bita-gold text-bita-ink'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest2 text-bita-muted mb-1">Lanche / Tarde</div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {DINNER_TIMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2 text-sm transition-colors ${
                          selectedTime === t
                            ? 'bg-bita-forest text-bita-cream'
                            : 'border border-bita-line hover:border-bita-gold text-bita-ink'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="px-8 py-8">
            <div className="max-w-md mx-auto">
              <div className="mb-8 p-5 bg-bita-panel border border-bita-line text-sm space-y-2">
                <div className="flex items-center gap-3 text-bita-ink">
                  <Calendar size={16} className="text-bita-gold" />
                  <span>
                    {selectedDate?.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })} · {selectedTime}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-bita-ink">
                  <Users size={16} className="text-bita-gold" />
                  <span>{people} {people === 1 ? 'pessoa' : 'pessoas'}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="eyebrow block mb-2">Nome *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-bita" placeholder="O seu nome" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="eyebrow block mb-2">Email *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-bita" placeholder="email@exemplo.com" />
                  </div>
                  <div>
                    <label className="eyebrow block mb-2">Telefone *</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-bita" placeholder="912 345 678" />
                  </div>
                </div>
                <div>
                  <label className="eyebrow block mb-2">Notas (opcional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="input-bita resize-none"
                    placeholder="Alergias, cadeira de bebé, esplanada se possível..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="px-8 py-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-bita-gold/10 flex items-center justify-center mb-8">
              <Check size={36} className="text-bita-gold" strokeWidth={1.5} />
            </div>
            <h3 className="font-display text-3xl italic text-bita-ink leading-tight">
              Mesa reservada.
            </h3>
            <p className="font-script text-2xl text-bita-gold mt-3">
              o coelho já guardou o seu lugar
            </p>
            <p className="mt-6 text-bita-body max-w-md mx-auto leading-relaxed">
              Enviámos a confirmação para <span className="font-medium text-bita-ink">{email}</span> — esperamos por si na R. Manuel Salgueiral 284.
            </p>

            <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 p-5 bg-bita-panel border border-bita-line text-sm">
              <span className="flex items-center gap-2 text-bita-ink">
                <Calendar size={14} className="text-bita-gold" />
                {selectedDate?.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })} · {selectedTime}
              </span>
              <span className="text-bita-muted">·</span>
              <span className="flex items-center gap-2 text-bita-ink">
                <Users size={14} className="text-bita-gold" /> {people} {people === 1 ? 'pessoa' : 'pessoas'}
              </span>
              <span className="text-bita-muted">·</span>
              <span className="flex items-center gap-2 text-bita-ink">
                <MapPin size={14} className="text-bita-gold" /> Vila Nova de Gaia
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-bita-surface border-t border-bita-line px-8 py-5 flex items-center justify-between">
          {step > 1 && step < 3 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="text-[12px] uppercase tracking-widest2 text-bita-muted hover:text-bita-gold inline-flex items-center gap-2 transition-colors"
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
              Confirmar Reserva <ArrowRight size={14} />
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
          done ? 'bg-bita-gold text-white' : active ? 'bg-bita-forest text-bita-cream' : 'bg-bita-panel text-bita-muted'
        }`}
      >
        {done ? <Check size={11} /> : n}
      </span>
      <span className={`hidden sm:inline ${active || done ? 'text-bita-ink' : 'text-bita-muted'}`}>{label}</span>
    </div>
  )
}

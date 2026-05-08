'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, MapPin, Sparkles, AlertCircle } from 'lucide-react'
import Modal from './modal'
import { useToast } from './toast-provider'
import { CONTACTS, STAFF } from '@/lib/data'
import { cn } from '@/lib/utils'

const ZONES = ['Mesa 2','Mesa 4','Mesa 8','Mesa Grande','Bar','Terraço','Lounge VIP','Sala Privada','Sala VIP']
const TIMES = ['18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30']
const OCCASIONS = ['—','Aniversário','Pedido de casamento','Jantar de negócios','Celebração','Evento especial','Outro']

interface Props {
  open: boolean
  onClose: () => void
  onCreated?: (booking: any) => void
}

export default function NewReservationModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    customer: '', email: '', phone: '',
    date: '', time: '20:00', pax: 2,
    zone: 'Mesa 4', occasion: '—',
    staff: 'Ana Lima', notes: '',
  })

  const set = (k: string, v: any) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = {...e}; delete n[k]; return n })
  }

  const contactSuggestions = form.customer.length > 1
    ? CONTACTS.filter(c => c.name.toLowerCase().includes(form.customer.toLowerCase())).slice(0,4)
    : []

  const fillContact = (c: typeof CONTACTS[0]) => {
    setForm(f => ({ ...f, customer: c.name, email: c.email, phone: c.phone }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.customer.trim()) e.customer = 'Nome obrigatório'
    if (!form.date) e.date = 'Data obrigatória'
    if (form.pax < 1) e.pax = 'Mínimo 1 pessoa'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const booking = {
      id: 'R' + Date.now(),
      customer: form.customer, date: form.date, time: form.time,
      pax: form.pax, zone: form.zone, occasion: form.occasion === '—' ? '' : form.occasion,
      status: 'Confirmed' as const, note: form.notes, paid: false,
      staff: form.staff, deposit: 0,
    }
    onCreated?.(booking)
    toast('success', 'Reserva criada!', `${form.customer} · ${form.date} às ${form.time}`)
    onClose()
    setStep(1)
    setForm({ customer:'', email:'', phone:'', date:'', time:'20:00', pax:2, zone:'Mesa 4', occasion:'—', staff:'Ana Lima', notes:'' })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Modal open={open} onClose={onClose} title="Nova Reserva" subtitle="Preencha os dados da reserva" size="lg">
      <div className="p-6">

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1,2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                step === s ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                : step > s  ? 'bg-emerald-500 text-white'
                :             'bg-slate-100 text-slate-400'
              )}>
                {step > s ? '✓' : s}
              </div>
              <span className={cn('text-sm font-medium', step === s ? 'text-slate-900' : 'text-slate-400')}>
                {s === 1 ? 'Cliente' : 'Detalhes'}
              </span>
              {s < 2 && <div className="w-8 h-px bg-slate-200 mx-1" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} className="space-y-5">
            {/* Customer autocomplete */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                Nome do cliente *
              </label>
              <input
                value={form.customer}
                onChange={e => set('customer', e.target.value)}
                placeholder="Pesquisar ou escrever nome..."
                className={cn(
                  'w-full px-4 py-3 text-sm border rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all',
                  errors.customer
                    ? 'border-rose-300 focus:ring-rose-200 bg-rose-50'
                    : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-400 bg-white'
                )}
              />
              {errors.customer && (
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-rose-600">
                  <AlertCircle className="w-3 h-3" />{errors.customer}
                </div>
              )}
              {/* Autocomplete dropdown */}
              {contactSuggestions.length > 0 && (
                <motion.div
                  initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  {contactSuggestions.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => fillContact(c)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                        <div className="text-xs text-slate-400">{c.tier} · {c.visits} visitas · €{c.spend.toLocaleString()}</div>
                      </div>
                      {c.allergies !== '—' && (
                        <span className="ml-auto text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                          ⚠️ Alergia
                        </span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email</label>
                <input value={form.email} onChange={e=>set('email',e.target.value)} type="email" placeholder="email@exemplo.com"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Telefone</label>
                <input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="9XX XXX XXX"
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"/>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => { const e = validate(); if (!e.customer) setStep(2); else setErrors(e) }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Continuar →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {/* Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3"/>Data *
                </label>
                <input type="date" min={today} value={form.date} onChange={e=>set('date',e.target.value)}
                  className={cn('w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white',
                    errors.date ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-400'
                  )}/>
                {errors.date && <div className="text-xs text-rose-600 mt-1">{errors.date}</div>}
              </div>
              {/* Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3 h-3"/>Hora
                </label>
                <select value={form.time} onChange={e=>set('time',e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                  {TIMES.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              {/* Pax */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Users className="w-3 h-3"/>Pessoas
                </label>
                <input type="number" min={1} max={50} value={form.pax} onChange={e=>set('pax',parseInt(e.target.value)||1)}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3"/>Zona
                </label>
                <select value={form.zone} onChange={e=>set('zone',e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                  {ZONES.map(z=><option key={z}>{z}</option>)}
                </select>
              </div>
              {/* Occasion */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3"/>Ocasião
                </label>
                <select value={form.occasion} onChange={e=>set('occasion',e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                  {OCCASIONS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Staff */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Staff responsável</label>
              <select value={form.staff} onChange={e=>set('staff',e.target.value)}
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                {STAFF.filter(s=>s.bookable).map(s=><option key={s.id}>{s.name} · {s.role}</option>)}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Notas / Pedidos especiais</label>
              <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} rows={3}
                placeholder="Alergias, pedidos especiais, decoração..."
                className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none bg-white placeholder:text-slate-400"/>
            </div>

            {/* Summary */}
            {form.customer && form.date && (
              <motion.div
                initial={{opacity:0,y:4}} animate={{opacity:1,y:0}}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Resumo</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                  <div><span className="text-slate-400">Cliente:</span> <span className="font-medium text-slate-800">{form.customer}</span></div>
                  <div><span className="text-slate-400">Data:</span> <span className="font-medium text-slate-800">{form.date} às {form.time}</span></div>
                  <div><span className="text-slate-400">Pax:</span> <span className="font-medium text-slate-800">{form.pax} pessoa(s)</span></div>
                  <div><span className="text-slate-400">Zona:</span> <span className="font-medium text-slate-800">{form.zone}</span></div>
                </div>
              </motion.div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button onClick={()=>setStep(1)} className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors">
                ← Voltar
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm shadow-emerald-200"
              >
                <Calendar className="w-4 h-4"/>Confirmar Reserva
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}

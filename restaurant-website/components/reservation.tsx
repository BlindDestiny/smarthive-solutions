'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function Reservation() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', date:'', time:'20:00', pax:'2', notes:'' })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputClass = "w-full bg-transparent border-b border-white/15 focus:border-gold/70 text-white placeholder-white/20 font-sans text-sm py-3 outline-none transition-colors duration-300"
  const labelClass = "block font-sans text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2"

  return (
    <section id="reservar" className="py-32 lg:py-44 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32 items-start">

          {/* Left info */}
          <div>
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">06</span>
              <span className="w-12 h-px bg-gold/40" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Reservas</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="font-serif font-light text-5xl md:text-6xl text-white mb-8"
            >
              Reserve a sua<br />
              <span className="text-gold italic">mesa</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-12 h-px bg-gold/40 mb-10"
            />

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {[
                { icon: '🕐', label: 'Horário', val: 'Terça a Domingo · 18h30 às 02h' },
                { icon: '📍', label: 'Morada',  val: 'Rua Augusta 142, 1100-053 Lisboa' },
                { icon: '📞', label: 'Telefone',val: '+351 21 123 4567' },
                { icon: '📧', label: 'Email',   val: 'reservas@thevenue.pt' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-sans text-[10px] tracking-widest uppercase text-white/25 mb-0.5">{item.label}</div>
                    <div className="font-sans text-white/70 text-sm">{item.val}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 p-6 border border-white/[0.07] bg-white/[0.02]"
            >
              <p className="font-sans text-white/40 text-sm leading-relaxed">
                Taxa de reserva de <span className="text-gold">€5/pessoa</span> — devolvida no valor do jantar.
                Cancelamento gratuito até 24h antes.
              </p>
            </motion.div>
          </div>

          {/* Right form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 border border-gold/40 rounded-full flex items-center justify-center mb-6">
                  <Check className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-serif text-3xl text-white mb-3">Pedido enviado!</h3>
                <p className="font-sans text-white/40 text-sm leading-relaxed max-w-xs">
                  Entraremos em contacto em menos de 2 horas para confirmar a sua reserva.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-8 font-sans text-[11px] tracking-[0.25em] uppercase text-gold/70 hover:text-gold transition-colors">
                  Nova reserva
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="O seu nome" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Telefone</label>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+351 9XX XXX XXX" className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>Data</label>
                    <input required type="date" value={form.date} onChange={e => set('date', e.target.value)}
                      className={inputClass} style={{ colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label className={labelClass}>Hora</label>
                    <select value={form.time} onChange={e => set('time', e.target.value)}
                      className={inputClass + ' cursor-pointer'} style={{ colorScheme: 'dark' }}>
                      {['18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30'].map(t => (
                        <option key={t} value={t} className="bg-[#0f0f0f]">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Número de pessoas</label>
                  <div className="flex gap-3 pt-1">
                    {['1','2','3','4','5','6','7','8+'].map(n => (
                      <button key={n} type="button" onClick={() => set('pax', n)}
                        className={`w-10 h-10 border font-sans text-sm transition-all duration-200 ${
                          form.pax === n
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-white/10 text-white/30 hover:border-white/30 hover:text-white/60'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Notas (opcional)</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                    placeholder="Alergénios, ocasião especial, pedidos especiais..." rows={3}
                    className={inputClass + ' resize-none'} />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="group relative w-full overflow-hidden border border-gold text-gold font-sans text-[11px] tracking-[0.3em] uppercase py-5 transition-colors duration-500 hover:text-black"
                >
                  <span className="absolute inset-0 bg-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                  <span className="relative">Confirmar Reserva</span>
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

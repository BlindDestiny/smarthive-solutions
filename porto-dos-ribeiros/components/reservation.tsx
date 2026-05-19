'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Clock, MapPin, Check, Wifi } from 'lucide-react'
import type { SiteContent } from '@/lib/content'

export default function Reservation({ content = {} }: { content?: SiteContent }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', date:'', time:'13:00', pax:'2', notes:'' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const phone     = content['contact.phone']          ?? '963 349 411'
  const address   = content['contact.address']        ?? 'Rua da Constituição 982, Porto'
  const addressZip= content['contact.address_zip']    ?? '4200-196 Porto'
  const hoursWeek = content['contact.hours_weekday']  ?? 'Dom–Qui: 07h–22h'
  const hoursWknd = content['contact.hours_weekend']  ?? 'Sex–Sáb: 07h–24h'
  const amenities = content['contact.amenities']      ?? 'Wi-Fi grátis · Esplanada · Vegetariano'
  const whatsappMsg= content['contact.whatsapp_msg']  ?? 'Olá! Gostaria de fazer uma reserva.'

  const inputClass = "w-full bg-transparent border-b border-white/15 focus:border-[#00a651] text-white placeholder-white/20 font-sans text-sm py-3 outline-none transition-colors duration-300"
  const labelClass = "block font-sans text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2"

  return (
    <section id="contacto" className="py-32 lg:py-44 bg-[#060c05]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-start">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="flex items-center gap-4 mb-6"
            >
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-[#00a651]">06</span>
              <span className="w-12 h-px bg-[#00a651]/40" />
              <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/30">Reservas & Contacto</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="font-serif font-bold text-5xl md:text-6xl text-white mb-8"
            >
              Venha jantar<br />
              <span className="text-[#00a651]">connosco</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-5 mb-10"
            >
              {[
                { icon: Clock,  label: 'Horário',    val: `${hoursWeek}  |  ${hoursWknd}`, sub: 'Não fechamos à tarde' },
                { icon: MapPin, label: 'Morada',     val: address,     sub: addressZip },
                { icon: Phone,  label: 'Telefone',   val: phone,       sub: 'Chamada ou WhatsApp' },
                { icon: Wifi,   label: 'Comodidades',val: amenities,   sub: '' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-[#00a651]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-[#00a651]" />
                  </div>
                  <div>
                    <div className="font-sans text-[10px] tracking-widest uppercase text-white/25 mb-0.5">{item.label}</div>
                    <div className="font-sans text-white/75 text-sm">{item.val}</div>
                    {item.sub && <div className="font-sans text-white/30 text-xs mt-0.5">{item.sub}</div>}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <a href="tel:963349411"
                className="flex items-center justify-center gap-2 bg-[#00a651] hover:bg-[#00c060] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-4 transition-all duration-300">
                <Phone className="w-4 h-4" /> Ligar agora
              </a>
              <a href="https://wa.me/351963349411?text=Olá! Gostaria de fazer uma reserva." target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#1ebe57] text-white font-sans text-[11px] tracking-[0.2em] uppercase px-6 py-4 transition-all duration-300">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-[#00a651] flex items-center justify-center mb-6">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-3xl font-bold text-white mb-3">Pedido enviado! 🇧🇷</h3>
                <p className="font-sans text-white/40 text-sm leading-relaxed max-w-xs">
                  Entraremos em contacto em breve para confirmar. Pode também ligar para 963 349 411.
                </p>
                <button onClick={() => setSubmitted(false)}
                  className="mt-8 font-sans text-[11px] tracking-[0.25em] uppercase text-[#00a651] hover:text-[#00c060] transition-colors">
                  Nova reserva
                </button>
              </motion.div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }} className="space-y-7">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="O seu nome" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Telefone / WhatsApp</label>
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
                      className={inputClass} style={{ colorScheme: 'dark' }}>
                      {['07:30','08:00','09:00','10:00','11:00','12:00','12:30','13:00','13:30','14:00','15:00','19:00','19:30','20:00','20:30','21:00','21:30','22:00','22:30','23:00'].map(t => (
                        <option key={t} value={t} className="bg-[#0a0f08]">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Número de pessoas</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['1','2','3','4','5','6','7','8','10+'].map(n => (
                      <button key={n} type="button" onClick={() => set('pax', n)}
                        className={`w-10 h-10 border font-sans text-sm transition-all duration-200 ${
                          form.pax === n ? 'border-[#00a651] bg-[#00a651]/15 text-[#00a651]' : 'border-white/10 text-white/30 hover:border-white/30'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Notas (opcional)</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
                    placeholder="Alergénios, aniversário, pedido especial..." rows={3}
                    className={inputClass + ' resize-none'} />
                </div>

                <motion.button type="submit"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="group relative w-full overflow-hidden bg-[#00a651] text-white font-sans text-[11px] tracking-[0.3em] uppercase py-5 transition-all duration-300 hover:bg-[#00c060]">
                  Enviar Pedido de Reserva
                </motion.button>

                <p className="font-sans text-white/20 text-xs text-center">
                  Ou contacte-nos directamente · 963 349 411
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

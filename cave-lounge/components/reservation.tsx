'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Check, ArrowRight } from 'lucide-react'

export default function Reservation() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', guests: '', occasion: '' })
  const [sent, setSent] = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const inputClass = "input-cave w-full px-4 py-3.5 rounded-none text-sm font-sans"
  const labelClass = "font-display text-[10px] tracking-[0.25em] uppercase text-cave-muted/70 mb-2 block"

  return (
    <section id="reservation" className="py-28 bg-cave-bg relative">
      <div className="absolute top-0 left-0 right-0 h-px divider-fire" />

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-[#e84800]/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left info */}
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="font-display text-[10px] tracking-[0.4em] text-[#e84800] uppercase block mb-4">
              Book Your Descent
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-display font-bold text-cave-text mb-6"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Reserve<br/><span className="text-[#e84800]">Your Table</span>
            </motion.h2>
            <p className="font-sans text-cave-muted leading-relaxed mb-10 max-w-sm">
              Tables fill fast on weekends. Secure yours and we'll confirm within 2 hours.
              Private cave bookings available for groups of 8+.
            </p>

            <div className="space-y-4 mb-10">
              {[
                { Icon: Phone,  label: 'Phone',    val: '+351 912 345 678',    href: 'tel:+351912345678' },
                { Icon: Mail,   label: 'Email',    val: 'hello@cavelounge.pt', href: 'mailto:hello@cavelounge.pt' },
                { Icon: MapPin, label: 'Location', val: 'Rua do Alecrim 45, Bairro Alto, Lisboa', href: '#' },
                { Icon: Clock,  label: 'Hours',    val: 'Thu–Sat 9pm–5am · Sun 7pm–11pm', href: '#' },
              ].map(c => (
                <a key={c.label} href={c.href}
                  className="flex items-center gap-4 group p-4 card-cave hover:border-[rgba(232,72,0,0.3)] transition-all duration-200">
                  <div className="w-9 h-9 flex items-center justify-center border border-[rgba(232,72,0,0.25)] text-[#e84800] flex-shrink-0">
                    <c.Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-display text-[9px] tracking-[0.3em] text-cave-muted/50 uppercase">{c.label}</div>
                    <div className="font-sans text-cave-text text-sm group-hover:text-[#ff6a00] transition-colors">{c.val}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="card-cave p-5">
              <div className="font-display text-cave-text text-xs tracking-wide mb-3">Our promise</div>
              {[
                'Confirmation within 2 hours',
                'Free cancellation up to 24h before',
                'Private cave available for groups',
                'Special occasion? Just let us know',
              ].map(g => (
                <div key={g} className="flex items-center gap-2.5 py-1.5">
                  <Check className="w-3.5 h-3.5 text-[#e84800] flex-shrink-0" />
                  <span className="font-sans text-cave-muted text-sm">{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="card-cave p-12 text-center">
                <div className="w-16 h-16 bg-[#e84800] flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-cave-text text-2xl mb-3">Reservation Received</h3>
                <p className="font-sans text-cave-muted text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                  We'll confirm your table within 2 hours. See you in the cave.
                </p>
                <button onClick={() => setSent(false)}
                  className="font-display text-[#e84800] hover:text-[#ff5500] text-xs tracking-widest uppercase transition-colors">
                  Make another booking
                </button>
              </motion.div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="card-cave p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+351 9XX XXX XXX" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" required value={form.date} onChange={e => set('date', e.target.value)}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Time</label>
                    <select required value={form.time} onChange={e => set('time', e.target.value)}
                      className={inputClass + ' cursor-pointer'}>
                      <option value="">Select time</option>
                      {['21:00','21:30','22:00','22:30','23:00','23:30','00:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Guests</label>
                  <div className="flex gap-2">
                    {['1–2','3–4','5–6','7–8','9+'].map(n => (
                      <button key={n} type="button" onClick={() => set('guests', n)}
                        className={`flex-1 py-3 text-xs font-display tracking-wide border transition-all duration-150 ${
                          form.guests === n
                            ? 'bg-[#e84800] border-[#e84800] text-white'
                            : 'border-[rgba(232,72,0,0.2)] text-cave-muted hover:border-[#e84800] hover:text-[#ff6a00]'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Special occasion (optional)</label>
                  <textarea value={form.occasion} onChange={e => set('occasion', e.target.value)}
                    placeholder="Birthday, anniversary, private event..." rows={3}
                    className={inputClass + ' resize-none'} />
                </div>

                <motion.button type="submit"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="group w-full flex items-center justify-center gap-2 bg-[#e84800] hover:bg-[#ff5500] text-white font-display text-xs tracking-[0.25em] uppercase py-4 transition-colors shadow-lg shadow-[rgba(232,72,0,0.25)]">
                  Confirm Reservation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>

                <p className="font-sans text-cave-muted/50 text-xs text-center tracking-wide">
                  Confirmed within 2 hours · Free cancellation 24h before
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

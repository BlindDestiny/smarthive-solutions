'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Check, ArrowRight } from 'lucide-react'

export default function Reservation() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', date:'', time:'', guests:'', occasion:'' })
  const [sent, setSent]   = useState(false)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const inputCls = "input-cave w-full px-5 py-4 text-sm tracking-wide"

  return (
    <section id="reservation" className="py-32 bg-[#050505] relative">
      <div className="absolute top-0 left-0 right-0 h-px divider-fire" />

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(232,72,0,0.05), transparent 70%)', filter: 'blur(40px)' }} />

      <div className="max-w-6xl mx-auto px-8 lg:px-16">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="font-display text-[9px] tracking-[0.5em] text-[#e84800] uppercase block mb-5">Reservations</span>
          <h2 className="font-display font-bold text-[#ede8e4]" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Descend With Us
          </h2>
          <div className="mt-5 mx-auto w-12 h-px bg-[#e84800]/50" />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Info */}
          <div>
            <p className="font-sans font-light text-white/30 leading-loose mb-12 text-sm tracking-wide max-w-sm">
              Tables fill fast on weekends. Secure yours and we'll confirm within 2 hours.
              Private cave bookings available for groups of 8 or more.
            </p>

            <div className="space-y-3 mb-12">
              {[
                { Icon: Phone,  label: 'Phone',    val: '+351 912 345 678',           href: 'tel:+351912345678' },
                { Icon: Mail,   label: 'Email',    val: 'hello@cavelounge.pt',         href: 'mailto:hello@cavelounge.pt' },
                { Icon: MapPin, label: 'Location', val: 'Rua do Alecrim 45, Lisboa',  href: '#' },
                { Icon: Clock,  label: 'Hours',    val: 'Thu–Sat 9pm–5am · Sun 7–11pm', href: '#' },
              ].map(c => (
                <a key={c.label} href={c.href}
                  className="flex items-center gap-4 glass py-4 px-5 hover:border-[rgba(232,72,0,0.2)] transition-all duration-300 group">
                  <c.Icon className="w-4 h-4 text-[#e84800]/50 flex-shrink-0 group-hover:text-[#e84800] transition-colors" />
                  <div>
                    <div className="font-display text-[8px] tracking-[0.35em] text-white/20 uppercase mb-0.5">{c.label}</div>
                    <div className="font-sans font-light text-white/50 text-sm group-hover:text-white/80 transition-colors">{c.val}</div>
                  </div>
                </a>
              ))}
            </div>

            <div className="glass p-6 space-y-3">
              <div className="font-display text-[9px] tracking-[0.35em] text-white/30 uppercase mb-4">Our Promise</div>
              {['Confirmation within 2 hours', 'Free cancellation 24h before', 'Private cave for groups 8+', 'Special occasions curated'].map(g => (
                <div key={g} className="flex items-center gap-3">
                  <Check className="w-3 h-3 text-[#e84800] flex-shrink-0" />
                  <span className="font-sans font-light text-white/35 text-sm">{g}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-strong p-14 text-center">
                <div className="w-14 h-14 bg-[#e84800] flex items-center justify-center mx-auto mb-8"
                  style={{ animation: 'subtlePulse 2s ease-in-out infinite' }}>
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-[#ede8e4] text-2xl tracking-wide mb-3">Reservation Received</h3>
                <p className="font-sans font-light text-white/30 text-sm leading-relaxed mb-10 max-w-xs mx-auto">
                  We'll confirm your table within 2 hours. See you in the cave.
                </p>
                <button onClick={() => setSent(false)}
                  className="font-display text-[9px] tracking-[0.3em] uppercase text-[#e84800]/60 hover:text-[#e84800] transition-colors">
                  Make another booking
                </button>
              </motion.div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true) }}
                className="glass-strong p-10 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-display text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-2">Name</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label className="font-display text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-2">Phone</label>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+351 9XX XXX XXX" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="font-display text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-2">Email</label>
                  <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="your@email.com" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-display text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-2">Date</label>
                    <input type="date" required value={form.date} onChange={e => set('date', e.target.value)}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className="font-display text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-2">Time</label>
                    <select required value={form.time} onChange={e => set('time', e.target.value)}
                      className={inputCls + ' cursor-pointer'}>
                      <option value="">Select</option>
                      {['21:00','21:30','22:00','22:30','23:00','23:30','00:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="font-display text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-3">Guests</label>
                  <div className="flex gap-2">
                    {['1–2','3–4','5–6','7–8','9+'].map(n => (
                      <button key={n} type="button" onClick={() => set('guests', n)}
                        className={`flex-1 py-3.5 text-[10px] font-display tracking-wide transition-all duration-200 ${
                          form.guests === n
                            ? 'bg-[#e84800] text-white'
                            : 'glass text-white/25 hover:text-white/60 hover:border-[rgba(232,72,0,0.2)]'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="font-display text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-2">Occasion (optional)</label>
                  <textarea value={form.occasion} onChange={e => set('occasion', e.target.value)}
                    placeholder="Birthday, anniversary, private event..." rows={3}
                    className={inputCls + ' resize-none'} />
                </div>

                <motion.button type="submit"
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="group w-full flex items-center justify-center gap-3 bg-[#e84800] hover:bg-[#ff5500] text-white font-display text-[10px] tracking-[0.3em] uppercase py-5 transition-colors duration-300">
                  Confirm Reservation
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <p className="font-sans font-light text-white/15 text-[10px] text-center tracking-widest uppercase">
                  Confirmed in 2h · Free cancellation
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

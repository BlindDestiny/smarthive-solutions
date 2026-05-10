'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Clock, Calendar } from 'lucide-react'

const EVENTS = [
  {
    day: 'Thursday', tag: 'Weekly',
    title: 'Jazz & Bourbon Night',
    desc: 'Live jazz quartet from 9pm. Curated bourbon selection with expert-guided tastings. Intimate and soulful.',
    time: '9:00 PM – 2:00 AM',
    img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=85&auto=format&fit=crop',
  },
  {
    day: 'Friday', tag: 'Weekly',
    title: 'Underground Sessions',
    desc: 'Resident DJs spin deep house and techno in the lower cave. The city disappears. Only the music remains.',
    time: '10:00 PM – 4:00 AM',
    img: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=700&q=85&auto=format&fit=crop',
  },
  {
    day: 'Saturday', tag: 'Featured',
    title: 'Cave Saturdays',
    desc: 'Our flagship night. Guest DJs from across Europe, exclusive cocktail menus and a crowd that knows how to move.',
    time: '10:00 PM – 5:00 AM',
    img: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=700&q=85&auto=format&fit=crop',
    featured: true,
  },
  {
    day: 'Sunday', tag: 'Monthly',
    title: 'Secret Sessions',
    desc: 'First Sunday of every month. Invite-only acoustic sets in the inner cave. Whiskey, vinyl and conversation.',
    time: '7:00 PM – 11:00 PM',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&q=85&auto=format&fit=crop',
  },
]

export default function Events() {
  return (
    <section id="events" className="py-32 bg-[#080606] relative">
      <div className="absolute top-0 left-0 right-0 h-px divider-fire" />

      <div className="max-w-6xl mx-auto px-8 lg:px-16">

        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="font-display text-[9px] tracking-[0.5em] text-[#e84800] uppercase block mb-5">
            What&apos;s On
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display font-bold text-[#ede8e4]"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}>
            Nights in the Cave
          </motion.h2>
          <div className="mt-5 mx-auto w-12 h-px bg-[#e84800]/50" />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {EVENTS.map((ev, i) => (
            <motion.div key={ev.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden cursor-pointer ${
                ev.featured ? 'md:col-span-2 md:grid md:grid-cols-2' : ''
              }`}
              style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2 }}
            >
              <div className={`relative overflow-hidden ${ev.featured ? 'aspect-[16/9] md:aspect-auto' : 'aspect-[16/9]'}`}>
                <Image src={ev.img} alt={ev.title} fill
                  className="object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080606] via-[#080606]/25 to-transparent" />
                {ev.featured && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#080606] hidden md:block" />
                )}
                <div className="absolute top-4 left-4">
                  <span className={`font-display text-[9px] tracking-[0.3em] uppercase px-3 py-1.5 ${
                    ev.featured
                      ? 'bg-[#e84800] text-white'
                      : 'border border-[rgba(232,72,0,0.4)] text-[#e84800]'
                  }`}>
                    {ev.tag}
                  </span>
                </div>
              </div>

              <div className={`p-7 bg-[#080606] ${ev.featured ? 'flex flex-col justify-center' : ''}`}>
                <div className="font-display text-[#e84800]/50 text-[9px] tracking-[0.35em] uppercase mb-2">{ev.day}</div>
                <h3 className="font-display text-[#ede8e4] text-lg mb-3 group-hover:text-[#ff6a00] transition-colors duration-300">{ev.title}</h3>
                <p className="font-sans font-light text-white/45 text-sm leading-relaxed mb-4">{ev.desc}</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#e84800]/50 flex-shrink-0" />
                  <span className="font-sans font-light text-white/40 text-xs tracking-wide">{ev.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12">
          <a href="#reservation"
            className="inline-flex items-center gap-2.5 border border-[rgba(232,72,0,0.35)] text-[#e84800] font-display text-[10px] tracking-[0.22em] uppercase px-9 py-4 hover:bg-[#e84800] hover:text-white transition-all duration-300">
            <Calendar className="w-3.5 h-3.5" />
            Reserve for an Event
          </a>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px divider-subtle" />
    </section>
  )
}

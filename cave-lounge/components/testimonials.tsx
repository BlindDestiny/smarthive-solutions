'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const REVIEWS = [
  { name: 'Alex M.',      role: 'Regular',              stars: 5, text: 'The Cave Fire cocktail is the best drink I\'ve had in years. The atmosphere is incomparable — dark, warm and completely immersive.' },
  { name: 'Sarah K.',     role: 'Visited from London',  stars: 5, text: 'Stumbled in on a Thursday for Jazz Night and ended up staying till closing. The bartenders know their craft inside out.' },
  { name: 'Marco R.',     role: 'Cocktail enthusiast',  stars: 5, text: 'Every cocktail tells a story. The Underground Sessions on Fridays hit different — the music selection is impeccable.' },
  { name: 'Joana L.',     role: 'Birthday celebration', stars: 5, text: 'Booked the inner cave for my birthday — the team went above and beyond. The private experience was unforgettable.' },
  { name: 'Tom & Claire', role: 'Date night',           stars: 5, text: 'The perfect date spot. Candlelight, great music, incredible cocktails. We\'ve already booked our next visit.' },
  { name: 'Diogo F.',     role: 'Local regular',        stars: 5, text: 'Cave Saturdays are unmatched in this city. The Ember & Ash cocktail is my ritual every single week.' },
  { name: 'Priya S.',     role: 'Whiskey lover',        stars: 5, text: 'Their Macallan and Blanton\'s selection is top tier. Staff knowledge is impressive — real passion behind the bar.' },
  { name: 'Lena H.',      role: 'First visit',          stars: 5, text: 'Walked past the door three times before I found the entrance. The mystery is part of the charm. Don\'t miss it.' },
]
const ROW2 = [...REVIEWS].reverse()

function Card({ r }: { r: typeof REVIEWS[0] }) {
  return (
    <div className="flex-shrink-0 w-[300px] card-cave rounded-sm p-6 mx-3 hover:border-[rgba(232,72,0,0.3)] transition-all duration-300 whitespace-normal">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: r.stars }).map((_, i) => (
          <Star key={i} className="w-3 h-3 text-[#e84800] fill-[#e84800]" />
        ))}
      </div>
      <p className="font-sans text-cave-muted text-sm leading-relaxed mb-4 break-words">"{r.text}"</p>
      <div>
        <div className="font-display text-cave-text text-xs tracking-wide">{r.name}</div>
        <div className="font-sans text-cave-muted/50 text-xs mt-0.5">{r.role}</div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-28 bg-cave-warm overflow-hidden">
      <div className="absolute left-0 right-0 h-px divider-fire" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="font-display text-[10px] tracking-[0.4em] text-[#e84800] uppercase block mb-4">
              Word of Mouth
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-display font-bold text-cave-text" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
              Those who entered<br/>keep coming back
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="card-cave rounded-sm px-6 py-4 flex items-center gap-4">
            <div className="text-center">
              <div className="font-display font-bold text-[#e84800] text-3xl glow-text">4.9</div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-[#e84800] fill-[#e84800]" />)}
              </div>
            </div>
            <div className="w-px h-8 bg-[rgba(232,72,0,0.2)]" />
            <div>
              <div className="font-display text-cave-text text-sm">342 reviews</div>
              <div className="font-sans text-cave-muted text-xs">Google · TripAdvisor</div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="overflow-hidden mb-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...REVIEWS, ...REVIEWS].map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
      <div className="overflow-hidden">
        <div className="flex animate-marquee2 whitespace-nowrap">
          {[...ROW2, ...ROW2].map((r, i) => <Card key={i} r={r} />)}
        </div>
      </div>
    </section>
  )
}

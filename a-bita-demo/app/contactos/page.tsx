import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import ReservationButton from '@/components/reservation-button'
import { MapPin, Phone, Mail, Clock, ArrowRight, Calendar, Instagram, Facebook } from 'lucide-react'
import { restaurant, hours } from '@/lib/content'

export const metadata = {
  title: 'Contactos — A Bita · Vila Nova de Gaia',
  description: 'Reserve mesa, encomende take-away ou venha visitar-nos na R. Manuel Salgueiral 284, Vila Nova de Gaia.',
}

export default function Contactos() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Visite-nos"
        title="Onde nos"
        script="encontra"
        description="Estamos na R. Manuel Salgueiral 284, em Vila Nova de Gaia — abertos de terça a domingo. Para reservas, take-away ou encomendas, contacte-nos por telefone, WhatsApp ou email."
      />

      {/* Map + contact info */}
      <section className="section bg-bita-bg">
        <div className="container-bita grid grid-cols-1 lg:grid-cols-2 gap-px bg-bita-line border border-bita-line">
          {/* Map */}
          <div className="bg-bita-surface relative overflow-hidden min-h-[400px]">
            <iframe
              title="Mapa da A Bita"
              src={`https://maps.google.com/maps?q=${restaurant.mapsQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 400, filter: 'grayscale(0.3) contrast(1.05)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info card */}
          <div className="bg-bita-surface p-10 md:p-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">A Bita · Gaia</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl italic text-bita-ink leading-tight mb-8">
              Um café com história,
              <span className="block font-script not-italic text-bita-gold text-4xl md:text-5xl">à sua espera</span>
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-bita-line flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-bita-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-1">Morada</div>
                  <div className="text-bita-ink leading-relaxed">
                    {restaurant.addressShort}<br />
                    {restaurant.postal}
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${restaurant.mapsQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-[11px] uppercase tracking-widest2 text-bita-gold hover:text-bita-forest transition-colors"
                  >
                    Abrir no Google Maps <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              <a href={`tel:${restaurant.phoneTel}`} className="flex items-start gap-4 group">
                <div className="w-11 h-11 border border-bita-line group-hover:border-bita-gold flex items-center justify-center shrink-0 transition-colors">
                  <Phone size={16} className="text-bita-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-1">Reservas & take-away</div>
                  <div className="text-bita-ink font-medium group-hover:text-bita-gold transition-colors">
                    {restaurant.phoneDisplay}
                  </div>
                </div>
              </a>

              <a href={`mailto:${restaurant.email}`} className="flex items-start gap-4 group">
                <div className="w-11 h-11 border border-bita-line group-hover:border-bita-gold flex items-center justify-center shrink-0 transition-colors">
                  <Mail size={16} className="text-bita-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-1">Email</div>
                  <div className="text-bita-ink font-medium group-hover:text-bita-gold transition-colors">
                    {restaurant.email}
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-bita-line flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-bita-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-2">Horário</div>
                  <ul className="space-y-1 text-sm max-w-xs">
                    {hours.map((h) => (
                      <li key={h.day} className="flex items-center justify-between gap-4">
                        <span className="text-bita-muted">{h.day}</span>
                        <span className={`tabular-nums ${h.closed ? 'text-bita-muted/50' : 'text-bita-ink'}`}>
                          {h.open}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Social */}
              <div className="pt-6 border-t border-bita-line flex items-center gap-4">
                <span className="eyebrow">Siga-nos</span>
                <a href="https://instagram.com/abita" aria-label="Instagram" className="text-bita-muted hover:text-bita-gold transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://facebook.com/abita" aria-label="Facebook" className="text-bita-muted hover:text-bita-gold transition-colors">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reserve CTA + form */}
      <section className="section bg-bita-surface">
        <div className="container-bita grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">Reservar mesa</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl italic text-bita-ink leading-tight">
              Há uma mesa<br />
              <span className="font-script not-italic text-bita-gold text-5xl md:text-6xl">para si</span>
            </h2>
            <p className="mt-6 text-bita-body/85 leading-relaxed">
              Para grupos até 6 pessoas, pode reservar em segundos online.
              Para grupos maiores ou eventos privados, ligue-nos diretamente.
            </p>

            <div className="mt-8 p-6 bg-bita-forest text-bita-cream">
              <div className="flex items-start gap-4">
                <Calendar size={20} className="text-bita-goldLight mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="font-display text-lg leading-tight italic">
                    Reserve em segundos
                  </div>
                  <p className="text-xs text-bita-cream/65 mt-2 leading-relaxed">
                    Escolha a data, hora e número de pessoas. Confirmação imediata.
                  </p>
                </div>
              </div>
              <ReservationButton label="Reservar Mesa" variant="cream" className="w-full justify-center mt-5" />
            </div>
          </div>

          <div className="lg:col-span-7">
            <form className="bg-bita-bg border border-bita-line p-10 md:p-14 space-y-8">
              <h3 className="font-display text-2xl italic text-bita-ink">
                Ou envie-nos uma mensagem
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="eyebrow block mb-2">Nome *</label>
                  <input type="text" required className="input-bita" placeholder="O seu nome" />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Telefone *</label>
                  <input type="tel" required className="input-bita" placeholder="912 345 678" />
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Email *</label>
                  <input type="email" required className="input-bita" placeholder="email@exemplo.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Assunto</label>
                  <select className="input-bita">
                    <option>Reserva</option>
                    <option>Take-away ou entrega</option>
                    <option>Encomenda de bolo</option>
                    <option>Evento privado</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Mensagem *</label>
                  <textarea
                    required
                    rows={5}
                    className="input-bita resize-none"
                    placeholder="Conte-nos como o podemos ajudar..."
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <input type="checkbox" required className="mt-1 accent-bita-gold" />
                <p className="text-xs text-bita-muted leading-relaxed">
                  Autorizo o tratamento dos meus dados pessoais para resposta a este pedido.
                </p>
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                Enviar Mensagem
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

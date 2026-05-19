import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import QuoteButton from '@/components/quote-button'
import { MapPin, Phone, Mail, Clock, ArrowRight, Instagram, Facebook } from 'lucide-react'
import { company } from '@/lib/content'

export const metadata = {
  title: 'Contactos — Rogério Custódio · Estoi · Faro',
  description: 'Visite a nossa oficina em Estoi (Faro), ligue-nos, ou peça orçamento online. Carpintaria por medida ao serviço de todo o Algarve.',
}

export default function Contactos() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Falar Connosco"
        title="Onde nos"
        italic="encontra."
        description="A nossa oficina e mostruário ficam em Estoi, no concelho de Faro. Recebemos clientes mediante marcação prévia para conhecer materiais, ver trabalho em produção e discutir projetos."
      />

      {/* Map + info */}
      <section className="section bg-rc-bg">
        <div className="container-rc grid grid-cols-1 lg:grid-cols-2 gap-px bg-rc-line border border-rc-line">
          {/* Map */}
          <div className="bg-rc-surface min-h-[480px] relative">
            <iframe
              title="Mapa Rogério Custódio"
              src={`https://maps.google.com/maps?q=${company.mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 480, filter: 'grayscale(0.5) contrast(1.05)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Info */}
          <div className="bg-rc-surface p-10 md:p-14">
            <div className="flex items-center gap-3 mb-5">
              <span className="rule" />
              <span className="eyebrow">Oficina · Estoi</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-rc-ink leading-[1.05]">
              Onde a madeira
              <span className="block italic text-rc-gold">ganha forma.</span>
            </h2>

            <div className="mt-10 space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-rc-line flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-rc-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-1">Morada</div>
                  <div className="text-rc-ink leading-relaxed">{company.address}</div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${company.mapsQuery}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-[11px] uppercase tracking-widest3 text-rc-gold hover:text-rc-ink transition-colors"
                  >
                    Abrir no Google Maps <ArrowRight size={12} />
                  </a>
                </div>
              </div>

              <a href={`tel:${company.phoneTel}`} className="flex items-start gap-4 group">
                <div className="w-11 h-11 border border-rc-line group-hover:border-rc-gold flex items-center justify-center shrink-0 transition-colors">
                  <Phone size={16} className="text-rc-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-1">Telefone</div>
                  <div className="text-rc-ink font-medium group-hover:text-rc-gold transition-colors">
                    {company.phoneDisplay}
                  </div>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-rc-line flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-rc-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-1">Email</div>
                  <ul className="space-y-1">
                    {company.emails.map((em) => (
                      <li key={em.address} className="text-sm">
                        <a href={`mailto:${em.address}`} className="text-rc-ink hover:text-rc-gold transition-colors">
                          {em.address}
                        </a>
                        <span className="text-rc-muted ml-2 text-xs">· {em.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 border border-rc-line flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-rc-gold" />
                </div>
                <div>
                  <div className="eyebrow mb-2">Horário</div>
                  <ul className="space-y-1 text-sm max-w-xs">
                    {company.hours.map((h) => (
                      <li key={h.day} className="flex items-center justify-between gap-4">
                        <span className="text-rc-muted">{h.day}</span>
                        <span className={`tabular-nums text-right ${h.closed ? 'text-rc-muted/50' : 'text-rc-ink'}`}>
                          {h.morning}
                          {h.afternoon && <span className="block text-xs text-rc-muted">{h.afternoon}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-rc-line flex items-center gap-4">
                <span className="eyebrow">Siga-nos</span>
                <a href="https://instagram.com/rogeriocustodio.faro" aria-label="Instagram" className="text-rc-muted hover:text-rc-gold transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://facebook.com/rogeriocustodio.faro" aria-label="Facebook" className="text-rc-muted hover:text-rc-gold transition-colors">
                  <Facebook size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote CTA section */}
      <section className="section bg-rc-surface">
        <div className="container-rc grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <span className="rule" />
              <span className="eyebrow">Orçamento online</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]">
              Conte-nos
              <span className="italic text-rc-gold"> o que tem em mente.</span>
            </h2>
            <p className="mt-6 text-rc-body leading-relaxed">
              Em 3 passos rápidos descreve-nos o projeto, o orçamento estimado e o prazo desejado.
              Respondemos com uma proposta inicial dentro de 24 horas úteis.
            </p>

            <div className="mt-10">
              <QuoteButton variant="primary">
                Iniciar pedido <ArrowRight size={14} />
              </QuoteButton>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form className="bg-rc-bg border border-rc-line p-10 md:p-14 space-y-7">
              <h3 className="font-display text-2xl italic text-rc-ink">
                Ou envie-nos uma mensagem directa
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="eyebrow block mb-2">Nome *</label>
                  <input type="text" required className="input-rc" placeholder="O seu nome" />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Telefone *</label>
                  <input type="tel" required className="input-rc" placeholder="9XX XXX XXX" />
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Email *</label>
                  <input type="email" required className="input-rc" placeholder="email@exemplo.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Assunto</label>
                  <select className="input-rc">
                    <option>Pedido de orçamento</option>
                    <option>Restauro / projeto especial</option>
                    <option>Visita à oficina</option>
                    <option>Parceria (arquitetos/decoradores)</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Mensagem *</label>
                  <textarea required rows={5} className="input-rc resize-none"
                    placeholder="Descreva o seu projeto, dimensões aproximadas, prazo..." />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <input type="checkbox" required className="mt-1 accent-rc-gold" />
                <p className="text-xs text-rc-muted leading-relaxed">
                  Autorizo o tratamento dos meus dados pessoais para resposta a este pedido,
                  conforme a Política de Privacidade.
                </p>
              </div>

              <button type="submit" className="btn-primary w-full justify-center">
                Enviar mensagem
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

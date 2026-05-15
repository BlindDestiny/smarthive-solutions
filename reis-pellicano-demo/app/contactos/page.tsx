import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import BookingButton from '@/components/booking-button'
import { MapPin, Phone, Mail, Clock, ArrowRight, Calendar } from 'lucide-react'
import { firm, offices } from '@/lib/content'

export const metadata = {
  title: 'Contactos — Reis & Pellicano',
  description: 'Três escritórios em Portugal: Lisboa, Porto e Faro. Contacte-nos por telefone, email ou marque uma consulta online.',
}

export default function Contactos() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="Fale Connosco"
        title="Três cidades."
        italic="Um só interlocutor."
        description="Atendemos presencialmente em Lisboa, Porto e Faro. Para questões urgentes, contacte-nos pelo telefone ou agende uma consulta online."
      />

      {/* Offices grid with embedded maps */}
      <section className="section bg-white">
        <div className="container-rp">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-rp-line border border-rp-line">
            {offices.map((office) => (
              <div key={office.city} className="bg-white">
                <div className="aspect-[4/3] bg-rp-panel relative overflow-hidden">
                  <iframe
                    title={`Mapa do escritório ${office.city}`}
                    src={`https://maps.google.com/maps?q=${office.mapsQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.4) contrast(1.05)' }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="p-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="gold-rule" />
                    <span className="eyebrow">Escritório</span>
                  </div>

                  <h2 className="font-display text-3xl text-rp-ink mb-6">
                    {office.city}
                  </h2>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-rp-gold mt-0.5 shrink-0" />
                      <div className="text-rp-body leading-relaxed">
                        {office.street}<br />
                        {office.postal}<br />
                        <span className="text-rp-muted text-xs">{office.region}</span>
                      </div>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${office.mapsQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-rp-gold hover:text-rp-ink transition-colors"
                    >
                      Abrir no Google Maps <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form + general info */}
      <section className="section bg-rp-panel">
        <div className="container-rp grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="gold-rule" />
              <span className="eyebrow">Informações Gerais</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-rp-ink leading-tight">
              Estamos disponíveis<br />
              <span className="italic text-rp-gold">para si.</span>
            </h2>
            <p className="mt-6 text-rp-body/85 leading-relaxed">
              Envie-nos as suas questões e a nossa equipa irá contactá-lo dentro
              de 24 horas úteis para avaliar as suas necessidades.
            </p>

            <div className="mt-8 p-6 bg-rp-ink text-white">
              <div className="flex items-start gap-4">
                <Calendar size={20} className="text-rp-gold mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="font-display text-lg leading-tight">
                    Prefere agendar diretamente?
                  </div>
                  <p className="text-xs text-white/65 mt-2 leading-relaxed">
                    Escolha data e hora numa primeira consulta de 30 minutos — videochamada ou presencial.
                  </p>
                </div>
              </div>
              <BookingButton label="Agendar Online" variant="light" className="w-full justify-center mt-5" />
            </div>

            <div className="mt-10 space-y-5 border-t border-rp-line pt-8">
              <a
                href={`tel:${firm.phoneTel}`}
                className="flex items-center gap-4 hover:text-rp-gold transition-colors group"
              >
                <div className="w-11 h-11 border border-rp-line group-hover:border-rp-gold flex items-center justify-center transition-colors">
                  <Phone size={16} className="text-rp-gold" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest2 text-rp-muted">Telefone</div>
                  <div className="text-rp-ink font-medium mt-0.5">{firm.phoneDisplay}</div>
                </div>
              </a>

              <a
                href={`mailto:${firm.email}`}
                className="flex items-center gap-4 hover:text-rp-gold transition-colors group"
              >
                <div className="w-11 h-11 border border-rp-line group-hover:border-rp-gold flex items-center justify-center transition-colors">
                  <Mail size={16} className="text-rp-gold" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest2 text-rp-muted">Email</div>
                  <div className="text-rp-ink font-medium mt-0.5">{firm.email}</div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 border border-rp-line flex items-center justify-center">
                  <Clock size={16} className="text-rp-gold" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest2 text-rp-muted">Horário</div>
                  <div className="text-rp-ink font-medium mt-0.5">
                    Segunda a Sexta<br />
                    <span className="text-rp-body text-sm font-normal">9h00 — 18h00 · Requer marcação prévia</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form className="bg-white border border-rp-line p-10 md:p-14 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="eyebrow block mb-2">Nome *</label>
                  <input type="text" required className="input-rp" placeholder="O seu nome completo" />
                </div>
                <div>
                  <label className="eyebrow block mb-2">Telefone</label>
                  <input type="tel" className="input-rp" placeholder="+351 91 234 5678" />
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Email *</label>
                  <input type="email" required className="input-rp" placeholder="email@exemplo.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Área de Interesse</label>
                  <select className="input-rp">
                    <option>Selecione uma área</option>
                    <option>Direito Imobiliário</option>
                    <option>Nacionalidade Portuguesa</option>
                    <option>Vistos Gold</option>
                    <option>Direito Fiscal</option>
                    <option>Direito do Trabalho e Empresarial</option>
                    <option>Compliance e Contratos</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="eyebrow block mb-2">Mensagem *</label>
                  <textarea
                    required
                    rows={5}
                    className="input-rp resize-none"
                    placeholder="Descreva brevemente a sua questão..."
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <input type="checkbox" required className="mt-1 accent-rp-gold" />
                <p className="text-xs text-rp-muted leading-relaxed">
                  Autorizo o tratamento dos meus dados pessoais para efeitos de
                  resposta a este pedido, conforme a Política de Privacidade.
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

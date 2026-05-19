import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import ContactCTA from '@/components/contact-cta'
import { Award, Hammer, Heart, MapPin } from 'lucide-react'
import { company } from '@/lib/content'

export const metadata = {
  title: 'Sobre — Rogério Custódio · Carpintaria por medida em Estoi',
  description: 'Carpintaria fundada em 2006 em Estoi (Faro). Conheça a equipa, a oficina e a metodologia por trás dos projetos que executamos.',
}

const values = [
  {
    icon: Hammer,
    title: 'Mestria do ofício',
    body: 'Cada projeto é executado por mestres carpinteiros com 15+ anos de experiência. Trabalho artesanal, com tempo, sem atalhos.',
  },
  {
    icon: Award,
    title: 'Materiais selecionados',
    body: 'Trabalhamos apenas com fornecedores certificados. MDF hidrófugo, folheados naturais europeus, ferragens premium.',
  },
  {
    icon: MapPin,
    title: 'Presença local',
    body: 'Oficina em Estoi, intervenção em todo o Algarve. Conhecemos o clima, as casas, os arquitetos e os fornecedores da região.',
  },
  {
    icon: Heart,
    title: 'Trabalho com alma',
    body: 'Não somos uma indústria. Somos uma equipa pequena que conhece cada cliente pelo nome e cada projeto pela história.',
  },
]

export default function Sobre() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="A Nossa História"
        title="Carpintaria"
        italic="com nome próprio."
        description="Fundada em 2006 em Estoi, a Rogério Custódio, Lda. é hoje uma referência da carpintaria personalizada no Algarve. O nosso ofício combina rigor técnico, materiais premium e atenção aos detalhes que fazem a diferença."
      />

      {/* Story */}
      <section className="section bg-rc-bg">
        <div className="container-rc grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6">
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=85')" }}
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="rule" />
              <span className="eyebrow">O início</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]">
              Em 2006,
              <span className="block italic text-rc-gold">abrimos portas em Estoi.</span>
            </h2>
            <div className="mt-10 space-y-5 text-rc-body leading-relaxed">
              <p>
                O nome <strong className="text-rc-ink">Rogério Custódio</strong> nasceu do compromisso de um mestre
                carpinteiro algarvio com o seu ofício: fazer mobiliário e carpintaria como se faz
                desde sempre — com tempo, com paciência, com olho para o detalhe.
              </p>
              <p>
                Quase 20 anos depois, somos uma equipa de carpinteiros, projetistas e instaladores
                que trabalha em conjunto com arquitetos, decoradores e clientes particulares por
                todo o Algarve. A nossa oficina em Estoi continua a ser o coração de tudo o que
                fazemos.
              </p>
              <p>
                Acreditamos que <strong className="text-rc-ink">um móvel bem feito é um investimento que dura décadas</strong> —
                e que cabe a nós escolher os materiais, dimensionar as peças e executar os
                acabamentos como se cada projeto fosse para a nossa própria casa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-rc-surface">
        <div className="container-rc">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="rule" />
              <span className="eyebrow">No que acreditamos</span>
              <span className="rule" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-rc-ink leading-[1.05]">
              Quatro princípios
              <span className="italic text-rc-gold"> que não negociamos.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-rc-line border border-rc-line">
            {values.map((v) => (
              <article key={v.title} className="bg-rc-surface p-10 text-center">
                <div className="w-14 h-14 mx-auto border border-rc-line flex items-center justify-center mb-6">
                  <v.icon size={20} className="text-rc-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl text-rc-ink leading-tight">{v.title}</h3>
                <p className="mt-4 text-sm text-rc-body leading-relaxed">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="bg-rc-graphite text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 wood-grain opacity-[0.12]" />
        <div className="container-rc relative text-center max-w-3xl mx-auto">
          <p className="font-display text-3xl md:text-4xl italic text-white/95 leading-snug">
            "Um móvel bem feito é silencioso —
            <span className="block text-rc-goldLight not-italic">não pede atenção, mas dura uma vida."</span>
          </p>
          <p className="mt-8 text-[11px] uppercase tracking-widest3 text-white/55">
            Filosofia da Casa
          </p>
        </div>
      </section>

      <ContactCTA />
      <Footer />
    </main>
  )
}

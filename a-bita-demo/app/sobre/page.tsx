import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import PageHero from '@/components/page-hero'
import CTA from '@/components/cta'
import FAQAccordion from '@/components/faq-accordion'
import { Heart, Sparkles, Home, Coffee } from 'lucide-react'
import { faqs } from '@/lib/content'

export const metadata = {
  title: 'Sobre — A Bita · História & País das Maravilhas',
  description: 'Conheça a história d\'a Bita — um café-restaurante familiar em Vila Nova de Gaia, com receitas caseiras e um pequeno País das Maravilhas à mesa.',
}

const values = [
  {
    icon: Home,
    title: 'Familiar',
    body: 'Não somos uma cadeia. Somos uma família que cozinha, serve e recebe — todos os dias, com a mesma calma.',
  },
  {
    icon: Heart,
    title: 'Caseiro',
    body: 'Tudo o que servimos é feito à mão, com receitas que vieram da nossa avó e que continuamos a aperfeiçoar.',
  },
  {
    icon: Sparkles,
    title: 'Mágico',
    body: 'O nosso País das Maravilhas é mais do que um tema — é a forma como queremos que cada visita seja recordada.',
  },
  {
    icon: Coffee,
    title: 'Genuíno',
    body: 'Ingredientes frescos, preços honestos e tempo para cada cliente. Sem atalhos, sem fingimentos.',
  },
]

export default function Sobre() {
  return (
    <main>
      <Navbar />
      <PageHero
        eyebrow="A nossa história"
        title="Um pequeno"
        script="país das maravilhas"
        description="No coração de Vila Nova de Gaia, abrimos as portas a quem quer pausar o dia, comer com calma e voltar à infância — uma garfada de cada vez."
      />

      {/* Story */}
      <section className="section bg-bita-bg">
        <div className="container-bita grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-6">
            <div
              className="aspect-[4/5] bg-cover bg-center"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80')" }}
            />
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">O início</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl italic text-bita-ink leading-tight">
              Começou
              <span className="block font-script not-italic text-bita-gold text-5xl md:text-6xl mt-2">como uma ideia simples</span>
            </h2>
            <div className="mt-8 space-y-5 text-bita-body leading-relaxed">
              <p>
                Cozinha caseira, bolos de sempre, um espaço onde se pudesse demorar — sem pressa.
                Quando inauguramos n'a Rua Manuel Salgueiral, percebemos que o que estávamos a
                construir era mais do que um café: era um pequeno refúgio com sabor de avó.
              </p>
              <p>
                Cedo descobrimos que os clientes traziam livros, ficavam horas, contavam histórias.
                Daí veio a ideia do <em>País das Maravilhas</em> — um tema que reflete o que sentimos
                aqui: tempo a passar de forma diferente, prazeres pequenos a ganharem importância.
              </p>
              <p>
                Hoje, sete anos depois, somos uma família alargada — clientes que regressam, equipa
                que cresceu connosco, e uma cozinha que continua a fazer tudo à mão.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-bita-surface">
        <div className="container-bita">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="gold-rule" />
              <span className="eyebrow">No que acreditamos</span>
              <span className="gold-rule" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl italic text-bita-ink leading-tight">
              Quatro coisas que
              <span className="font-script not-italic text-bita-gold ml-3">não negociamos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-bita-line border border-bita-line">
            {values.map((v) => (
              <article key={v.title} className="bg-bita-surface p-10 text-center">
                <div className="w-14 h-14 mx-auto rounded-full border border-bita-line flex items-center justify-center mb-6">
                  <v.icon size={20} className="text-bita-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl italic text-bita-ink">{v.title}</h3>
                <p className="mt-3 text-sm text-bita-body leading-relaxed">{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative quote band */}
      <section className="bg-bita-forest text-bita-cream py-20">
        <div className="container-bita text-center">
          <p className="font-script text-3xl md:text-5xl text-bita-goldLight max-w-3xl mx-auto leading-tight">
            "Aqui o tempo passa mais devagar — e o coelho nunca está com pressa."
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-widest2 text-bita-cream/60">
            Filosofia d'a Bita
          </p>
        </div>
      </section>

      <FAQAccordion faqs={faqs} />

      <CTA />
      <Footer />
    </main>
  )
}

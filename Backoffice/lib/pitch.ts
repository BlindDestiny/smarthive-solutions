/**
 * Cold-call pitch system — ported from legacy `01_PROSPEÇÃO/script/leads_ui.py`.
 *
 * Three pieces:
 *   1) detectBusinessType()   — keyword/category → LeadBusinessType enum
 *   2) Lookup maps            — labels, goals, hooks per vertical
 *   3) coldCallPitch()        — renders the 3-version script (V1 natural,
 *                                V2 direct, V3 consultative) + objections +
 *                                coaching block, with placeholders substituted
 *                                from the lead's actual data
 *
 * This is consumed by the speed-call dialog and the import script (which
 * needs to assign businessType when ingesting CSVs).
 */

import { LeadBusinessType } from "@prisma/client"

// ─────────────────────────────────────────────────────────────────
// 1) Vertical detection
// ─────────────────────────────────────────────────────────────────

export interface BusinessTypeInput {
  keyword?: string | null
  category?: string | null
  name?: string | null
}

const RULES: Array<{ type: LeadBusinessType; patterns: RegExp[] }> = [
  { type: LeadBusinessType.RESTAURANT, patterns: [
    /restaur/i, /caf[ée]/i, /\bbar\b/i, /tasca/i, /snack/i, /bistro/i,
    /pastelaria/i, /pizzar/i, /churrasq/i, /hamb[uú]rg/i,
  ]},
  { type: LeadBusinessType.PROFESSIONAL, patterns: [
    /cl[ií]nic/i, /dent/i, /m[ée]dic/i, /advogad/i, /lawyer/i, /not[áa]r/i,
    /psic[óo]log/i, /veterin/i,
  ]},
  { type: LeadBusinessType.REAL_ESTATE, patterns: [/imob/i, /real estate/i, /imobili/i] },
  { type: LeadBusinessType.BEAUTY, patterns: [
    /cabeleireiro/i, /sal[ãa]o/i, /salon/i, /est[ée]t/i, /barb/i, /spa\b/i,
    /unhas/i, /manicur/i,
  ]},
  { type: LeadBusinessType.GYM, patterns: [
    /gin[áa]s/i, /\bgym\b/i, /fitness/i, /pilates/i, /yoga/i, /crossfit/i,
  ]},
  { type: LeadBusinessType.AUTO, patterns: [/oficina/i, /\bauto\b/i, /stand/i, /mec[âa]n/i, /carros/i] },
  // Carpintaria BEFORE construction (more specific)
  { type: LeadBusinessType.CARPENTRY, patterns: [
    /carpint/i, /marcen/i, /carpinteir/i, /marceneir/i, /m[óo]veis por medida/i,
  ]},
  { type: LeadBusinessType.MOVING,  patterns: [/mudan[çc]/i, /moving/i, /transport/i] },
  { type: LeadBusinessType.LAUNDRY, patterns: [/lavandari/i, /tinturari/i, /lavagem/i] },
  { type: LeadBusinessType.CONSTRUCTION, patterns: [
    /constru[çc]/i, /construct/i, /obras/i, /reforma/i, /remodela/i,
    /canaliz/i, /eletric/i,
  ]},
  { type: LeadBusinessType.RETAIL, patterns: [
    /\bloja\b/i, /store/i, /\bshop\b/i, /com[ée]rcio/i, /comerc/i,
    /boutique/i, /supermerc/i,
  ]},
]

export function detectBusinessType(lead: BusinessTypeInput): LeadBusinessType {
  const haystack = [lead.keyword, lead.category, lead.name].filter(Boolean).join(" ")
  if (!haystack.trim()) return LeadBusinessType.DEFAULT
  for (const { type, patterns } of RULES) {
    if (patterns.some((p) => p.test(haystack))) return type
  }
  return LeadBusinessType.DEFAULT
}

// ─────────────────────────────────────────────────────────────────
// 2) Lookup maps — labels, goals, vertical hooks
// ─────────────────────────────────────────────────────────────────

export const VERTICAL_LABEL: Record<LeadBusinessType, string> = {
  RESTAURANT:   "Restauração",
  PROFESSIONAL: "Serviços profissionais",
  RETAIL:       "Comércio / Loja",
  REAL_ESTATE:  "Imobiliária",
  BEAUTY:       "Beleza / Estética",
  GYM:          "Ginásio / Fitness",
  AUTO:         "Automóvel",
  CONSTRUCTION: "Construção / Obras",
  CARPENTRY:    "Carpintaria / Marcenaria",
  MOVING:       "Mudanças / Transportes",
  LAUNDRY:      "Lavandaria",
  DEFAULT:      "Negócio local",
}

export const GOAL_BY_TYPE: Record<LeadBusinessType, string> = {
  RESTAURANT:   "mais reservas, pedidos de take-away e visitas",
  PROFESSIONAL: "mais marcações qualificadas e novos clientes",
  RETAIL:       "mais visitas à loja e vendas online",
  REAL_ESTATE:  "mais contactos de potenciais compradores e vendedores",
  BEAUTY:       "mais marcações de serviços e fidelização de clientes",
  GYM:          "mais inscrições e adesões a programas",
  AUTO:         "mais pedidos de orçamento e marcações",
  CONSTRUCTION: "mais pedidos de orçamento qualificados",
  CARPENTRY:    "mais pedidos de orçamento de obras à medida",
  MOVING:       "mais pedidos de orçamento de mudanças",
  LAUNDRY:      "mais clientes recorrentes e novos contactos",
  DEFAULT:      "mais contactos qualificados e pedidos de orçamento",
}

interface VerticalHook {
  ganchoV1:    string
  ganchoV3:    string
  insight:     string
  insightV3:   string
  diag:        string
}

export const VERTICAL_HOOKS: Record<LeadBusinessType, VerticalHook> = {
  RESTAURANT: {
    ganchoV1:  "Estava a ver quem aparece no Google quando alguém pesquisa onde jantar em {city}",
    ganchoV3:  "Tenho estado a olhar para a restauração em {city} numa análise que fazia",
    insight:   "A concorrência com menos qualidade está a apanhar reservas que vos deviam chegar — porque aparece primeiro no Maps",
    insightV3: "Têm {presence} — no setor restauração em {city}, isso é top 5% em reputação. Mas no Maps quem aparece primeiro nas pesquisas \"jantar perto de mim\" são casas com metade das vossas reviews",
    diag:      "Faz alguma ideia quantas reservas semanais vêm de quem vos encontrou no Google vs quem já vos conhecia?",
  },
  PROFESSIONAL: {
    ganchoV1:  "Estava a olhar para quem aparece quando alguém em {city} procura este serviço",
    ganchoV3:  "Tenho estado a analisar a presença online de serviços profissionais em {city}",
    insight:   "Os clientes pré-qualificados procuram primeiro a área específica online. Quem aparece bem, fecha. Quem não aparece, perde antes da primeira marcação",
    insightV3: "Têm {presence} — mas a forma como aparecem para quem procura serviços do vosso tipo em {city} não reflete essa reputação. Há clientes que precisam dos vossos serviços a contratar outros porque vos encontram tarde",
    diag:      "Dos clientes novos do último trimestre, sabe quantos vos descobriram através do Google?",
  },
  REAL_ESTATE: {
    ganchoV1:  "Andava a ver imobiliárias em {city} e a vossa apareceu logo",
    ganchoV3:  "Tenho estado a olhar para o mercado imobiliário em {city}",
    insight:   "Compradores filtram 80% das opções online antes de visitar. Quem capta a atenção DURANTE essa pesquisa, ganha o cliente. Quem aparece DEPOIS, perde-o",
    insightV3: "Têm {presence}. Mas a captação imobiliária hoje decide-se nos primeiros 3 minutos da pesquisa online — e a vossa visibilidade nessa janela específica está atrás de imobiliárias com menos histórico",
    diag:      "Quantos contactos novos chegam por semana de quem nunca tinha trabalhado convosco antes?",
  },
  BEAUTY: {
    ganchoV1:  "Hoje quem procura cabeleireiro ou estética em {city} pesquisa direto no Google Maps",
    ganchoV3:  "Tenho estado a olhar para o setor de beleza em {city}",
    insight:   "Quem aparece nas primeiras 3 posições do Maps com fotos atualizadas tem 3x mais marcações — e fotos antigas custam clientes silenciosamente",
    insightV3: "Têm {presence}. Mas o ponto onde se ganha ou perde a marcação é a ficha do Google Maps — galeria, horários, resposta a reviews. Vejo aí espaço para 30-40% mais marcações sem mais investimento em marketing",
    diag:      "Hoje as novas clientes vêm mais por recomendação ou por encontrarem-vos no Google?",
  },
  GYM: {
    ganchoV1:  "A captação online de novos sócios neste setor mudou muito nos últimos 12 meses",
    ganchoV3:  "Tenho estado a estudar a captação digital em ginásios em {city}",
    insight:   "Os ginásios que estão a crescer agora são os que captam por Instagram + Google reviews — não por flyers nem ofertas de fim de ano",
    insightV3: "Têm {presence}. Mas a métrica que importa para um ginásio em 2026 é taxa de conversão da pesquisa \"ginásio em {city}\" para visita ao espaço. E aí, vejo gap claro entre o que vocês valem e o que captam",
    diag:      "Os novos sócios que entram, vêm mais por amigos que já são sócios ou por procura direta no Google?",
  },
  AUTO: {
    ganchoV1:  "Estive a ver oficinas em {city} e como aparecem para quem precisa de serviço urgente",
    ganchoV3:  "Tenho estado a analisar a captação de orçamentos no setor automóvel em {city}",
    insight:   "Pedidos de orçamento começam quase sempre com pesquisa Google. Quem não tem ficha bem montada, não recebe a chamada — mesmo tendo melhor qualidade",
    insightV3: "Têm {presence}. Mas no momento de decisão — o cliente que rebenta uma peça à sexta — quem ganha o trabalho é quem aparece primeiro e responde em 30 minutos. Vejo aí onde estão a perder casos",
    diag:      "Quantos pedidos de orçamento entram por semana só pelo telefone direto, sem terem visto o vosso site primeiro?",
  },
  CONSTRUCTION: {
    ganchoV1:  "Estive a olhar para empresas de obras na vossa zona",
    ganchoV3:  "Tenho estado a analisar empresas de construção/remodelação em {city}",
    insight:   "Obras de €5k+ começam com 2-3 dias de research no Google. Sem portefólio digital claro, perde-se a obra antes do cliente saber que existem",
    insightV3: "Têm {presence}. Mas a obra adjudicada não decide-se na recomendação inicial — decide-se nos 2-3 dias em que o cliente verifica no Google quem é, o que fez, e se inspira confiança. Aí é onde têm gap",
    diag:      "Dos orçamentos que enviam, faz ideia da percentagem que se converte em obra? E em quantos dias responde a maioria?",
  },
  CARPENTRY: {
    ganchoV1:  "Estava a olhar para a vossa carpintaria, especificamente as {revs} reviews",
    ganchoV3:  "Tenho estado a olhar para carpintarias e marcenarias em {city}",
    insight:   "Quem procura carpintaria por medida hoje, encontra primeiro empresas mais novas com presença digital arrumada — não as que têm 20 anos de ofício",
    insightV3: "Têm {presence}. Mas o cliente que procura carpintaria por medida começa com pesquisa visual — \"ideias de cozinha em madeira\", \"roupeiros em carvalho\". Quem mostra trabalho real online ganha. Quem só tem reviews boas mas zero galeria, perde para empresas inferiores",
    diag:      "Quanto da vossa carteira atual veio por recomendação direta vs quem vos encontrou online primeiro?",
  },
  MOVING: {
    ganchoV1:  "Apanhei-vos numa pesquisa que estava a fazer — o setor de mudanças tem características muito particulares",
    ganchoV3:  "Tenho estado a estudar a captação digital em empresas de mudanças em {city}",
    insight:   "Quem decide uma mudança decide num fim-de-semana — e pesquisa numa quinta à noite. Quem aparece bem no domingo de manhã, ganha o orçamento de segunda",
    insightV3: "Têm {presence}. Mas a janela de decisão de uma mudança são 48-72h — e o cliente vai pedir 3-4 orçamentos. Quem aparece primeiro com confiança visual ganha 2 dos 3 casos. Vejo aí espaço claro para mais agendamentos",
    diag:      "Em média, quantos orçamentos pedem antes de fechar com vocês — e em quanto tempo decidem?",
  },
  LAUNDRY: {
    ganchoV1:  "Vi que a vossa lavandaria tem clientes de longa data — mas a aquisição de novos mudou completamente",
    ganchoV3:  "Tenho estado a olhar para o modelo de captação em lavandarias em {city}",
    insight:   "90% dos novos clientes hoje encontram-vos no Google Maps, não a passar à porta — e a forma como aparecem aí decide tudo",
    insightV3: "Têm {presence}. Mas a lavandaria moderna ganha clientes por dois canais: passantes do bairro (que diminui) e Google Maps + Instagram (que cresce). Vejo aí onde estão a perder o segundo canal",
    diag:      "Dos clientes novos que apareceram este mês, quantos vieram porque vos encontraram no Google?",
  },
  RETAIL: {
    ganchoV1:  "Os clientes hoje verificam a vossa presença online ANTES de irem à loja",
    ganchoV3:  "Tenho estado a olhar para o comércio local em {city}",
    insight:   "Quem aparece bem no Google decide se a loja física vale a deslocação — quem não aparece, perde a visita antes dela acontecer",
    insightV3: "Têm {presence}. Mas a visita à loja física hoje decide-se primeiro no telemóvel — quem não tem stock visível, horários claros e fotos atualizadas, perde o cliente antes de saber que existia",
    diag:      "Os clientes que entram pela primeira vez, sabem dizer onde vos viram primeiro?",
  },
  DEFAULT: {
    ganchoV1:  "Estava aqui a olhar para alguns negócios em {city} e o vosso saltou-me à vista",
    ganchoV3:  "Tenho estado a olhar para empresas em {city}",
    insight:   "A vossa concorrência mais visível tem MENOS reviews do que vocês — está-vos a passar à frente em visibilidade quando vocês têm mais autoridade",
    insightV3: "Têm {presence}. Mas a forma como aparecem para quem ainda não vos conhece está atrás de empresas com metade do vosso histórico. Há assimetria entre o que VALEM e o que MOSTRAM",
    diag:      "Dos clientes novos que entraram este mês, faz ideia quantos vos descobriram primeiro online?",
  },
}

// ─────────────────────────────────────────────────────────────────
// 3) Render — cold call pitch with all 3 versions + objections + coaching
// ─────────────────────────────────────────────────────────────────

export interface PitchLead {
  name?: string | null
  city?: string | null
  reviews?: number | null
  rating?: number | null
  businessType?: LeadBusinessType
  keyword?: string | null
  category?: string | null
}

function presencePhrase(lead: PitchLead): string {
  const revs = lead.reviews ?? 0
  const rating = lead.rating
  if (revs > 0 && rating != null) {
    return `${revs.toLocaleString("pt-PT")} avaliações com ${rating.toFixed(1)}★`
  }
  if (revs > 0) return `${revs.toLocaleString("pt-PT")} avaliações`
  return "uma presença forte no Google"
}

function fill(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
}

export function coldCallPitch(lead: PitchLead): string {
  const btype = lead.businessType
    ?? detectBusinessType({ keyword: lead.keyword, category: lead.category, name: lead.name })
  const label    = VERTICAL_LABEL[btype]
  const goal     = GOAL_BY_TYPE[btype]
  const hooks    = VERTICAL_HOOKS[btype]
  const name     = lead.name ?? "[NOME]"
  const city     = lead.city ?? "[CIDADE]"
  const revs     = lead.reviews != null ? lead.reviews.toLocaleString("pt-PT") : "—"
  const presence = presencePhrase(lead)
  const vars = { city, revs, presence }

  const ganchoV1  = fill(hooks.ganchoV1,  vars)
  const ganchoV3  = fill(hooks.ganchoV3,  vars)
  const insight   = fill(hooks.insight,   vars)
  const insightV3 = fill(hooks.insightV3, vars)
  const diag      = fill(hooks.diag,      vars)

  return `━━━ COLD CALL · ${name} ━━━

📊 CONTEXTO
   Cidade: ${city}   ·   Presença: ${presence}
   Vertical: ${label}   ·   Goal: ${goal}

⚡ ESCOLHE A VERSÃO PELO PERFIL DO INTERLOCUTOR
   V1 NATURAL    → -40 anos / gestão pelos filhos / casual
   V2 DIRETA     → quando não sabes a idade / aposta segura
   V3 CONSULTIVA → +45 anos / empresa tradicional 10+ anos

🚫 PROIBIDO na abertura:
   "website" · "serviços digitais" · "oferta" ·
   "quero vender" · "tenho uma solução"


╔═════════════════════════════════════════════════════╗
║  🟢 VERSÃO 1 — NATURAL · calmo, pausado, conversa   ║
╚═════════════════════════════════════════════════════╝

[01] ABERTURA — permission-based
  Tu: "Boa tarde... fala o Pedro da Smart Hive.
       Apanhei-o em má altura?"

  ⏸  PAUSA 2-3s. Não preencher o silêncio.

[02] DESARMAR — declarar que NÃO é venda
  Tu: "Vou ser claro consigo logo à partida — não estou
       a ligar para vender nada hoje.
       ${ganchoV1} e a ${name} saltou-me à vista.
       Posso fazer 30 segundos do seu tempo?"

[03] GANCHO DE CURIOSIDADE
  Tu: "Reparei numa coisa específica no caso da vossa
       empresa — ${presence} é raro neste setor. Mas há
       um detalhe que provavelmente está a fazer-vos
       perder pedidos sem se dar conta."

[04] INSIGHT
  Tu: "${insight}. Faz sentido o que estou a dizer?"

[05] PERGUNTA DIAGNÓSTICA — deixa-o falar
  Tu: "${diag}"

  ⏸  PAUSA — deixa-o pensar. Não cortes.

[06] FECHO — escolha A/B, nunca aberta
  Tu: "Olhe, não lhe quero tomar mais tempo agora. Faço
       uma proposta — eu já analisei a vossa presença
       online e tenho aqui duas ou três coisas concretas
       que vocês podiam ajustar sem gastar muito. Vale
       a pena 15 minutos numa conversa?
       Quinta de manhã ou sexta à tarde?"


╔═════════════════════════════════════════════════════╗
║  🟡 VERSÃO 2 — DIRETA · firme, profissional, segura ║
╚═════════════════════════════════════════════════════╝

[01] ABERTURA
  Tu: "Sr./Sra. [APELIDO]? Daqui Pedro Bicas, Smart Hive
       Solutions. Vou ser direto consigo — apanhei-o em
       má altura?"

[02] RISK REVERSAL
  Tu: "Compreendo. Peço-lhe 90 segundos — se no fim não
       fizer sentido, desligo eu próprio. Pode ser?"

[03] CONTEXTO + LOSS AVERSION
  Tu: "Trabalho com empresas locais em ${city} a melhorar
       a forma como aparecem para potenciais clientes.
       Vi o caso da vossa empresa, vi ${presence}, e ficou
       claro: têm uma reputação que a maioria do setor
       mata para ter. Mas há um problema específico, e
       quero gastar 15 minutos a explicar-lhe qual é."

[04] INSIGHT DURO
  Tu: "${insight}. Está-me a seguir?"

[05] DIAGNÓSTICA RÁPIDA
  Tu: "${diag}"

[06] FECHO
  Tu: "15 minutos esta semana. Apresento-vos um
       diagnóstico CONCRETO da vossa presença — feito a
       olhar para a vossa empresa, não genérico — e dou
       3 ações específicas que podem aplicar mesmo que
       não trabalhem comigo. Quinta às 10h ou sexta às
       14h30?"


╔═════════════════════════════════════════════════════╗
║  🔵 VERSÃO 3 — CONSULTIVA · autoridade, técnica     ║
╚═════════════════════════════════════════════════════╝

[01] ABERTURA — posicionar como analista, não vendedor
  Tu: "Boa tarde. Daqui Pedro Bicas. ${ganchoV3} e a
       vossa empresa apareceu numa análise que estava a
       fazer. Não é uma chamada comercial standard — é
       mais um briefing técnico curto. Apanhei-o numa
       altura possível?"

[02] FRAMING
  Tu: "Posso explicar-lhe em duas frases do que se
       trata?"

[03] INSIGHT COM DADOS
  Tu: "${insightV3}. Essa assimetria entre reputação e
       visibilidade é dinheiro a ficar em cima da mesa
       para quem souber procurar."

[04] DIAGNÓSTICA TÉCNICA — duas perguntas
  Tu: "Posso fazer-lhe duas perguntas?
       1) ${diag}
       2) E que percentagem desses pedidos converte
          em cliente?"

  ⏸  PAUSA longa — espera ele dar um número.

[05] AUTORIDADE
  Tu: "Boa. Com base nisso, já consigo afirmar que com
       2-3 ajustes específicos podem aumentar essa
       conversão em 20-30 pontos percentuais sem mais
       investimento em marketing. Não invento o número
       — vejo-o repetidamente nesta operação."

[06] FECHO
  Tu: "Proposta concreta: 15 minutos esta semana. Mostro
       o diagnóstico já feito — quantos pedidos estão a
       perder semanalmente, onde, e porquê. Sem
       compromisso. Quinta às 10h ou sexta às 15h?"


╔═════════════════════════════════════════════════════╗
║  🛡️  OBJEÇÕES — RESPOSTAS PRONTAS                   ║
╚═════════════════════════════════════════════════════╝

[NÃO TEMOS INTERESSE]
  "Compreendo — seria estranho ter interesse antes de
   saber do que se trata. Não estou a vender nada hoje.
   15 minutos para mostrar 3 coisas concretas sobre o
   vosso próprio negócio. Decide depois."

[NÃO TEMOS TEMPO]
  "Sem ironia, também não teria. É exatamente por isso
   que NÃO estou a marcar AGORA — para a próxima semana.
   Quarta, quinta ou sexta — qual é menos mau?"

[JÁ TEMOS ALGUÉM]
  "Boa — é o que esperaria de uma empresa séria. Não
   venho substituir ninguém. O que faço é auditar a
   presença atual: aponto onde está bem, e onde está a
   deixar dinheiro em cima da mesa. Se a pessoa atual
   fez tudo certo, sai daqui só com relatório a
   confirmar. Vale 15 min?"

[MANDE POR EMAIL]
  "Posso mandar — mas o que quero mostrar precisa 5
   minutos a explicar e 10 para as suas perguntas. Por
   escrito vira folheto comercial e fica em modo \"leio
   depois\" que nunca chega. Faço isto: mando AGORA
   uma frase com o diagnóstico inicial, e se for
   relevante voltamos a falar. Qual é o seu email
   direto?"

[NÃO PRECISAMOS]
  "Pode ser que não precisem mesmo — e se for esse o
   caso, melhor para vocês. Só peço uma coisa: 30
   segundos do que vi, para o caso do \"não precisamos\"
   estar baseado em informação que ainda não têm.
   Decide depois."

[LIGUE MAIS TARDE]
  "Combinado — mas para não ligar ao calhas, meto-lhe
   uma data na agenda agora. Quinta às 14h00 ou sexta
   às 10h00? Assim quando eu ligar já sabe quem é e
   nenhum de nós perde tempo a apresentar-se outra vez."


╔═════════════════════════════════════════════════════╗
║  🎯 COACHING DE EXECUÇÃO                            ║
╚═════════════════════════════════════════════════════╝

VOZ
  Abertura → 20% mais lenta, mais grave, sem pressa
  Gancho   → ligeiramente mais rápido, ênfase nas
             palavras-chave ("${presence}", "raro",
             "específico")
  Insight  → firme, sem hesitação, volume estável
  Fecho    → neutra, prática (como marcar dentista)

3 PAUSAS CRÍTICAS — não as cortes
  1. Após "apanhei-o em má altura?"  → 2-3s silêncio
  2. Após "faz sentido?"               → deixar processar
  3. Após data do fecho               → SILÊNCIO total;
                                        quem fala primeiro
                                        depois disto, perde

INSISTIR quando
  ✓ Objeção genérica sem motivo concreto (modo defesa)
  ✓ Faz perguntas sobre o que fazes (defesa caiu)
  ✓ Silêncio após o insight (está a pensar — não cortes)

RECUAR quando
  ✗ Ruído de fundo (mesmo ocupado, marca call-back FIRME)
  ✗ Repete a mesma objeção 2x
  ✗ Tom dele fica mais frio ao longo da chamada
  ✗ Diz "talvez no futuro" com sinceridade

REGRA DE OURO
  O objetivo é dar-lhe permissão para NÃO interagir.
  Quem se sente livre de desligar, não desliga.
  Pressão = perde. Curiosidade + autoridade = ganha.
`
}

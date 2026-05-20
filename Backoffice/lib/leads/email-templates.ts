import type { LeadBusinessType } from "@prisma/client"
import { VERTICAL_LABEL } from "@/lib/pitch"

export interface EmailTemplate {
  id:         string
  label:      string
  description: string
  stage:      "cold" | "follow-up" | "post-call" | "meeting" | "breakup"
  subject:    string
  body:       string
}

/** Per-vertical hook line used inside templates */
function verticalHook(b: LeadBusinessType): string {
  switch (b) {
    case "RESTAURANT":   return "Estive a ver como restaurantes em {city} aparecem no Google e a {name} chamou-me a atenção"
    case "PROFESSIONAL": return "Estive a olhar para a presença online de serviços profissionais em {city}"
    case "REAL_ESTATE":  return "Andei a ver imobiliárias em {city} e a {name} saltou-me à vista"
    case "BEAUTY":       return "Estive a analisar como o setor de beleza em {city} capta novas clientes online"
    case "GYM":          return "A captação de novos sócios em ginásios mudou muito — estive a olhar para o vosso caso"
    case "AUTO":         return "Estive a ver oficinas em {city} e como aparecem para quem precisa de serviço"
    case "CARPENTRY":    return "Estive a olhar para a {name}, especialmente as {reviews} reviews — raro neste setor"
    case "MOVING":       return "Estive a estudar o setor de mudanças em {city} — a janela de decisão é curta e específica"
    case "LAUNDRY":      return "Estive a olhar para o modelo de captação digital de lavandarias em {city}"
    case "CONSTRUCTION": return "Estive a analisar empresas de construção/remodelação em {city}"
    case "RETAIL":       return "Estive a ver o comércio local em {city}"
    default:             return "Estive a olhar para empresas em {city} e a {name} chamou-me a atenção"
  }
}

const STAGE_LABEL: Record<EmailTemplate["stage"], string> = {
  "cold":      "Cold outreach",
  "follow-up": "Follow-up",
  "post-call": "Pós-chamada",
  "meeting":   "Reunião",
  "breakup":   "Breakup",
}

export const STAGE_LABELS = STAGE_LABEL

/**
 * Template registry — each has a stage tag for filtering/grouping.
 * The body uses {placeholders} which getRenderedTemplate fills in from the lead.
 */
export const TEMPLATES: EmailTemplate[] = [
  {
    id: "cold-intro",
    label: "Cold #1 — intro consultiva",
    description: "Primeiro email. Não vende — abre conversa com observação específica.",
    stage: "cold",
    subject: "Sobre a {name} — uma observação rápida",
    body:
`Olá {ownerFirstName},

{verticalHook}.

Reparei numa coisa específica: {presence} é raro neste setor. Mas há um detalhe na vossa presença online que provavelmente está a fazer-vos perder pedidos sem se dar conta.

Se quiser, posso mandar-lhe a análise (1 página, 5 min a ler) com os 2-3 ajustes que vejo. Sem compromisso.

Diga-me se faz sentido,
{senderName}
Smart Hive Solutions`,
  },
  {
    id: "follow-up-1",
    label: "Follow-up #1 — sem resposta",
    description: "3 dias depois do cold. Volta ao assunto sem insistir.",
    stage: "follow-up",
    subject: "Re: Sobre a {name}",
    body:
`Olá {ownerFirstName},

Sei que está ocupado. Só queria confirmar que recebeu o email anterior — não sei se vai para spam ou se simplesmente não foi prioridade.

A análise que mencionei continua disponível. Se preferir uma conversa direta de 15 min, é mais rápido.

{senderName}`,
  },
  {
    id: "follow-up-2-audit",
    label: "Follow-up #2 — com audit",
    description: "1 semana depois do follow-up #1. Anexa value-add explícito.",
    stage: "follow-up",
    subject: "Análise da {name} (já feita, anexada)",
    body:
`Olá {ownerFirstName},

Decidi avançar com a análise sem esperar — assim tem material concreto para decidir.

Resumo do que vi (detalhe completo em anexo):

1. {findingOne}
2. {findingTwo}
3. {findingThree}

Se algum destes pontos ressoar, basta responder "sim" e marco 15 min para vos explicar como resolvíamos.

{senderName}
Smart Hive Solutions`,
  },
  {
    id: "post-call-thanks",
    label: "Pós-chamada — obrigado",
    description: "Logo depois de uma chamada positiva. Reforça compromissos.",
    stage: "post-call",
    subject: "Obrigado pela conversa, {ownerFirstName}",
    body:
`Olá {ownerFirstName},

Obrigado pelos {callDuration} minutos. Resumo dos próximos passos:

— Eu preparo {nextDeliverable}
— Voltamos a falar {nextStep}

Em caso de dúvida antes disso, é só responder a este email.

{senderName}`,
  },
  {
    id: "meeting-reminder",
    label: "Reunião — lembrete D-1",
    description: "Dia anterior à reunião. Confirma + envia link.",
    stage: "meeting",
    subject: "Amanhã às {meetingTime} — {name}",
    body:
`Olá {ownerFirstName},

Lembrete amigável da nossa conversa de amanhã, {meetingDate} às {meetingTime}.

Link: {meetLink}

Se precisar reagendar, basta dizer. Caso contrário, até amanhã.

{senderName}`,
  },
  {
    id: "breakup",
    label: "Breakup — última tentativa",
    description: "Depois de 3-4 emails sem resposta. Fecha a porta com dignidade — frequentemente desbloqueia respostas.",
    stage: "breakup",
    subject: "Vou parar de incomodar, {ownerFirstName}",
    body:
`Olá {ownerFirstName},

Não tive resposta aos meus emails anteriores, e isso é resposta legítima — vou parar por aqui para não ser chato.

Deixo a porta aberta: se algum dia quiser dar uma olhada à análise da vossa presença online, basta um "sim" e mando.

Caso contrário, desejo bom trabalho.

{senderName}`,
  },
]

export function getTemplate(id: string): EmailTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

interface RenderContext {
  name:        string
  city:        string | null
  reviews:     number
  rating:      number | null
  businessType: LeadBusinessType
  email:       string | null
  whoAnswered?: string | null
  senderName?: string
  meetingDate?: string
  meetingTime?: string
  meetLink?:   string
  // free-text deliverables for templates that need them — fall back to {placeholders}
  findingOne?:  string
  findingTwo?:  string
  findingThree?: string
  callDuration?: string
  nextDeliverable?: string
  nextStep?:    string
}

function presencePhrase(reviews: number, rating: number | null) {
  if (reviews > 0 && rating != null) return `${reviews.toLocaleString("pt-PT")} avaliações com ${rating.toFixed(1)}★`
  if (reviews > 0) return `${reviews.toLocaleString("pt-PT")} avaliações`
  return "uma presença forte no Google"
}

function firstName(fullOrCompany: string | null | undefined, fallback = "[NOME]"): string {
  if (!fullOrCompany) return fallback
  // If looks like a company name (Lda, S.A., etc.), fall back to generic
  const t = fullOrCompany.trim()
  if (/\b(lda|s\.?a\.?|unipessoal)\b/i.test(t)) return fallback
  return t.split(/\s+/)[0]
}

export function renderTemplate(tpl: EmailTemplate, ctx: RenderContext): { subject: string; body: string } {
  const presence = presencePhrase(ctx.reviews, ctx.rating)
  const hookLine = verticalHook(ctx.businessType)
    .replace("{name}", ctx.name)
    .replace("{city}", ctx.city ?? "[CIDADE]")
    .replace("{reviews}", ctx.reviews.toLocaleString("pt-PT"))

  const vars: Record<string, string> = {
    name:            ctx.name,
    city:            ctx.city ?? "[CIDADE]",
    reviews:         ctx.reviews.toLocaleString("pt-PT"),
    presence,
    verticalHook:    hookLine,
    vertical:        VERTICAL_LABEL[ctx.businessType],
    ownerFirstName:  firstName(ctx.whoAnswered, "responsável"),
    senderName:      ctx.senderName ?? "Pedro Bicas",
    meetingDate:     ctx.meetingDate ?? "[DATA]",
    meetingTime:     ctx.meetingTime ?? "[HORA]",
    meetLink:        ctx.meetLink ?? "[LINK]",
    findingOne:      ctx.findingOne   ?? "[finding 1]",
    findingTwo:      ctx.findingTwo   ?? "[finding 2]",
    findingThree:    ctx.findingThree ?? "[finding 3]",
    callDuration:    ctx.callDuration ?? "15",
    nextDeliverable: ctx.nextDeliverable ?? "[a preparar]",
    nextStep:        ctx.nextStep    ?? "[a combinar]",
  }

  const fill = (s: string) => s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`)
  return { subject: fill(tpl.subject), body: fill(tpl.body) }
}

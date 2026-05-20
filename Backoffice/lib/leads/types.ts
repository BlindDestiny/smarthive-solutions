import type {
  LeadStatus,
  LeadBusinessType,
  LeadCallAnswer,
} from "@prisma/client"

export type SortKey = "priority" | "name" | "reviews" | "rating" | "createdAt"
export type SortDir = "asc" | "desc"

export interface LeadsFilter {
  search?: string
  status?: LeadStatus
  businessType?: LeadBusinessType
  city?: string
  hasWebsite?: boolean
  hasEmail?: boolean
  hasPhone?: boolean
  minPriority?: number
  sortBy?: SortKey
  sortDir?: SortDir
  page?: number
  pageSize?: number
}

export type CallOutcome =
  | "interested"
  | "callback"
  | "not_int"
  | "no_answer"
  | "voicemail"
  | "wrong_number"

export const STATUS_LABEL: Record<LeadStatus, string> = {
  NEW:          "Novo",
  CONTACTED:    "Contactado",
  REPLIED:      "Respondeu",
  INTERESTED:   "Interessado",
  MEETING:      "Reunião",
  PROPOSAL:     "Proposta",
  CLOSED_WON:   "Fechado ✓",
  CLOSED_LOST:  "Perdido",
}

export const STATUS_COLOR: Record<LeadStatus, string> = {
  NEW:          "bg-gray-100 text-gray-700",
  CONTACTED:    "bg-blue-100 text-blue-700",
  REPLIED:      "bg-cyan-100 text-cyan-700",
  INTERESTED:   "bg-amber-100 text-amber-700",
  MEETING:      "bg-violet-100 text-violet-700",
  PROPOSAL:     "bg-orange-100 text-orange-700",
  CLOSED_WON:   "bg-emerald-100 text-emerald-700",
  CLOSED_LOST:  "bg-red-100 text-red-700",
}

export const ANSWERED_LABEL: Record<LeadCallAnswer, string> = {
  PENDING:      "—",
  YES:          "Atendeu",
  NO_ANSWER:    "Não atendeu",
  VOICEMAIL:    "Voicemail",
  WRONG_NUMBER: "Nº errado",
}

export const OUTCOME_LABEL: Record<CallOutcome, string> = {
  interested:   "🟢 Interessado",
  callback:     "🟡 Voltar a ligar",
  not_int:      "🔴 Não interessado",
  no_answer:    "📵 Não atendeu",
  voicemail:    "💬 Voicemail",
  wrong_number: "❌ Número errado",
}

export const ALL_STATUSES: LeadStatus[] = [
  "NEW", "CONTACTED", "REPLIED", "INTERESTED",
  "MEETING", "PROPOSAL", "CLOSED_WON", "CLOSED_LOST",
]

export const ALL_VERTICALS: LeadBusinessType[] = [
  "RESTAURANT", "PROFESSIONAL", "REAL_ESTATE", "BEAUTY", "GYM",
  "AUTO", "CARPENTRY", "MOVING", "LAUNDRY", "CONSTRUCTION",
  "RETAIL", "DEFAULT",
]

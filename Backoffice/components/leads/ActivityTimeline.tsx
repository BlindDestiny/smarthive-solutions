import {
  StickyNote, Phone, MessageSquare, Mail, CalendarCheck,
  FileText, RefreshCw, Circle,
} from "lucide-react"
import type { LeadActivityType } from "@prisma/client"

interface ActivityRow {
  id: string
  type: LeadActivityType
  content: string | null
  oldStatus: string | null
  newStatus: string | null
  channel: string | null
  createdAt: Date
  user?: { name: string | null; email: string } | null
}

const TYPE_META: Record<LeadActivityType, { icon: typeof Phone; label: string; color: string }> = {
  NOTE:           { icon: StickyNote,    label: "Nota",         color: "bg-gray-100 text-gray-600" },
  CALL:           { icon: Phone,         label: "Chamada",      color: "bg-sky-100 text-sky-700"   },
  WHATSAPP:       { icon: MessageSquare, label: "WhatsApp",     color: "bg-emerald-100 text-emerald-700" },
  EMAIL:          { icon: Mail,          label: "Email",        color: "bg-amber-100 text-amber-700" },
  MEETING:        { icon: CalendarCheck, label: "Reunião",      color: "bg-violet-100 text-violet-700" },
  STATUS_CHANGE:  { icon: RefreshCw,     label: "Mudança",      color: "bg-orange-100 text-orange-700" },
  PROPOSAL_SENT:  { icon: FileText,      label: "Proposta",     color: "bg-rose-100 text-rose-700" },
  OTHER:          { icon: Circle,        label: "Outro",        color: "bg-gray-100 text-gray-500" },
}

function formatWhen(d: Date) {
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60_000)
  if (diffMin < 1)   return "agora"
  if (diffMin < 60)  return `há ${diffMin}m`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24)    return `há ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 30)    return `há ${diffD}d`
  return d.toLocaleDateString("pt-PT")
}

export function ActivityTimeline({ rows }: { rows: ActivityRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-sm text-gray-500">
        Sem atividade registada ainda.
      </div>
    )
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
        <p className="text-xs text-gray-500">Últimas {rows.length} ações neste lead</p>
      </div>
      <ol className="divide-y divide-gray-100">
        {rows.map((row) => {
          const meta = TYPE_META[row.type]
          const Icon = meta.icon
          return (
            <li key={row.id} className="px-4 py-3 flex items-start gap-3">
              <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${meta.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-medium text-gray-900">
                    {meta.label}
                    {row.user?.name && (
                      <span className="text-gray-400 font-normal ml-1.5">· {row.user.name}</span>
                    )}
                  </p>
                  <time className="text-[11px] text-gray-400 shrink-0 tabular-nums">
                    {formatWhen(new Date(row.createdAt))}
                  </time>
                </div>
                {row.content && (
                  <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap break-words">
                    {row.content}
                  </p>
                )}
                {row.type === "STATUS_CHANGE" && row.oldStatus && row.newStatus && (
                  <div className="inline-flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                    <span>{row.oldStatus}</span>
                    <span>→</span>
                    <span className="font-medium text-gray-700">{row.newStatus}</span>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

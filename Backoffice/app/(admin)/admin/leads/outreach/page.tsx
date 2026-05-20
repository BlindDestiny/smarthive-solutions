import Link from "next/link"
import { Send, Mail, AlertTriangle } from "lucide-react"
import { TEMPLATES, STAGE_LABELS } from "@/lib/leads/email-templates"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function OutreachPage() {
  const hasResend = Boolean(process.env.RESEND_API_KEY)

  const recentSent = await prisma.leadEmailLog.findMany({
    orderBy: { sentAt: "desc" },
    take: 20,
    include: { lead: { select: { id: true, name: true } } },
  })

  const byTemplate = await prisma.leadEmailLog.groupBy({
    by: ["template", "status"],
    _count: { _all: true },
  })
  const tplStats = new Map<string, { sent: number; draft: number; failed: number }>()
  for (const t of TEMPLATES) tplStats.set(t.id, { sent: 0, draft: 0, failed: 0 })
  for (const r of byTemplate) {
    const t = tplStats.get(r.template ?? "")
    if (!t) continue
    const status = r.status as "sent" | "draft" | "failed" | null
    if (status && status in t) t[status] += r._count._all
  }

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Outreach</h1>
        <p className="text-sm text-gray-500 mt-1">
          Templates de email · enviados via Resend · loggados no LeadEmailLog
        </p>
      </header>

      {!hasResend && (
        <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">RESEND_API_KEY não configurada</p>
            <p className="text-amber-700">
              Os envios vão ficar como <strong>rascunho</strong> no log até definires{" "}
              <code className="bg-amber-100 px-1 rounded text-xs">RESEND_API_KEY</code> em{" "}
              <code className="bg-amber-100 px-1 rounded text-xs">.env.local</code>.
              Conta gratuita em{" "}
              <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="underline">
                resend.com
              </a>{" "}
              (100 emails/dia). Verifica o domínio{" "}
              <code className="bg-amber-100 px-1 rounded text-xs">smarthivesolutions.pt</code>{" "}
              (SPF/DKIM que já tens em DNS Amen).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Biblioteca de templates · {TEMPLATES.length}
          </h2>
          <div className="space-y-3">
            {TEMPLATES.map((tpl) => {
              const stats = tplStats.get(tpl.id) ?? { sent: 0, draft: 0, failed: 0 }
              return (
                <div key={tpl.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase tracking-widest text-sky-600 font-medium">
                          {STAGE_LABELS[tpl.stage]}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">{tpl.label}</h3>
                      <p className="text-xs text-gray-500 mt-1">{tpl.description}</p>
                    </div>
                    <div className="text-right shrink-0 text-[11px] text-gray-500">
                      {stats.sent > 0 && <div className="text-emerald-600">{stats.sent} enviados</div>}
                      {stats.draft > 0 && <div>{stats.draft} rascunhos</div>}
                      {stats.failed > 0 && <div className="text-red-600">{stats.failed} falhas</div>}
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-gray-50 rounded text-xs text-gray-700 font-mono leading-relaxed whitespace-pre-wrap line-clamp-4">
                    <strong>{tpl.subject}</strong>
                    {"\n\n"}
                    {tpl.body}
                  </div>
                  <p className="mt-3 text-[11px] text-gray-500">
                    Abre o detalhe de um lead e clica <strong>Enviar email</strong> para escolher este template.
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent sends */}
        <div className="lg:col-span-1">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Últimos envios · {recentSent.length}
          </h2>
          {recentSent.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed rounded-xl p-8 text-center">
              <Mail className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Sem envios ainda</p>
            </div>
          ) : (
            <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {recentSent.map((e) => (
                <li key={e.id} className="px-4 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={`text-[10px] uppercase tracking-widest font-medium ${
                      e.status === "sent" ? "text-emerald-600" :
                      e.status === "failed" ? "text-red-600" :
                      "text-gray-500"
                    }`}>{e.status}</span>
                    <time className="text-[11px] text-gray-400 tabular-nums">
                      {new Date(e.sentAt).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </time>
                  </div>
                  {e.lead && (
                    <Link href={`/admin/leads/${e.lead.id}`} className="text-sm font-medium text-gray-900 hover:text-sky-600 block truncate">
                      {e.lead.name}
                    </Link>
                  )}
                  <p className="text-xs text-gray-500 truncate">{e.subject}</p>
                  <p className="text-[11px] text-gray-400 truncate">→ {e.toAddress}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { Mail, X, ArrowRight, Check, AlertCircle } from "lucide-react"
import type { LeadBusinessType } from "@prisma/client"
import { TEMPLATES, renderTemplate, type EmailTemplate, STAGE_LABELS } from "@/lib/leads/email-templates"
import { sendLeadEmail } from "@/lib/leads/email-mutations"

interface SendEmailDialogProps {
  lead: {
    id: string
    name: string
    email: string | null
    city: string | null
    reviews: number
    rating: number | null
    businessType: LeadBusinessType
    whoAnswered: string | null
  }
}

export function SendEmailButton({ lead }: SendEmailDialogProps) {
  const [open, setOpen] = useState(false)
  const [tplId, setTplId] = useState(TEMPLATES[0]?.id)
  const [toAddr, setToAddr] = useState(lead.email ?? "")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [pending, startTransition] = useTransition()
  const [result, setResult] = useState<{ kind: "ok" | "err"; msg: string } | null>(null)

  const tpl = useMemo(() => TEMPLATES.find((t) => t.id === tplId), [tplId])

  // Re-render when template changes
  useEffect(() => {
    if (!tpl) return
    const r = renderTemplate(tpl, {
      name: lead.name, city: lead.city, reviews: lead.reviews, rating: lead.rating,
      businessType: lead.businessType, email: lead.email, whoAnswered: lead.whoAnswered,
    })
    setSubject(r.subject)
    setBody(r.body)
  }, [tplId, tpl, lead])

  function submit() {
    if (!toAddr.trim() || !tpl) return
    setResult(null)
    startTransition(async () => {
      try {
        const r = await sendLeadEmail({
          leadId: lead.id, templateId: tpl.id,
          toAddress: toAddr.trim(),
          subject, body,
        })
        setResult({
          kind: r.ok ? "ok" : "err",
          msg:  r.ok ? "Email enviado ✓"
                    : r.status === "draft" ? "Guardado como rascunho — RESEND_API_KEY não configurada"
                    : `Falhou: ${r.error ?? "erro desconhecido"}`,
        })
        if (r.ok) setTimeout(() => setOpen(false), 1500)
      } catch (e) {
        setResult({ kind: "err", msg: (e as Error).message })
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={!lead.email}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        title={lead.email ? "Enviar email" : "Lead sem email"}
      >
        <Mail className="w-3.5 h-3.5" /> Enviar email
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Enviar email</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">Template</label>
                  <select
                    value={tplId}
                    onChange={(e) => setTplId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white"
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>
                        [{STAGE_LABELS[t.stage]}] {t.label}
                      </option>
                    ))}
                  </select>
                  {tpl && <p className="text-[11px] text-gray-500 mt-1">{tpl.description}</p>}
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">Para</label>
                  <input
                    type="email"
                    value={toAddr}
                    onChange={(e) => setToAddr(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">Assunto</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">Corpo</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={14}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 resize-y"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Placeholders entre {"{...}"} não substituídos significam dados em falta — edita manualmente.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3">
              <div className="text-xs">
                {result?.kind === "ok" && <span className="inline-flex items-center gap-1.5 text-emerald-700"><Check className="w-3.5 h-3.5"/> {result.msg}</span>}
                {result?.kind === "err" && <span className="inline-flex items-center gap-1.5 text-red-700"><AlertCircle className="w-3.5 h-3.5"/> {result.msg}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Cancelar
                </button>
                <button
                  onClick={submit}
                  disabled={pending || !toAddr.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg disabled:opacity-40"
                >
                  {pending ? "A enviar…" : "Enviar"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

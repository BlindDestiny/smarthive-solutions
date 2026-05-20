"use client"

import { useState, useTransition } from "react"
import { saveCallOutcome } from "@/lib/leads/mutations"
import { OUTCOME_LABEL, type CallOutcome } from "@/lib/leads/types"
import { Calendar, ArrowRight, Check, AlertCircle } from "lucide-react"

interface OutcomeButtonsProps {
  leadId: string
  initialOutcome?: CallOutcome | null  // pre-highlights last saved outcome
  initialNotes?: string
}

const OUTCOMES: CallOutcome[] = [
  "interested", "callback", "not_int", "no_answer", "voicemail", "wrong_number",
]

const CALLBACK_OPTIONS = [
  { label: "Hoje +2h",   days: 0,    hours: 2 },
  { label: "Amanhã",     days: 1,    hours: 0 },
  { label: "3 dias",     days: 3,    hours: 0 },
  { label: "1 semana",   days: 7,    hours: 0 },
]

export function OutcomeButtons({ leadId, initialOutcome, initialNotes }: OutcomeButtonsProps) {
  const [outcome, setOutcome] = useState<CallOutcome | null>(initialOutcome ?? null)
  const [notes, setNotes] = useState(initialNotes ?? "")
  const [isOwner, setIsOwner] = useState<"yes" | "no" | "unknown">("unknown")
  const [whoAnswered, setWhoAnswered] = useState("")
  const [lostReason, setLostReason] = useState("")
  const [followUp, setFollowUp] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null)

  function pickCallback(opt: typeof CALLBACK_OPTIONS[number]) {
    const d = new Date()
    d.setDate(d.getDate() + opt.days)
    d.setHours(d.getHours() + opt.hours)
    setFollowUp(d.toISOString().slice(0, 10))
  }

  function save() {
    if (!outcome) return
    startTransition(async () => {
      try {
        const res = await saveCallOutcome({
          leadId,
          outcome,
          notes: notes.trim() || undefined,
          isOwner: outcome === "interested" ? isOwner : undefined,
          whoAnswered: outcome === "interested" ? whoAnswered.trim() || undefined : undefined,
          lostReason: outcome === "not_int" ? lostReason.trim() || undefined : undefined,
          followUpDate: followUp ?? undefined,
        })
        setFeedback({ kind: "ok", msg: `Guardado · novo status ${res.newStatus}` })
        // Clear ephemeral fields
        setFollowUp(null)
      } catch (e) {
        setFeedback({ kind: "err", msg: (e as Error).message ?? "Erro a guardar" })
      }
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Como correu a chamada?</h3>

      {/* Outcome buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-5">
        {OUTCOMES.map((oc) => {
          const active = outcome === oc
          return (
            <button
              key={oc}
              onClick={() => setOutcome(oc)}
              className={`px-3 py-2.5 text-xs font-medium rounded-lg border transition-colors ${
                active
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white text-gray-700 border-gray-200 hover:border-sky-300 hover:bg-sky-50"
              }`}
            >
              {OUTCOME_LABEL[oc]}
            </button>
          )
        })}
      </div>

      {/* Conditional fields by outcome */}
      {outcome === "interested" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
              Era o dono?
            </label>
            <div className="flex gap-2">
              {([["yes", "Sim"], ["no", "Não"], ["unknown", "Não sei"]] as const).map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setIsOwner(v)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded border ${
                    isOwner === v ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
              Quem atendeu (se não dono)
            </label>
            <input
              type="text"
              value={whoAnswered}
              onChange={(e) => setWhoAnswered(e.target.value)}
              placeholder="Ex: Sra. Maria, gerente"
              disabled={isOwner === "yes"}
              className="w-full h-9 px-3 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>
      )}

      {(outcome === "callback" || outcome === "no_answer") && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-2">
            Quando voltar a ligar
          </label>
          <div className="flex flex-wrap gap-2">
            {CALLBACK_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => pickCallback(opt)}
                className="px-3 py-1.5 text-xs font-medium rounded border border-gray-200 bg-white text-gray-700 hover:border-sky-300"
              >
                <Calendar className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                {opt.label}
              </button>
            ))}
            {followUp && (
              <span className="px-3 py-1.5 text-xs font-medium rounded bg-sky-50 text-sky-700">
                → {new Date(followUp).toLocaleDateString("pt-PT")}
              </span>
            )}
          </div>
        </div>
      )}

      {outcome === "not_int" && (
        <div className="mb-4 pb-4 border-b border-gray-100">
          <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
            Motivo de não-interesse
          </label>
          <select
            value={lostReason}
            onChange={(e) => setLostReason(e.target.value)}
            className="w-full h-9 px-2.5 pr-8 rounded border border-gray-200 text-sm bg-white"
          >
            <option value="">Escolher motivo…</option>
            <option>Já tem alguém</option>
            <option>Sem orçamento</option>
            <option>Não é o momento</option>
            <option>Negócio em fecho</option>
            <option>Outro</option>
          </select>
        </div>
      )}

      {/* Notes */}
      <div className="mb-4">
        <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
          Notas da chamada
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: pediu para ligar 5ª de manhã. Mencionou que estão a abrir 2º espaço…"
          rows={3}
          className="w-full px-3 py-2 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 resize-y"
        />
      </div>

      {/* Save */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs">
          {feedback?.kind === "ok" && (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> {feedback.msg}
            </span>
          )}
          {feedback?.kind === "err" && (
            <span className="inline-flex items-center gap-1.5 text-red-700">
              <AlertCircle className="w-3.5 h-3.5" /> {feedback.msg}
            </span>
          )}
        </div>
        <button
          onClick={save}
          disabled={!outcome || pending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pending ? "A guardar…" : "Guardar outcome"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

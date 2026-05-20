"use client"

import { useState, useTransition } from "react"
import { CalendarPlus, X, ArrowRight } from "lucide-react"
import { LeadMeetingStage } from "@prisma/client"
import { createMeeting } from "@/lib/leads/meeting-mutations"

const STAGES: { value: LeadMeetingStage; label: string }[] = [
  { value: LeadMeetingStage.DISCOVERY,  label: "Discovery — 1ª conversa real" },
  { value: LeadMeetingStage.DEMO,       label: "Demo — apresentar trabalho" },
  { value: LeadMeetingStage.PROPOSAL,   label: "Proposta — escopo + preço" },
  { value: LeadMeetingStage.CLOSING,    label: "Fecho — negociação final" },
  { value: LeadMeetingStage.KICKOFF,    label: "Kickoff — arranque do projeto" },
  { value: LeadMeetingStage.FOLLOW_UP,  label: "Follow-up — re-engagement" },
]

function defaultDt() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(10, 0, 0, 0)
  // Format for input[type="datetime-local"]
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function ScheduleMeetingButton({ leadId }: { leadId: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [startDt, setStartDt] = useState(defaultDt())
  const [duration, setDuration] = useState(30)
  const [stage, setStage] = useState<LeadMeetingStage>(LeadMeetingStage.DISCOVERY)
  const [meetLink, setMeetLink] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)

  function submit() {
    setError(null)
    startTransition(async () => {
      try {
        await createMeeting({
          leadId,
          startDt: new Date(startDt).toISOString(),
          durationMin: duration,
          stage,
          meetLink: meetLink.trim() || undefined,
          notes: notes.trim() || undefined,
        })
        setOpen(false)
        // Reset
        setMeetLink("")
        setNotes("")
        setStartDt(defaultDt())
      } catch (e) {
        setError((e as Error).message)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-violet-500 hover:bg-violet-600 text-white"
      >
        <CalendarPlus className="w-3.5 h-3.5" /> Marcar reunião
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Marcar reunião</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
                  Data e hora
                </label>
                <input
                  type="datetime-local"
                  value={startDt}
                  onChange={(e) => setStartDt(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
                    Duração
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white"
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                    <option value="90">90 min</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
                    Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as LeadMeetingStage)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
                  Link da videochamada (opcional)
                </label>
                <input
                  type="url"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/... ou https://us02web.zoom.us/..."
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">
                  Notas (agenda, objetivos)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="O que vais cobrir nesta reunião…"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 resize-y"
                />
              </div>

              {error && (
                <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={pending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium rounded-lg disabled:opacity-40"
              >
                {pending ? "A guardar…" : "Marcar"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

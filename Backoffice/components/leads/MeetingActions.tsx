"use client"

import { useTransition } from "react"
import { LeadMeetingStatus } from "@prisma/client"
import { updateMeetingStatus } from "@/lib/leads/meeting-mutations"
import { Check, X, UserX } from "lucide-react"

export function MeetingActions({ meetingId, status }: {
  meetingId: string
  status: LeadMeetingStatus
}) {
  const [pending, startTransition] = useTransition()

  if (status !== LeadMeetingStatus.SCHEDULED && status !== LeadMeetingStatus.RESCHEDULED) {
    return (
      <p className="text-[11px] text-gray-500 mt-2">
        Estado: <span className="font-medium">{status.toLowerCase().replace("_", " ")}</span>
      </p>
    )
  }

  function call(s: LeadMeetingStatus) {
    startTransition(async () => {
      try { await updateMeetingStatus(meetingId, s) }
      catch (e) { console.error(e) }
    })
  }

  return (
    <div className="flex items-center gap-1.5 mt-2">
      <button
        onClick={() => call(LeadMeetingStatus.DONE)}
        disabled={pending}
        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-40"
      >
        <Check className="w-3 h-3" /> Feita
      </button>
      <button
        onClick={() => call(LeadMeetingStatus.NO_SHOW)}
        disabled={pending}
        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-40"
      >
        <UserX className="w-3 h-3" /> No-show
      </button>
      <button
        onClick={() => call(LeadMeetingStatus.CANCELLED)}
        disabled={pending}
        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40"
      >
        <X className="w-3 h-3" /> Cancelar
      </button>
    </div>
  )
}

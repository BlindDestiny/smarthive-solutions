"use client"

import { useTransition } from "react"
import { Send } from "lucide-react"
import { markProposalSent } from "@/lib/leads/proposal-mutations"

export function MarkSentButton({ proposalId }: { proposalId: string }) {
  const [pending, startTransition] = useTransition()
  return (
    <button
      onClick={() => startTransition(() => markProposalSent(proposalId).then(() => location.reload()))}
      disabled={pending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40"
    >
      <Send className="w-3.5 h-3.5" /> {pending ? "A guardar…" : "Marcar como enviada"}
    </button>
  )
}

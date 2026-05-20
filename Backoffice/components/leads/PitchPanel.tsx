"use client"

import { useState, useMemo } from "react"
import { coldCallPitch, VERTICAL_LABEL } from "@/lib/pitch"
import type { LeadBusinessType } from "@prisma/client"
import { Sparkles, Copy, Check } from "lucide-react"

interface PitchPanelProps {
  lead: {
    name: string
    city: string | null
    reviews: number
    rating: number | null
    businessType: LeadBusinessType
    keyword: string | null
    category: string | null
  }
}

type Tab = "v1" | "v2" | "v3" | "obj" | "coach"

const TAB_LABELS: Record<Tab, string> = {
  v1:    "🟢 V1 Natural",
  v2:    "🟡 V2 Direta",
  v3:    "🔵 V3 Consultiva",
  obj:   "🛡️  Objeções",
  coach: "🎯 Coaching",
}

// Split the full pitch into its 5 logical sections so we can render tabs
function splitPitch(full: string) {
  // Sections separated by ╔══...══╗ headers
  const parts = full.split(/╔═+╗\s*\n║\s+/)
  // parts[0] = preamble (contexto + escolha + proibido)
  // parts[1] = V1, [2] = V2, [3] = V3, [4] = Objeções, [5] = Coaching
  const preamble = parts[0]?.trim() ?? ""
  const sections = parts.slice(1).map((p) => "║  " + p)
  return { preamble, v1: sections[0] ?? "", v2: sections[1] ?? "", v3: sections[2] ?? "", obj: sections[3] ?? "", coach: sections[4] ?? "" }
}

export function PitchPanel({ lead }: PitchPanelProps) {
  const [tab, setTab] = useState<Tab>("v1")
  const [copied, setCopied] = useState(false)
  const full = useMemo(() => coldCallPitch(lead), [lead])
  const sections = useMemo(() => splitPitch(full), [full])
  const body = sections[tab]

  async function copyCurrent() {
    await navigator.clipboard.writeText(body)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-semibold text-gray-900">
            Pitch da chamada
          </h3>
          <span className="text-[11px] uppercase tracking-widest text-gray-500">
            · {VERTICAL_LABEL[lead.businessType]}
          </span>
        </div>
        <button
          onClick={copyCurrent}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 overflow-x-auto">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => {
          const active = tab === t
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                active
                  ? "border-sky-500 text-sky-700 bg-sky-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          )
        })}
      </div>

      {/* Preamble — always visible (context + which version for which profile) */}
      <pre className="px-4 py-3 text-[11px] leading-relaxed text-gray-500 font-mono whitespace-pre-wrap bg-gray-50 border-b border-gray-200">
        {sections.preamble}
      </pre>

      {/* Body */}
      <pre className="px-4 py-4 text-[12px] leading-relaxed text-gray-800 font-mono whitespace-pre-wrap max-h-[600px] overflow-y-auto">
        {body}
      </pre>
    </div>
  )
}

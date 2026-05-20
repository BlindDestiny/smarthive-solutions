import { BarChart3, TrendingUp, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ReportsPage() {
  // Quick funnel: count leads at each stage
  const counts = await prisma.leadCrmState.groupBy({
    by: ["status"],
    _count: { _all: true },
  })
  const map = Object.fromEntries(counts.map((c) => [c.status, c._count._all]))

  const totalLeads = await prisma.lead.count()
  const totalCrm = await prisma.leadCrmState.count()
  const contacted = (map.CONTACTED ?? 0) + (map.REPLIED ?? 0) + (map.INTERESTED ?? 0) +
                    (map.MEETING ?? 0) + (map.PROPOSAL ?? 0) + (map.CLOSED_WON ?? 0) + (map.CLOSED_LOST ?? 0)
  const interested = (map.INTERESTED ?? 0) + (map.MEETING ?? 0) + (map.PROPOSAL ?? 0) + (map.CLOSED_WON ?? 0)
  const meeting   = (map.MEETING ?? 0) + (map.PROPOSAL ?? 0) + (map.CLOSED_WON ?? 0)
  const won       = map.CLOSED_WON ?? 0

  const funnel = [
    { label: "Total leads",   value: totalLeads,   pct: 100 },
    { label: "Contactados",   value: contacted,    pct: totalLeads ? (contacted/totalLeads)*100 : 0 },
    { label: "Interessados",  value: interested,   pct: totalLeads ? (interested/totalLeads)*100 : 0 },
    { label: "Reunião",       value: meeting,      pct: totalLeads ? (meeting/totalLeads)*100 : 0 },
    { label: "Fechados ✓",    value: won,          pct: totalLeads ? (won/totalLeads)*100 : 0 },
  ]

  // Per-vertical conversion
  const byVertical = await prisma.lead.groupBy({
    by: ["businessType"],
    _count: { _all: true },
    orderBy: { _count: { businessType: "desc" } },
    take: 12,
  })

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Funnel · per-vertical · per-caller (em construção)
        </p>
      </header>

      {/* Funnel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-semibold text-gray-900">Funnel global</h3>
        </div>
        <div className="space-y-3">
          {funnel.map((step, idx) => (
            <div key={step.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700">{step.label}</span>
                <span className="text-gray-500 tabular-nums">
                  {step.value.toLocaleString("pt-PT")} · {step.pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    idx === 0 ? "bg-gray-300" :
                    idx === 4 ? "bg-emerald-500" :
                    "bg-sky-500"
                  }`}
                  style={{ width: `${step.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-vertical */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-sky-500" />
          <h3 className="text-sm font-semibold text-gray-900">Distribuição por vertical</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {byVertical.map((v) => (
            <div key={v.businessType} className="px-3 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                {v.businessType.toLowerCase().replace("_", " ")}
              </p>
              <p className="text-lg font-semibold text-gray-900 tabular-nums">
                {v._count._all.toLocaleString("pt-PT")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 border-dashed rounded-xl p-8 text-center">
        <BarChart3 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-900">Reports avançados em fase 8</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          A vir: conversion rate por vertical, cohort analysis (semana/mês),
          per-caller stats, tempo médio de resposta, sources de fecho.
          Vai usar Tremor / Recharts para charts interactivos.
        </p>
      </div>
    </div>
  )
}

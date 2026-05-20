import { TrendingUp, Users, Activity } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { FunnelBars } from "@/components/leads/charts/FunnelBars"
import { VerticalDistribution } from "@/components/leads/charts/VerticalDistribution"
import { ActivityWeekly } from "@/components/leads/charts/ActivityTimeline"
import { ALL_VERTICALS } from "@/lib/leads/types"

export const dynamic = "force-dynamic"

function isoWeekKey(d: Date): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const weekNum = Math.ceil((((date.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`
}

export default async function ReportsPage() {
  // ── Funnel ────────────────────────────────────────
  const counts = await prisma.leadCrmState.groupBy({
    by: ["status"], _count: { _all: true },
  })
  const m = Object.fromEntries(counts.map((c) => [c.status, c._count._all]))

  const totalLeads = await prisma.lead.count()
  const contacted  = (m.CONTACTED ?? 0) + (m.REPLIED ?? 0) + (m.INTERESTED ?? 0) +
                     (m.MEETING ?? 0) + (m.PROPOSAL ?? 0) + (m.CLOSED_WON ?? 0) + (m.CLOSED_LOST ?? 0)
  const interested = (m.INTERESTED ?? 0) + (m.MEETING ?? 0) + (m.PROPOSAL ?? 0) + (m.CLOSED_WON ?? 0)
  const meeting    = (m.MEETING ?? 0) + (m.PROPOSAL ?? 0) + (m.CLOSED_WON ?? 0)
  const won        = m.CLOSED_WON ?? 0

  const funnel = [
    { label: "Total leads",  value: totalLeads,  pct: 100 },
    { label: "Contactados",  value: contacted,   pct: totalLeads ? (contacted/totalLeads)*100 : 0 },
    { label: "Interessados", value: interested,  pct: totalLeads ? (interested/totalLeads)*100 : 0 },
    { label: "Reunião",      value: meeting,     pct: totalLeads ? (meeting/totalLeads)*100 : 0 },
    { label: "Fechados",     value: won,         pct: totalLeads ? (won/totalLeads)*100 : 0 },
  ]

  // ── Per-vertical ─────────────────────────────────
  const verticalTotals    = await prisma.lead.groupBy({ by: ["businessType"], _count: { _all: true } })
  const verticalContacted = await prisma.lead.findMany({
    where: {
      crmState: {
        is: { status: { in: ["CONTACTED", "REPLIED", "INTERESTED", "MEETING", "PROPOSAL", "CLOSED_WON", "CLOSED_LOST"] } },
      },
    },
    select: { businessType: true, crmState: { select: { status: true } } },
  })
  const vCounts = new Map<string, { total: number; contacted: number; meeting: number; won: number }>()
  for (const v of ALL_VERTICALS) vCounts.set(v, { total: 0, contacted: 0, meeting: 0, won: 0 })
  for (const v of verticalTotals) {
    const e = vCounts.get(v.businessType); if (e) e.total = v._count._all
  }
  for (const r of verticalContacted) {
    const e = vCounts.get(r.businessType); if (!e) continue
    e.contacted++
    const s = r.crmState?.status
    if (s === "MEETING" || s === "PROPOSAL" || s === "CLOSED_WON") e.meeting++
    if (s === "CLOSED_WON") e.won++
  }
  const verticalRows = ALL_VERTICALS.map((v) => ({
    businessType: v,
    ...vCounts.get(v)!,
  })).filter((r) => r.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  // ── Activity weekly (last 12 weeks) ──────────────
  const twelveWeeksAgo = new Date()
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 12 * 7)
  const acts = await prisma.leadActivity.findMany({
    where: { createdAt: { gte: twelveWeeksAgo }, type: { in: ["CALL", "EMAIL", "MEETING"] } },
    select: { type: true, createdAt: true },
  })
  const byWeek = new Map<string, { calls: number; emails: number; meetings: number }>()
  for (const a of acts) {
    const wk = isoWeekKey(new Date(a.createdAt))
    if (!byWeek.has(wk)) byWeek.set(wk, { calls: 0, emails: 0, meetings: 0 })
    const w = byWeek.get(wk)!
    if (a.type === "CALL")    w.calls++
    if (a.type === "EMAIL")   w.emails++
    if (a.type === "MEETING") w.meetings++
  }
  const weeklyData = [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, v]) => ({ week: week.slice(-3), ...v }))

  // ── KPI cards ────────────────────────────────────
  const conversion = totalLeads ? (won / totalLeads) * 100 : 0
  const meetingsThisWeek = await prisma.leadMeeting.count({
    where: {
      startDt: {
        gte: new Date(new Date().getTime() - 7 * 86_400_000),
        lt:  new Date(new Date().getTime() + 7 * 86_400_000),
      },
      status: "SCHEDULED",
    },
  })
  const callsThisWeek = acts.filter((a) =>
    a.type === "CALL" && new Date(a.createdAt).getTime() > Date.now() - 7 * 86_400_000
  ).length

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">
          Funnel · distribuição por vertical · atividade semanal
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Conversion rate"   value={`${conversion.toFixed(2)}%`} sub="leads → fechados" />
        <KpiCard label="Leads totais"      value={totalLeads.toLocaleString("pt-PT")} sub="no DB" />
        <KpiCard label="Chamadas (7d)"     value={callsThisWeek.toLocaleString("pt-PT")} sub="atividade recente" />
        <KpiCard label="Reuniões (próx 7d)" value={meetingsThisWeek.toLocaleString("pt-PT")} sub="agendadas" />
      </div>

      {/* Funnel */}
      <Card icon={TrendingUp} title="Funnel global">
        <FunnelBars data={funnel} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100">
          {funnel.slice(1).map((step, i) => {
            const prev = funnel[i]
            const rate = prev.value > 0 ? (step.value / prev.value) * 100 : 0
            return (
              <div key={step.label}>
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  {prev.label} → {step.label}
                </p>
                <p className="text-lg font-semibold text-gray-900 tabular-nums">
                  {rate.toFixed(1)}%
                </p>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Per-vertical */}
      <Card icon={Users} title="Distribuição por vertical (top 10)">
        <VerticalDistribution data={verticalRows} />
      </Card>

      {/* Activity */}
      <Card icon={Activity} title="Atividade últimas 12 semanas">
        {weeklyData.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">
            Sem atividade registada nas últimas 12 semanas.
          </div>
        ) : (
          <ActivityWeekly data={weeklyData} />
        )}
      </Card>
    </div>
  )
}

function Card({
  icon: Icon, title, children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-sky-500" />
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-[11px] font-medium uppercase tracking-widest text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-2 tabular-nums">{value}</p>
      <p className="text-[11px] text-gray-400 mt-1">{sub}</p>
    </div>
  )
}

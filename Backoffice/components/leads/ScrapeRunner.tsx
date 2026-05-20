"use client"

import { useEffect, useState, useTransition } from "react"
import {
  Play, Square, Loader2, Check, AlertTriangle, X,
  Clock, DollarSign, Database, Activity,
} from "lucide-react"
import type { ScrapeJobStatus } from "@prisma/client"

interface ScrapeJob {
  id:             string
  status:         ScrapeJobStatus
  preset:         string
  keywords:       string[]
  cellsPlanned:   number
  combosPlanned:  number
  combosSkipped:  number
  callsMade:      number
  leadsNew:       number
  leadsTotal:     number
  lastCell:       string | null
  lastKeyword:    string | null
  lastSource:     string | null
  costUsd:        number
  recentActivity: { source: string; keyword: string; found: number; ts: number }[] | null
  startedAt:      string | null
  endedAt:        string | null
  createdAt:      string
  updatedAt:      string
  error:          string | null
  user?:          { name: string | null; email: string } | null
}

const PRESETS = [
  {
    id:    "quick",
    label: "Quick",
    cells: 210,       // 30 cidades × 7 offsets
    kws:   25,
    desc:  "Top 30 cidades · 25 verticais focadas. Boa primeira passagem.",
  },
  {
    id:    "standard",
    label: "Standard",
    cells: 700,       // 100 cidades × 7 offsets
    kws:   35,
    desc:  "Top 100 localidades · 35 verticais. Cobertura de cidades médias.",
  },
  {
    id:    "full",
    label: "Full continente",
    cells: 400,       // hex grid mainland
    kws:   144,
    desc:  "Hex grid mainland PT (raio 15km) · 144 verticais (catálogo completo). Cobertura máxima.",
  },
] as const

const COST_PER_CALL_USD = 0.032
const EUR_PER_USD       = 0.93
const BUDGET_CAP_EUR    = 260

function estimateCost(cells: number, kws: number, avgPages = 1.5) {
  const calls = cells * kws * avgPages
  const usd = calls * COST_PER_CALL_USD
  return { calls, usd, eur: usd * EUR_PER_USD }
}

const STATUS_STYLE: Record<ScrapeJobStatus, { label: string; color: string }> = {
  PENDING:   { label: "A iniciar",  color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" },
  RUNNING:   { label: "A correr",   color: "bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300" },
  COMPLETED: { label: "Completo",   color: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" },
  FAILED:    { label: "Falhou",     color: "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300" },
  CANCELLED: { label: "Cancelado",  color: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300" },
}

function formatDuration(start: string | null, end: string | null) {
  if (!start) return "—"
  const s = new Date(start).getTime()
  const e = end ? new Date(end).getTime() : Date.now()
  const ms = e - s
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  if (min < 1) return `${sec}s`
  return `${min}m ${sec}s`
}

export function ScrapeRunner({ initialJobs }: { initialJobs: ScrapeJob[] }) {
  const [jobs, setJobs] = useState(initialJobs)
  const [preset, setPreset] = useState<(typeof PRESETS)[number]["id"]>("quick")
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; msg: string } | null>(null)

  const sel = PRESETS.find((p) => p.id === preset)!
  const est = estimateCost(sel.cells, sel.kws)
  const activeJob = jobs.find((j) => j.status === "RUNNING" || j.status === "PENDING") ?? null

  // Poll for updates every 1s when a job is active
  useEffect(() => {
    if (!activeJob) return
    const id = setInterval(() => {
      fetch("/api/scrape/jobs").then((r) => r.json()).then((d) => {
        if (d.jobs) {
          setJobs(d.jobs.map((j: ScrapeJob) => ({
            ...j,
            createdAt: typeof j.createdAt === "string" ? j.createdAt : new Date(j.createdAt).toISOString(),
          })))
        }
      }).catch(() => {})
    }, 1000)
    return () => clearInterval(id)
  }, [activeJob?.id])

  function startScrape() {
    setFeedback(null)
    startTransition(async () => {
      try {
        const r = await fetch("/api/scrape/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ preset }),
        })
        const d = await r.json()
        if (!r.ok) throw new Error(d.error ?? "Falhou")
        setFeedback({ kind: "ok", msg: `Job ${d.jobId.slice(-6)} iniciado` })
        // Refresh jobs list immediately
        fetch("/api/scrape/jobs").then((r) => r.json()).then((d) => d.jobs && setJobs(d.jobs))
      } catch (e) {
        setFeedback({ kind: "err", msg: (e as Error).message })
      }
    })
  }

  function cancelJob(id: string) {
    startTransition(async () => {
      try {
        await fetch("/api/scrape/cancel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId: id }),
        })
        fetch("/api/scrape/jobs").then((r) => r.json()).then((d) => d.jobs && setJobs(d.jobs))
      } catch {}
    })
  }

  return (
    <div className="space-y-6">
      {/* Active job — shown prominently when running */}
      {activeJob && (
        <ActiveJobCard job={activeJob} onCancel={cancelJob} />
      )}

      {/* Launch form */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Iniciar nova ingestão</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {PRESETS.map((p) => {
            const e = estimateCost(p.cells, p.kws)
            const active = preset === p.id
            return (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                disabled={Boolean(activeJob)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  active
                    ? "border-sky-500 bg-sky-50 dark:bg-sky-950/40 ring-1 ring-sky-200 dark:ring-sky-800/40"
                    : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{p.label}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                    ~{e.eur.toFixed(0)}€
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{p.desc}</p>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400">
                  <span>{p.cells.toLocaleString("pt-PT")} cells</span>
                  <span>·</span>
                  <span>{p.kws} kws</span>
                  <span>·</span>
                  <span className="tabular-nums">{(e.calls).toLocaleString("pt-PT")} calls max</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            <strong>Estimativa máxima:</strong> {est.calls.toLocaleString("pt-PT")} calls · ${est.usd.toFixed(2)} (~{est.eur.toFixed(0)}€){" "}
            <span className="text-gray-400 dark:text-gray-500">@ $0.032/call (Places legacy)</span>
            <br />
            Combos já existentes no DB são <strong>saltados automaticamente</strong> — custo real costuma ser bastante menor.
            <br />
            <span className={est.eur > BUDGET_CAP_EUR ? "text-amber-700" : "text-emerald-700"}>
              🛡️ Cap rígido de <strong>{BUDGET_CAP_EUR}€</strong> (créditos free Google) — scrape pára sozinho ao chegar lá.
              {est.eur > BUDGET_CAP_EUR && (
                <> · Vais ficar a meio (precisarias de ~{est.eur.toFixed(0)}€ para acabar este preset).</>
              )}
            </span>
          </div>
          <button
            onClick={startScrape}
            disabled={pending || Boolean(activeJob)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title={activeJob ? "Espera o job atual acabar" : ""}
          >
            <Play className="w-4 h-4" /> Iniciar scrape
          </button>
        </div>

        {feedback && (
          <p className={`mt-3 text-xs ${feedback.kind === "ok" ? "text-emerald-700" : "text-red-700"}`}>
            {feedback.msg}
          </p>
        )}
      </div>

      {/* History */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Histórico</h2>
        </div>
        {jobs.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
            Sem jobs ainda. Clica em "Iniciar scrape" acima.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200">
              <tr className="text-left">
                <Th>Quando</Th>
                <Th>Preset</Th>
                <Th>Status</Th>
                <Th right>Combos</Th>
                <Th right>Calls</Th>
                <Th right>Novas</Th>
                <Th right>Custo</Th>
                <Th right>Duração</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {jobs.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60">
                  <td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                    {new Date(j.createdAt).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300">{j.preset}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_STYLE[j.status].color}`}>
                      {STATUS_STYLE[j.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {j.combosPlanned > 0
                      ? `${(j.combosPlanned - j.combosSkipped).toLocaleString("pt-PT")} / ${j.combosPlanned.toLocaleString("pt-PT")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    {j.callsMade.toLocaleString("pt-PT")}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-emerald-700">
                    {j.leadsNew.toLocaleString("pt-PT")}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-700 dark:text-gray-300">
                    ${j.costUsd.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-gray-500 dark:text-gray-400 text-xs">
                    {formatDuration(j.startedAt, j.endedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th className={`px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400 ${right ? "text-right" : "text-left"}`}>
      {children}
    </th>
  )
}

function ActiveJobCard({ job, onCancel }: { job: ScrapeJob; onCancel: (id: string) => void }) {
  const planned = Math.max(1, job.combosPlanned - job.combosSkipped)
  const done    = Math.min(planned, job.callsMade)
  const pct     = (done / planned) * 100
  const costEur = job.costUsd * EUR_PER_USD
  const budgetPct = (costEur / BUDGET_CAP_EUR) * 100
  const recent = job.recentActivity ?? []
  const sourceLabel = job.lastSource ?? job.lastCell ?? "—"

  return (
    <div className="bg-gradient-to-br from-sky-50 to-white dark:from-sky-950/30 border border-sky-200 dark:border-sky-800/40 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_STYLE[job.status].color}`}>
              {STATUS_STYLE[job.status].label}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">job {job.id.slice(-6)} · preset {job.preset}</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">
            {job.lastSource ? (
              <>📍 <span className="text-sky-700">{sourceLabel}</span> · <span className="font-mono italic text-gray-600 dark:text-gray-400">&ldquo;{job.lastKeyword}&rdquo;</span></>
            ) : (
              "A preparar plano de scrape…"
            )}
          </h3>
        </div>
        <button
          onClick={() => onCancel(job.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-red-600 hover:bg-red-50 hover:border-red-200 shrink-0"
        >
          <Square className="w-3 h-3" /> Cancelar
        </button>
      </div>

      {/* Big stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <BigStat icon={Activity}  label="Calls"        value={job.callsMade.toLocaleString("pt-PT")} />
        <BigStat icon={Database}  label="Leads novas"  value={job.leadsNew.toLocaleString("pt-PT")} accent="emerald" />
        <BigStat icon={DollarSign} label="Custo"       value={`${costEur.toFixed(2)}€`} sub={`$${job.costUsd.toFixed(2)}`} />
        <BigStat icon={Clock}     label="Decorrido"    value={formatDuration(job.startedAt, job.endedAt)} />
      </div>

      {/* Progress bar — combos */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5 tabular-nums">
          <span><strong>Progresso:</strong> {done.toLocaleString("pt-PT")} / {planned.toLocaleString("pt-PT")} combos</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-sky-100 dark:bg-sky-900/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
      </div>

      {/* Progress bar — budget */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1.5 tabular-nums">
          <span><strong>Budget:</strong> {costEur.toFixed(2)}€ / {BUDGET_CAP_EUR}€</span>
          <span className={budgetPct > 90 ? "text-amber-700 font-semibold" : ""}>{budgetPct.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPct > 90 ? "bg-amber-500" : budgetPct > 70 ? "bg-amber-400" : "bg-emerald-500"
            }`}
            style={{ width: `${Math.min(100, budgetPct)}%` }}
          />
        </div>
      </div>

      {/* Live activity log */}
      {recent.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-medium">
            Atividade recente (últimas {recent.length})
          </p>
          <ul className="space-y-1 font-mono text-[11px]">
            {recent.map((r, i) => {
              const ago = Math.max(0, Math.floor((Date.now() / 1000 - r.ts)))
              return (
                <li key={`${r.ts}-${i}`} className={`flex items-baseline gap-2 ${i === 0 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                  <span className="text-gray-400 dark:text-gray-500 tabular-nums w-10 shrink-0">{ago}s</span>
                  <span className="text-sky-700 font-semibold truncate max-w-[180px]">{r.source}</span>
                  <span className="text-gray-400 dark:text-gray-500">·</span>
                  <span className="text-gray-700 dark:text-gray-300 italic truncate flex-1">&ldquo;{r.keyword}&rdquo;</span>
                  <span className={`tabular-nums shrink-0 ${r.found > 0 ? "text-emerald-700 font-semibold" : "text-gray-400 dark:text-gray-500"}`}>
                    {r.found > 0 ? `+${r.found}` : "—"} places
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {job.combosSkipped > 0 && (
        <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
          ✓ {job.combosSkipped.toLocaleString("pt-PT")} combos saltados (já no DB) ·
          poupados ~${(job.combosSkipped * COST_PER_CALL_USD).toFixed(2)} (~{(job.combosSkipped * COST_PER_CALL_USD * EUR_PER_USD).toFixed(2)}€)
        </p>
      )}

      {job.error && (
        <div className="mt-3 px-3 py-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <AlertTriangle className="w-3.5 h-3.5 inline mr-1" /> {job.error}
        </div>
      )}
    </div>
  )
}

function BigStat({
  icon: Icon, label, value, sub, accent,
}: {
  icon: typeof Activity; label: string; value: string; sub?: string; accent?: "emerald"
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-gray-400 dark:text-gray-500" />
        <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      <p className={`text-2xl font-semibold tabular-nums leading-none ${
        accent === "emerald" ? "text-emerald-600" : "text-gray-900 dark:text-gray-100"
      }`}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums mt-1">{sub}</p>}
    </div>
  )
}

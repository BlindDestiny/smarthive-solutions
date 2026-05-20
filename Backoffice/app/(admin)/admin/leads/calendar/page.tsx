import Link from "next/link"
import { CalendarDays, ChevronLeft, ChevronRight, Phone, Video } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { MeetingActions } from "@/components/leads/MeetingActions"

export const dynamic = "force-dynamic"

function parseMonthParam(p: string | undefined) {
  const today = new Date()
  if (!p || !/^\d{4}-\d{2}$/.test(p)) return { year: today.getFullYear(), month: today.getMonth() }
  const [y, m] = p.split("-").map(Number)
  return { year: y, month: m - 1 }
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("pt-PT", { month: "long", year: "numeric" })
}

function shiftMonth(year: number, month: number, delta: number) {
  const d = new Date(year, month + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export default async function CalendarPage({
  searchParams,
}: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams
  const { year, month } = parseMonthParam(params.m)

  // Fetch meetings in this month (a bit of padding for week view borders)
  const start = new Date(year, month, 1)
  const end   = new Date(year, month + 1, 1)

  const meetings = await prisma.leadMeeting.findMany({
    where: { startDt: { gte: start, lt: end } },
    orderBy: { startDt: "asc" },
    include: { lead: { select: { id: true, name: true, city: true, phone: true } } },
  })

  // Group by day-of-month
  const byDay = new Map<number, typeof meetings>()
  for (const m of meetings) {
    const d = new Date(m.startDt).getDate()
    if (!byDay.has(d)) byDay.set(d, [])
    byDay.get(d)!.push(m)
  }

  // Build month grid
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0=sun
  const offset = (firstDayOfMonth + 6) % 7 // shift so monday=0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const todayIso = new Date().toISOString().slice(0, 10)
  const upcoming = meetings.filter((m) => new Date(m.startDt) >= new Date()).slice(0, 10)

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <header className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
          <h1 className="text-3xl font-semibold text-gray-900 capitalize">{monthLabel(year, month)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {meetings.length} reuni{meetings.length === 1 ? "ão" : "ões"} este mês
          </p>
        </div>
        <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          <Link href={`?m=${shiftMonth(year, month, -1)}`} className="p-1.5 rounded hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <Link href="?" className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded">Hoje</Link>
          <Link href={`?m=${shiftMonth(year, month, 1)}`} className="p-1.5 rounded hover:bg-gray-100">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month grid */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
              <div key={d} className="px-2 py-2 text-[11px] font-medium uppercase tracking-widest text-gray-500 text-center">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-6">
            {cells.map((d, idx) => {
              if (d === null) return <div key={idx} className="aspect-square bg-gray-50/40 border-b border-r border-gray-100" />
              const dayIso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
              const isToday = dayIso === todayIso
              const dayMeetings = byDay.get(d) ?? []
              return (
                <div key={idx} className={`aspect-square border-b border-r border-gray-100 p-1.5 overflow-hidden ${isToday ? "bg-sky-50/30" : ""}`}>
                  <div className={`text-xs font-medium mb-1 tabular-nums ${isToday ? "text-sky-700" : "text-gray-700"}`}>{d}</div>
                  <div className="space-y-0.5">
                    {dayMeetings.slice(0, 3).map((m) => (
                      <Link
                        key={m.id}
                        href={`/admin/leads/${m.lead.id}`}
                        className="block text-[10px] leading-tight px-1.5 py-0.5 bg-violet-100 text-violet-800 rounded truncate hover:bg-violet-200"
                        title={`${new Date(m.startDt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })} — ${m.lead.name}`}
                      >
                        {new Date(m.startDt).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })} {m.lead.name}
                      </Link>
                    ))}
                    {dayMeetings.length > 3 && (
                      <p className="text-[10px] text-gray-500 px-1.5">+{dayMeetings.length - 3} mais</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Upcoming list */}
        <div className="bg-white border border-gray-200 rounded-xl">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Próximas reuniões</h3>
            <p className="text-xs text-gray-500">As {Math.min(upcoming.length, 10)} mais próximas</p>
          </div>
          {upcoming.length === 0 ? (
            <div className="p-8 text-center">
              <CalendarDays className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Sem reuniões agendadas neste mês</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {upcoming.map((m) => (
                <li key={m.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-0.5 tabular-nums">
                        {new Date(m.startDt).toLocaleString("pt-PT", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      <Link href={`/admin/leads/${m.lead.id}`} className="text-sm font-medium text-gray-900 hover:text-sky-600 block truncate">
                        {m.lead.name}
                      </Link>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {m.stage.toLowerCase().replace("_", " ")} · {m.durationMin}m
                        {m.lead.city && <> · {m.lead.city}</>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {m.meetLink && (
                        <a href={m.meetLink} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-violet-50 text-violet-600" title="Abrir videochamada">
                          <Video className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {m.lead.phone && (
                        <a href={`tel:${m.lead.phone}`} className="p-1.5 rounded hover:bg-sky-50 text-sky-600" title="Ligar">
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <MeetingActions meetingId={m.id} status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

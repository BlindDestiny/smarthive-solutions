import { CalendarDays } from "lucide-react"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function CalendarPage() {
  const upcoming = await prisma.leadMeeting.findMany({
    where: { status: "SCHEDULED", startDt: { gte: new Date() } },
    orderBy: { startDt: "asc" },
    take: 20,
    include: { lead: { select: { id: true, name: true, city: true } } },
  })

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Calendário</h1>
        <p className="text-sm text-gray-500 mt-1">
          Reuniões marcadas com leads · {upcoming.length} a chegar
        </p>
      </header>

      {upcoming.length === 0 ? (
        <div className="bg-white border border-gray-200 border-dashed rounded-xl p-12 text-center">
          <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">Sem reuniões agendadas</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Marcações chegam aqui depois de gravares uma chamada com outcome
            <strong className="text-gray-700"> Interessado</strong> com slot
            escolhido. Phase 3 vai adicionar vista de calendário mensal,
            slot booking e auto-Meet link.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-gray-500">Quando</th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-gray-500">Lead</th>
                <th className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-widest text-gray-500">Stage</th>
                <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-widest text-gray-500">Duração</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {upcoming.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 tabular-nums text-gray-700">
                    {new Date(m.startDt).toLocaleString("pt-PT", {
                      weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${m.lead.id}`} className="font-medium text-gray-900 hover:text-sky-600">
                      {m.lead.name}
                    </Link>
                    {m.lead.city && <span className="text-gray-400 text-xs ml-2">{m.lead.city}</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{m.stage.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-right text-gray-600 tabular-nums">{m.durationMin}m</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

import { KanbanSquare } from "lucide-react"
import { ALL_STATUSES, STATUS_LABEL, STATUS_COLOR } from "@/lib/leads/types"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function PipelinePage() {
  const counts = await prisma.leadCrmState.groupBy({
    by: ["status"],
    _count: { _all: true },
  })
  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count._all]))

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kanban com drag-drop por status (em construção)
        </p>
      </header>

      {/* Read-only kanban preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
        {ALL_STATUSES.map((status) => (
          <div key={status} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_COLOR[status]}`}>
                {STATUS_LABEL[status]}
              </span>
            </div>
            <p className="text-3xl font-semibold text-gray-900 tabular-nums">
              {(countMap[status] ?? 0).toLocaleString("pt-PT")}
            </p>
            <p className="text-[11px] text-gray-500 mt-1">leads</p>
          </div>
        ))}
      </div>

      {/* Phase placeholder */}
      <div className="bg-white border border-gray-200 border-dashed rounded-xl p-8 text-center">
        <KanbanSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-900">Kanban interactivo em fase 7</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Vai permitir arrastar leads entre colunas, ver aging de cada card,
          e win/loss reporting por período. Já temos os counts em real-time
          em cima como preview.
        </p>
      </div>
    </div>
  )
}

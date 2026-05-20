import { listKanban } from "@/lib/leads/kanban-queries"
import { KanbanBoard } from "@/components/leads/KanbanBoard"

export const dynamic = "force-dynamic"

export default async function PipelinePage() {
  const columns = await listKanban()
  const grandTotal = columns.reduce((s, c) => s + c.total, 0)

  return (
    <div className="p-6 md:p-8 max-w-[1800px] mx-auto">
      <header className="mb-5">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Pipeline</h1>
        <p className="text-sm text-gray-500 mt-1">
          {grandTotal.toLocaleString("pt-PT")} leads em pipeline · arrasta entre colunas para
          mudar o status (até 50 cards por coluna)
        </p>
      </header>

      <KanbanBoard
        initial={columns.map((c) => ({
          status: c.status,
          total: c.total,
          rows: c.rows.map((r) => ({
            id: r.id,
            name: r.name,
            city: r.city,
            reviews: r.reviews,
            rating: r.rating,
            priority: r.priority,
            phone: r.phone,
            email: r.email,
            website: r.website,
            businessType: r.businessType,
            attempts: r.crmState?.attempts ?? 0,
          })),
        }))}
      />
    </div>
  )
}

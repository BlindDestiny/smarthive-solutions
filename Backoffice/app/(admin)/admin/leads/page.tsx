import { prisma } from "@/lib/prisma"
import { PhoneCall, Users, Building2, CheckCircle2, ArrowRight } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
  const [total, byStatus, withWebsite, withEmail, withPhone] = await Promise.all([
    prisma.lead.count(),
    prisma.leadCrmState.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.count({ where: { website: { not: null } } }),
    prisma.lead.count({ where: { email: { not: null } } }),
    prisma.lead.count({ where: { phone: { not: null } } }),
  ])

  const statusCounts = Object.fromEntries(
    byStatus.map((b) => [b.status, b._count._all]),
  )

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">
            Lead Machine
          </p>
          <h1 className="text-3xl font-semibold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            Pipeline de prospeção. Cada lead representa um negócio identificado
            como potencial cliente — desde o primeiro contacto até ao fecho.
          </p>
        </div>
      </div>

      {/* Empty state — DB sem leads ainda */}
      {total === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <PhoneCall className="w-6 h-6 text-sky-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Ainda sem leads importados
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            O schema CRM está pronto e à espera. O próximo passo é correr o script
            de migração que importa os CSVs do{" "}
            <code className="text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded text-xs">
              01_PROSPEÇÃO/script/
            </code>{" "}
            para esta base de dados.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 font-mono">
            <code className="bg-gray-100 px-2 py-1 rounded">
              npm run db:import-leads
            </code>
            <span>·</span>
            <span>migra crm_data + activity + meetings + scored</span>
          </div>
        </div>
      )}

      {/* Stats — só quando há leads */}
      {total > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total leads"
              value={total}
              icon={Users}
              color="sky"
            />
            <StatCard
              label="Com website"
              value={withWebsite}
              icon={Building2}
              color="emerald"
            />
            <StatCard
              label="Com email"
              value={withEmail}
              icon={Building2}
              color="amber"
            />
            <StatCard
              label="Com telefone"
              value={withPhone}
              icon={PhoneCall}
              color="violet"
            />
          </div>

          {/* Pipeline counts */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Pipeline
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                "NEW",
                "CONTACTED",
                "REPLIED",
                "INTERESTED",
                "MEETING",
                "PROPOSAL",
                "CLOSED_WON",
                "CLOSED_LOST",
              ].map((status) => (
                <div key={status}>
                  <p className="text-2xl font-semibold text-gray-900">
                    {statusCounts[status] || 0}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                    {status.replace("_", " ").toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links to coming sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PlaceholderCard
              title="Tabela de leads"
              desc="View virtualizada com filtros, search por nome, sort por priority. Click abre detalhe."
              status="Próximo"
            />
            <PlaceholderCard
              title="Speed-call dialog"
              desc="3 versões de pitch (V1/V2/V3) + objection cheatsheet por vertical detetado."
              status="Próximo"
            />
            <PlaceholderCard
              title="Pipeline kanban"
              desc="Drag-drop por status. Aging de cards. Win/loss reporting."
              status="Em planeamento"
            />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: "sky" | "emerald" | "amber" | "violet"
}) {
  const colorMap = {
    sky: "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-500">
          {label}
        </p>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {value.toLocaleString("pt-PT")}
      </p>
    </div>
  )
}

function PlaceholderCard({
  title,
  desc,
  status,
}: {
  title: string
  desc: string
  status: string
}) {
  return (
    <div className="bg-white border border-gray-200 border-dashed rounded-xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle2 className="w-4 h-4 text-gray-300" />
        <span className="text-[10px] uppercase tracking-widest text-gray-500">
          {status}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{desc}</p>
    </div>
  )
}

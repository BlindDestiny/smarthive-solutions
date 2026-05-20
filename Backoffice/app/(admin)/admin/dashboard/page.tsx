import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Users, Globe, CreditCard, Activity } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

async function getAdminStats() {
  const [totalTenants, activeTenants, totalUsers, recentLogs] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: true, tenant: true },
    }),
  ])
  return { totalTenants, activeTenants, totalUsers, recentLogs }
}

export default async function AdminDashboard() {
  const session = await auth()
  const { totalTenants, activeTenants, totalUsers, recentLogs } = await getAdminStats()

  const stats = [
    { label: "Total de Clientes", value: totalTenants, icon: Users, color: "bg-blue-50 text-blue-600" },
    { label: "Clientes Ativos", value: activeTenants, icon: Activity, color: "bg-green-50 text-green-600" },
    { label: "Utilizadores", value: totalUsers, icon: Globe, color: "bg-purple-50 text-purple-600" },
    { label: "Planos Ativos", value: activeTenants, icon: CreditCard, color: "bg-amber-50 text-amber-600" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bom dia, {session?.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Aqui está o resumo da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Atividade Recente</h2>
          {recentLogs.length === 0 ? (
            <p className="text-gray-400 text-sm">Sem atividade registada.</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium">{log.action}</p>
                    <p className="text-xs text-gray-400">
                      {log.user?.name || "Sistema"} · {log.tenant?.name || ""} · {formatDate(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link href="/admin/clients/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-9 h-9 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Criar novo cliente</p>
                <p className="text-xs text-gray-400">Adicionar tenant e utilizador</p>
              </div>
            </Link>
            <Link href="/admin/clients" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Ver todos os clientes</p>
                <p className="text-xs text-gray-400">Gerir tenants e planos</p>
              </div>
            </Link>
            <Link href="/admin/plans" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
              <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Gerir planos</p>
                <p className="text-xs text-gray-400">Ver e editar planos SaaS</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

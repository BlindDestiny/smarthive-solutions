import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, ExternalLink, Settings } from "lucide-react"
import { formatDate } from "@/lib/utils"
import TenantStatusBadge from "@/components/admin/TenantStatusBadge"

async function getTenants() {
  return prisma.tenant.findMany({
    include: { plan: true, users: { where: { role: "CLIENT" }, take: 1 }, website: true },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ClientsPage() {
  const tenants = await getTenants()

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">{tenants.length} tenants registados</p>
        </div>
        <Link href="/admin/clients/new" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Plano</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Estado</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Website</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Criado</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tenant.name}</p>
                    <p className="text-xs text-gray-400">/{tenant.slug}</p>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="text-sm text-gray-700">{tenant.plan?.name ?? "—"}</span></td>
                <td className="px-6 py-4"><TenantStatusBadge status={tenant.status} /></td>
                <td className="px-6 py-4">
                  {tenant.website?.vercelUrl ? (
                    <a href={tenant.website.vercelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700">
                      Ver site <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span className="text-sm text-gray-400">—</span>}
                </td>
                <td className="px-6 py-4"><span className="text-sm text-gray-500">{formatDate(tenant.createdAt)}</span></td>
                <td className="px-6 py-4">
                  <Link href={`/admin/clients/${tenant.id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <Settings className="w-4 h-4" /> Gerir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tenants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">Nenhum cliente criado ainda.</p>
            <Link href="/admin/clients/new" className="text-sky-600 text-sm hover:underline mt-2 inline-block">Criar primeiro cliente</Link>
          </div>
        )}
      </div>
    </div>
  )
}

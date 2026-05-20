import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export default async function LogsPage() {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: { user: true, tenant: true },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Logs de Atividade</h1>
        <p className="text-gray-500 mt-1">Últimas 50 ações registadas na plataforma.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Ação</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Utilizador</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-6 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-gray-100 text-gray-700">{log.action}</span></td>
                <td className="px-6 py-3 text-sm text-gray-700">{log.user?.name || "—"}</td>
                <td className="px-6 py-3 text-sm text-gray-700">{log.tenant?.name || "—"}</td>
                <td className="px-6 py-3 text-sm text-gray-400">{formatDate(log.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && <div className="text-center py-12"><p className="text-gray-400 text-sm">Sem logs registados.</p></div>}
      </div>
    </div>
  )
}

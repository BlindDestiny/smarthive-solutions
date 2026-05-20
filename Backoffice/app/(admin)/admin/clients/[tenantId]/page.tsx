import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import TenantStatusBadge from "@/components/admin/TenantStatusBadge"
import EditTenantForm from "@/components/admin/EditTenantForm"
import SchemaEditor from "@/components/admin/SchemaEditor"
import ImpersonateButton from "@/components/admin/ImpersonateButton"
import WebsiteFeaturesForm from "@/components/admin/WebsiteFeaturesForm"
import { formatDate } from "@/lib/utils"
import { type ContentSchema } from "@/lib/content-schema"

export default async function TenantDetailPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      plan: true,
      users: { where: { role: "CLIENT" } },
      website: { select: { id: true, vercelUrl: true, contentSchema: true, hasEvents: true, hasSocial: true, hasMenu: true, hasReservations: true } },
      auditLogs: { take: 10, orderBy: { createdAt: "desc" }, include: { user: true } },
    },
  })

  if (!tenant) notFound()

  const plans = await prisma.plan.findMany()
  const schema = (tenant.website?.contentSchema ?? []) as ContentSchema

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/clients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar aos clientes
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
            <TenantStatusBadge status={tenant.status} />
          </div>
          <p className="text-gray-400 text-sm">/{tenant.slug} · Criado em {formatDate(tenant.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <ImpersonateButton tenantId={tenantId} />
          {tenant.website?.vercelUrl && (
            <a href={tenant.website.vercelUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-300 px-3 py-1.5 rounded-lg transition-colors">
              Ver website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Configurações gerais */}
        <EditTenantForm tenant={tenant} plans={plans} />

        {/* Funcionalidades */}
        {tenant.website && (
          <WebsiteFeaturesForm
            tenantId={tenantId}
            features={{
              hasEvents:       tenant.website.hasEvents,
              hasSocial:       tenant.website.hasSocial,
              hasMenu:         tenant.website.hasMenu,
              hasReservations: tenant.website.hasReservations,
            }}
          />
        )}

        {/* Schema de conteúdo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="mb-5">
            <h2 className="font-medium text-gray-900">Schema de Conteúdo</h2>
            <p className="text-sm text-gray-400 mt-1">
              Define quais campos o cliente pode editar no website. Usa templates ou cria campos personalizados.
            </p>
          </div>
          <SchemaEditor tenantId={tenantId} initialFields={schema} />
        </div>

        {/* Utilizadores */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-medium text-gray-900 mb-4">Utilizadores</h2>
          <div className="space-y-3">
            {tenant.users.map((user: { id: string; name: string; email: string }) => (
              <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {user.name[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
            ))}
            {tenant.users.length === 0 && <p className="text-sm text-gray-400">Nenhum utilizador associado.</p>}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-medium text-gray-900 mb-4">Histórico de Atividade</h2>
          {tenant.auditLogs.length === 0 ? (
            <p className="text-sm text-gray-400">Sem atividade registada.</p>
          ) : (
            <div className="space-y-2">
              {tenant.auditLogs.map((log: { id: string; action: string; createdAt: Date; user: { name: string } | null }) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-800">{log.action}</p>
                    <p className="text-xs text-gray-400">{log.user?.name || "Sistema"} · {formatDate(log.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

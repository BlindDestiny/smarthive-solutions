import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ClientSidebar from "@/components/client/ClientSidebar"

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")
  if (session.user.role === "ADMIN") redirect("/admin/dashboard")
  if (!session.user.tenantId) redirect("/login")

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: {
      name: true,
      slug: true,
      status: true,
      website: { select: { hasEvents: true, hasSocial: true, hasMenu: true, hasReservations: true } },
    },
  })

  if (!tenant || tenant.status === "SUSPENDED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Conta suspensa</p>
          <p className="text-gray-500">Contacte o suporte para mais informações.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ClientSidebar
        tenantName={tenant.name}
        tenantSlug={tenant.slug}
        hasEvents={tenant.website?.hasEvents ?? false}
        hasSocial={tenant.website?.hasSocial ?? true}
        hasMenu={tenant.website?.hasMenu ?? false}
        hasReservations={tenant.website?.hasReservations ?? false}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

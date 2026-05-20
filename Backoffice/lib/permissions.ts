import { prisma } from "./prisma"
import { auth } from "./auth"

export async function requireAdmin() {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return null
  }
  return session
}

export async function requireClient() {
  const session = await auth()
  if (!session || !session.user.tenantId) {
    return null
  }
  return session
}

export async function getClientWebsite(tenantId: string) {
  return prisma.website.findUnique({
    where: { tenantId },
    include: {
      contents: true,
      events: { orderBy: { date: "asc" } },
      socialLinks: { orderBy: { order: "asc" } },
    },
  })
}

export async function getTenantWithPlan(tenantId: string) {
  return prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { plan: true },
  })
}

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"
import { triggerClientRedeploy } from "@/lib/publish"

export async function POST() {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tenantId = session.user.tenantId!

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { slug: true },
  })
  if (!tenant) return NextResponse.json({ error: "Tenant não encontrado." }, { status: 404 })

  await prisma.website.update({
    where: { tenantId },
    data: { isDraft: false, publishedAt: new Date() },
  })

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: session.user.id,
      action: "PUBLISH",
      metadata: { slug: tenant.slug },
    },
  })

  // Trigger redeploy (silently fails if hook não configurado)
  await triggerClientRedeploy(tenant.slug).catch(console.error)

  return NextResponse.json({ ok: true, publishedAt: new Date().toISOString() })
}

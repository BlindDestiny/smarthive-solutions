import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/permissions"
import { updateWebsiteFeaturesSchema } from "@/lib/validations"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateWebsiteFeaturesSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const tenant = await prisma.tenant.findUnique({ where: { id }, select: { website: { select: { id: true } } } })
  if (!tenant?.website) return NextResponse.json({ error: "Website não encontrado." }, { status: 404 })

  const website = await prisma.website.update({
    where: { id: tenant.website.id },
    data: parsed.data,
  })

  await prisma.auditLog.create({
    data: {
      tenantId: id,
      userId: session.user.id,
      action: "UPDATE_WEBSITE_FEATURES",
      metadata: parsed.data,
    },
  })

  return NextResponse.json(website)
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/permissions"
import { updateTenantSchema } from "@/lib/validations"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateTenantSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const tenant = await prisma.tenant.update({
    where: { id },
    data: parsed.data,
  })

  await prisma.auditLog.create({
    data: {
      tenantId: id,
      userId: session.user.id,
      action: "UPDATE_TENANT",
      metadata: parsed.data,
    },
  })

  return NextResponse.json(tenant)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  await prisma.tenant.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

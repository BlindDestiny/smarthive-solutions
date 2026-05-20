import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"
import { updateMenuItemSchema } from "@/lib/validations"

async function getItemForClient(id: string, tenantId: string) {
  return prisma.menuItem.findFirst({
    where: { id, website: { tenantId } },
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const item = await getItemForClient(id, session.user.tenantId!)
  if (!item) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 })

  const body = await req.json()
  const parsed = updateMenuItemSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const updated = await prisma.menuItem.update({ where: { id }, data: parsed.data })
  await prisma.website.update({ where: { id: item.websiteId }, data: { isDraft: true } })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const item = await getItemForClient(id, session.user.tenantId!)
  if (!item) return NextResponse.json({ error: "Item não encontrado." }, { status: 404 })

  await prisma.menuItem.delete({ where: { id } })
  await prisma.website.update({ where: { id: item.websiteId }, data: { isDraft: true } })

  return NextResponse.json({ ok: true })
}

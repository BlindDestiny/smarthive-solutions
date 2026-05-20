import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"
import { z } from "zod"

const updateEventSchema = z.object({
  title:       z.string().min(1).optional(),
  description: z.string().optional(),
  date:        z.string().datetime().optional(),
  price:       z.number().nullable().optional(),
  capacity:    z.number().nullable().optional(),
  imageUrl:    z.string().url().nullable().optional(),
  isPublished: z.boolean().optional(),
  isEnded:     z.boolean().optional(),
})

async function getEventForTenant(id: string, tenantId: string) {
  return prisma.event.findFirst({
    where: { id, website: { tenantId } },
  })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = updateEventSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const event = await getEventForTenant(id, session.user.tenantId!)
  if (!event) return NextResponse.json({ error: "Não encontrado." }, { status: 404 })

  const updated = await prisma.event.update({
    where: { id },
    data: { ...parsed.data, updatedAt: new Date() },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const event = await getEventForTenant(id, session.user.tenantId!)
  if (!event) return NextResponse.json({ error: "Não encontrado." }, { status: 404 })

  await prisma.event.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

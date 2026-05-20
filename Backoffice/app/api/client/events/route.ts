import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"
import { createEventSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = createEventSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const website = await prisma.website.findUnique({
    where: { tenantId: session.user.tenantId! },
    select: { id: true },
  })
  if (!website) return NextResponse.json({ error: "Website não encontrado." }, { status: 404 })

  const event = await prisma.event.create({
    data: { ...parsed.data, websiteId: website.id },
  })

  await prisma.website.update({ where: { id: website.id }, data: { isDraft: true } })

  return NextResponse.json(event, { status: 201 })
}

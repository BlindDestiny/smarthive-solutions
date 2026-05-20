import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"
import { updateWebsiteContentSchema } from "@/lib/validations"

export async function GET() {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const website = await prisma.website.findUnique({
    where: { tenantId: session.user.tenantId! },
    include: { contents: true, events: true, socialLinks: true },
  })

  return NextResponse.json(website)
}

export async function PATCH(req: NextRequest) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const parsed = updateWebsiteContentSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const website = await prisma.website.findUnique({
    where: { tenantId: session.user.tenantId! },
    select: { id: true },
  })
  if (!website) return NextResponse.json({ error: "Website não encontrado." }, { status: 404 })

  // Upsert cada campo de conteúdo
  await Promise.all(
    Object.entries(parsed.data.contents).map(([key, value]) =>
      prisma.websiteContent.upsert({
        where: { websiteId_key: { websiteId: website.id, key } },
        update: { value, updatedAt: new Date() },
        create: { websiteId: website.id, key, value },
      })
    )
  )

  // Marcar como draft (tem alterações por publicar)
  await prisma.website.update({
    where: { id: website.id },
    data: { isDraft: true, updatedAt: new Date() },
  })

  await prisma.auditLog.create({
    data: {
      tenantId: session.user.tenantId!,
      userId: session.user.id,
      action: "UPDATE_CONTENT",
    },
  })

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const link = await prisma.socialLink.findUnique({
    where: { id },
    include: { website: { select: { tenantId: true } } },
  })

  if (!link || link.website.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 })
  }

  await prisma.socialLink.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

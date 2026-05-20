import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/permissions"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { tenantId } = await req.json()
  if (!tenantId) return NextResponse.json({ error: "tenantId obrigatório" }, { status: 400 })

  const clientUser = await prisma.user.findFirst({
    where: { tenantId, role: "CLIENT" },
    select: { id: true, name: true },
  })
  if (!clientUser) return NextResponse.json({ error: "Nenhum utilizador neste tenant." }, { status: 404 })

  const token = randomBytes(32).toString("hex")
  const expiry = new Date(Date.now() + 1000 * 60 * 10) // 10 minutos

  await prisma.user.update({
    where: { id: clientUser.id },
    data: { impersonateToken: token, impersonateExpiry: expiry },
  })

  await prisma.auditLog.create({
    data: {
      tenantId,
      userId: session.user.id,
      action: "IMPERSONATE",
      metadata: { targetUserId: clientUser.id, targetName: clientUser.name },
    },
  })

  return NextResponse.json({ token, userName: clientUser.name })
}

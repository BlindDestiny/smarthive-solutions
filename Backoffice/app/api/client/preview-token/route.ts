import { NextResponse } from "next/server"
import { requireClient } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { previewTokens } from "@/lib/preview-tokens"

export async function POST() {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId! },
    select: { slug: true },
  })
  if (!tenant) return NextResponse.json({ error: "Tenant não encontrado." }, { status: 404 })

  const token = randomBytes(24).toString("hex")
  const expiry = new Date(Date.now() + 1000 * 60 * 30) // 30 minutos

  previewTokens.set(token, {
    tenantId: session.user.tenantId!,
    slug: tenant.slug,
    expiry,
  })

  return NextResponse.json({ token, slug: tenant.slug })
}

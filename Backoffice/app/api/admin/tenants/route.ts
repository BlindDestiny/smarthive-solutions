import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/permissions"
import { createTenantSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const tenants = await prisma.tenant.findMany({
    include: { plan: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(tenants)
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const body = await req.json()
  const parsed = createTenantSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { name, slug, planId, userEmail, userName, userPassword } = parsed.data

  const existing = await prisma.tenant.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: "Slug já em uso." }, { status: 409 })

  const passwordHash = await bcrypt.hash(userPassword, 12)

  const tenant = await prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name,
        slug,
        planId: planId || null,
        status: "TRIAL",
      },
    })

    await tx.user.create({
      data: {
        email: userEmail,
        passwordHash,
        name: userName,
        role: "CLIENT",
        tenantId: tenant.id,
      },
    })

    await tx.website.create({
      data: {
        tenantId: tenant.id,
        isDraft: true,
        contents: {
          create: [
            { key: "hero.title", value: name },
            { key: "hero.subtitle", value: "" },
            { key: "about.text", value: "" },
          ],
        },
      },
    })

    await tx.auditLog.create({
      data: {
        tenantId: tenant.id,
        userId: session.user.id,
        action: "CREATE_TENANT",
        metadata: { name, slug },
      },
    })

    return tenant
  })

  return NextResponse.json(tenant, { status: 201 })
}

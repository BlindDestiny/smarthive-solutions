import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/permissions"
import { z } from "zod"

const fieldSchema = z.object({
  key:         z.string().min(1),
  label:       z.string().min(1),
  type:        z.enum(["text", "textarea", "image", "url", "email", "phone", "color", "number"]),
  section:     z.string().min(1),
  placeholder: z.string().optional(),
  required:    z.boolean().optional(),
  hint:        z.string().optional(),
})

const schemaPayload = z.object({
  fields: z.array(fieldSchema),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const website = await prisma.website.findUnique({
    where: { tenantId: id },
    select: { contentSchema: true },
  })

  return NextResponse.json({ fields: website?.contentSchema ?? [] })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const parsed = schemaPayload.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const website = await prisma.website.update({
    where: { tenantId: id },
    data: { contentSchema: parsed.data.fields },
  })

  await prisma.auditLog.create({
    data: {
      tenantId: id,
      userId: session.user.id,
      action: "UPDATE_CONTENT_SCHEMA",
      metadata: { fieldCount: parsed.data.fields.length },
    },
  })

  return NextResponse.json({ ok: true, fieldCount: parsed.data.fields.length })
}

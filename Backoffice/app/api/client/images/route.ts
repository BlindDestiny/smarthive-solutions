import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const tenantId = session.user.tenantId!
  const formData = await req.formData()
  const file = formData.get("file") as File | null

  if (!file) return NextResponse.json({ error: "Nenhum ficheiro enviado." }, { status: 400 })

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de ficheiro não suportado." }, { status: 400 })
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: "Ficheiro demasiado grande (max 5MB)." }, { status: 400 })
  }

  const ext = file.name.split(".").pop()
  const filename = `${randomUUID()}.${ext}`
  const uploadDir = join(process.cwd(), "public", "uploads", tenantId)

  await mkdir(uploadDir, { recursive: true })

  const bytes = await file.arrayBuffer()
  await writeFile(join(uploadDir, filename), Buffer.from(bytes))

  const url = `/uploads/${tenantId}/${filename}`
  const r2Key = `${tenantId}/images/${filename}`

  const mediaFile = await prisma.mediaFile.create({
    data: {
      tenantId,
      filename: file.name,
      url,
      r2Key,
      size: file.size,
      mimeType: file.type,
    },
  })

  return NextResponse.json({ id: mediaFile.id, url, filename: file.name }, { status: 201 })
}

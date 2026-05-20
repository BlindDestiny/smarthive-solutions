import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireClient } from "@/lib/permissions"
import { unlink } from "fs/promises"
import { join } from "path"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireClient()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const file = await prisma.mediaFile.findUnique({ where: { id } })

  if (!file || file.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Não encontrado." }, { status: 404 })
  }

  // Apagar do disco local (dev)
  if (file.url.startsWith("/uploads/")) {
    const localPath = join(process.cwd(), "public", file.url)
    await unlink(localPath).catch(() => {})
  }

  await prisma.mediaFile.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

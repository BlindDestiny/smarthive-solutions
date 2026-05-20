/**
 * GET /api/scrape/jobs/[id]
 *
 * Used by Python scraper (with Bearer token) to poll cancellation status,
 * AND by the UI (with session) to inspect a specific job.
 */
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = process.env.INGEST_TOKEN
  const authHeader = req.headers.get("authorization")
  const isBackend = token && authHeader && authHeader.slice(7) === token

  if (!isBackend) {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const job = await prisma.scrapeJob.findUnique({ where: { id } })
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(job)
}

/**
 * POST /api/scrape/progress
 *
 * Called by the Python scraper to push live progress updates back to the
 * Backoffice. Used for the UI polling.
 */
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { ScrapeJobStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

const Body = z.object({
  jobId:         z.string().min(1),
  status:        z.nativeEnum(ScrapeJobStatus).optional(),
  cellsPlanned:  z.number().int().optional(),
  combosPlanned: z.number().int().optional(),
  combosSkipped: z.number().int().optional(),
  callsMade:     z.number().int().optional(),
  leadsNew:      z.number().int().optional(),
  leadsTotal:    z.number().int().optional(),
  lastCell:      z.string().nullable().optional(),
  lastKeyword:   z.string().nullable().optional(),
  costUsd:       z.number().optional(),
  error:         z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  const token = process.env.INGEST_TOKEN
  if (!token) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  const auth = req.headers.get("authorization")
  if (!auth || auth.slice(7) !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const parsed = Body.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", issues: parsed.error.issues }, { status: 400 })
  }
  const { jobId, ...rest } = parsed.data

  const data: Record<string, unknown> = { ...rest }
  // Track lifecycle timestamps
  if (rest.status === "RUNNING")    data.startedAt = new Date()
  if (rest.status === "COMPLETED" ||
      rest.status === "FAILED"    ||
      rest.status === "CANCELLED") data.endedAt = new Date()

  await prisma.scrapeJob.update({
    where: { id: jobId },
    data,
  })
  return NextResponse.json({ ok: true })
}

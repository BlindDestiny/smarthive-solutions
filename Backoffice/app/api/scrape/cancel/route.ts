/**
 * POST /api/scrape/cancel
 * Body: { jobId: string }
 *
 * Marks the job as CANCELLED. The Python scraper polls its own status every
 * ~25 combos and exits gracefully when it sees CANCELLED.
 */
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

const Body = z.object({ jobId: z.string().min(1) })

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = Body.safeParse(await req.json().catch(() => ({})))
  if (!body.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 })

  const job = await prisma.scrapeJob.findUnique({ where: { id: body.data.jobId } })
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (job.status !== "RUNNING" && job.status !== "PENDING") {
    return NextResponse.json({ error: `Job já está ${job.status}` }, { status: 409 })
  }

  await prisma.scrapeJob.update({
    where: { id: body.data.jobId },
    data: { status: "CANCELLED", endedAt: new Date() },
  })

  // Best-effort kill if pid is known
  if (job.pid) {
    try { process.kill(job.pid) } catch { /* may already be gone */ }
  }

  return NextResponse.json({ ok: true })
}

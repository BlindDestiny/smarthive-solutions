/**
 * POST /api/scrape/start
 *
 * Body: { preset: "quick" | "standard" | "full", keywords?: string[] }
 *
 * Creates a ScrapeJob row and spawns the Python scraper as a detached
 * subprocess. Returns the new job id so the UI can start polling progress.
 */
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { spawn } from "node:child_process"
import path from "node:path"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

const Body = z.object({
  preset:   z.enum(["quick", "standard", "full"]),
  keywords: z.array(z.string()).max(200).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Only ADMIN can start scrape jobs" }, { status: 403 })
  }

  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const parsed = Body.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", issues: parsed.error.issues }, { status: 400 })
  }
  const { preset, keywords } = parsed.data

  // Don't allow two RUNNING jobs at once (they'd burn API credit in parallel)
  const running = await prisma.scrapeJob.count({
    where: { status: { in: ["PENDING", "RUNNING"] } },
  })
  if (running > 0) {
    return NextResponse.json(
      { error: "Já existe um scrape em curso. Espera ou cancela primeiro." },
      { status: 409 },
    )
  }

  // Resolve scraper.py path
  const scraperPath = process.env.SCRAPER_PATH
    || path.resolve(process.cwd(), "..", "01_PROSPEÇÃO", "script", "scraper.py")

  // Create the job row
  const job = await prisma.scrapeJob.create({
    data: {
      userId: session.user.id,
      preset,
      keywords: keywords ?? [],
      status: "PENDING",
    },
  })

  // Spawn the python process detached so it survives Next dev restarts
  try {
    const child = spawn(
      process.platform === "win32" ? "python" : "python3",
      [scraperPath, "--job-id", job.id, "--preset", preset],
      {
        cwd: path.dirname(scraperPath),
        detached: true,
        stdio: "ignore",
        env: {
          ...process.env,
          BACKOFFICE_URL: process.env.BACKOFFICE_URL || `http://localhost:${process.env.PORT || "3010"}`,
        },
      },
    )
    child.unref()

    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: { pid: child.pid, status: "PENDING" },
    })

    return NextResponse.json({ ok: true, jobId: job.id, pid: child.pid })
  } catch (e) {
    await prisma.scrapeJob.update({
      where: { id: job.id },
      data: { status: "FAILED", error: (e as Error).message, endedAt: new Date() },
    })
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

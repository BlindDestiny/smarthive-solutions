/**
 * GET /api/scrape/jobs — list recent scrape jobs (for UI polling)
 */
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const jobs = await prisma.scrapeJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { user: { select: { name: true, email: true } } },
  })
  return NextResponse.json({ jobs })
}

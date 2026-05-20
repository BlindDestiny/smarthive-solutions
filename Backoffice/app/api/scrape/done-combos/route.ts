/**
 * GET /api/scrape/done-combos
 *
 * Returns DISTINCT (lat, lon, keyword) tuples for every lead already in the DB
 * — so the Python scraper can skip combos that were already executed in past
 * runs. Bearer-token protected (uses the same INGEST_TOKEN as the ingest path).
 */
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const token = process.env.INGEST_TOKEN
  if (!token) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 })
  const auth = req.headers.get("authorization")
  if (!auth || auth.slice(7) !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rows = await prisma.lead.findMany({
    where: { lat: { not: null }, lng: { not: null }, keyword: { not: null } },
    select: { lat: true, lng: true, keyword: true },
    distinct: ["lat", "lng", "keyword"],
  })

  return NextResponse.json({
    combos: rows.map((r) => ({ lat: r.lat, lon: r.lng, keyword: r.keyword })),
    count: rows.length,
  })
}

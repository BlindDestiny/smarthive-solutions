/**
 * POST /api/leads/ingest
 *
 * Bulk-upsert endpoint for the Python scraper / enrichment pipeline.
 * Authentication: Bearer token in the `Authorization` header that must match
 * the `INGEST_TOKEN` env var.
 *
 * Body: { "leads": [ { placeId, name, ...optional fields }, ... ] }
 *
 * Idempotent: upserts by placeId. Detects businessType automatically via
 * the shared lib/pitch logic, so scrapers don't need to classify.
 *
 * Example call from Python:
 *
 *   import requests, csv, os
 *   token = os.environ["INGEST_TOKEN"]
 *   batch = [{"placeId": "...", "name": "...", "city": "...", ...}]
 *   r = requests.post(
 *       "http://localhost:3010/api/leads/ingest",
 *       headers={"Authorization": f"Bearer {token}"},
 *       json={"leads": batch},
 *       timeout=60,
 *   )
 *   print(r.json())  # { upserted: 100, skipped: 0, errors: [] }
 */

import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { detectBusinessType } from "@/lib/pitch"
import { LeadBusinessType } from "@prisma/client"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const LeadSchema = z.object({
  placeId:      z.string().min(1),
  name:         z.string().min(1).max(500),
  category:     z.string().nullable().optional(),
  keyword:      z.string().nullable().optional(),
  city:         z.string().nullable().optional(),
  address:      z.string().nullable().optional(),
  lat:          z.number().nullable().optional(),
  lng:          z.number().nullable().optional(),
  phone:        z.string().nullable().optional(),
  email:        z.string().nullable().optional(),
  website:      z.string().nullable().optional(),
  rating:       z.number().nullable().optional(),
  reviews:      z.number().int().nullable().optional(),
  googleUrl:    z.string().nullable().optional(),
  priority:     z.number().int().min(0).max(100).nullable().optional(),
  source:       z.string().optional(),
})

const BodySchema = z.object({
  leads: z.array(LeadSchema).min(1).max(1000), // safety cap
})

function cleanPhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, "")
  let n = digits
  if (n.startsWith("00351") && n.length === 14) n = n.slice(5)
  else if (n.startsWith("351") && n.length === 12) n = n.slice(3)
  return n.length === 9 ? n : null
}

export async function POST(req: NextRequest) {
  // ── auth ──────────────────────────────────────────────────────
  const token = process.env.INGEST_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "Server misconfigured: INGEST_TOKEN env var not set" },
      { status: 500 },
    )
  }
  const auth = req.headers.get("authorization")
  if (!auth || !auth.startsWith("Bearer ") || auth.slice(7) !== token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ── body ──────────────────────────────────────────────────────
  let body: unknown
  try { body = await req.json() }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body", issues: parsed.error.issues },
      { status: 400 },
    )
  }
  const { leads } = parsed.data

  // ── upsert in batched transactions ────────────────────────────
  const BATCH = 50
  let upserted = 0
  const errors: { placeId: string; message: string }[] = []

  for (let i = 0; i < leads.length; i += BATCH) {
    const chunk = leads.slice(i, i + BATCH)
    try {
      await prisma.$transaction(chunk.map((lead) => {
        const phoneClean = cleanPhone(lead.phone)
        const data = {
          placeId:      lead.placeId,
          name:         lead.name,
          category:     lead.category ?? null,
          keyword:      lead.keyword ?? null,
          city:         lead.city ?? null,
          address:      lead.address ?? null,
          lat:          lead.lat ?? null,
          lng:          lead.lng ?? null,
          phone:        lead.phone ?? null,
          phoneClean,
          whatsappLink: phoneClean ? `https://wa.me/351${phoneClean}` : null,
          email:        lead.email ?? null,
          website:      lead.website ?? null,
          rating:       lead.rating ?? null,
          reviews:      lead.reviews ?? 0,
          googleUrl:    lead.googleUrl ?? null,
          businessType: detectBusinessType({
            keyword:  lead.keyword,
            category: lead.category,
            name:     lead.name,
          }),
          priority:     lead.priority ?? 0,
          source:       lead.source ?? "api",
          enrichedAt:   new Date(),
        }
        return prisma.lead.upsert({
          where:  { placeId: lead.placeId },
          create: data,
          update: data,
        })
      }))
      upserted += chunk.length
    } catch (e) {
      // If the batch transaction fails, record errors and continue
      errors.push(...chunk.map((l) => ({
        placeId: l.placeId,
        message: (e as Error).message,
      })))
    }
  }

  return NextResponse.json({
    received: leads.length,
    upserted,
    skipped:  leads.length - upserted - errors.length,
    errors:   errors.slice(0, 50), // cap response size
  })
}

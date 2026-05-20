/**
 * Import legacy CSV state into Postgres.
 *
 * Source files (all under ../01_PROSPEÇÃO/script/):
 *   leads_master.csv   — master rows (15k)
 *   leads_scored.csv   — enriched/scored subset (~10k, with lat/lon, website scoring)
 *   crm_data.csv       — per-lead CRM state (~3k) — status, attempts, answered…
 *   crm_activity.csv   — append-only activity log (~7k events)
 *   meetings.csv       — meetings (currently missing — skipped if absent)
 *
 * Behavior:
 *   - Leads merged by place_id; `scored` fields take precedence over `master`
 *   - businessType auto-detected via lib/pitch.detectBusinessType
 *   - Idempotent: re-running upserts leads/crm_state, but skips activity rows
 *     for any lead that already has at least one activity entry (to avoid dupes
 *     since the legacy log has no stable id)
 *
 * Run with:  npm run db:import-leads
 */

import {
  PrismaClient,
  LeadStatus,
  LeadCallAnswer,
  LeadOwnerType,
  LeadChannel,
  LeadActivityType,
} from "@prisma/client"
import { parse } from "csv-parse/sync"
import { readFileSync, existsSync } from "fs"
import { join } from "path"
import { detectBusinessType } from "../lib/pitch"

const SCRIPT_DIR = join(process.cwd(), "..", "01_PROSPEÇÃO", "script")

const FILES = {
  master:   join(SCRIPT_DIR, "leads_master.csv"),
  scored:   join(SCRIPT_DIR, "leads_scored.csv"),
  crm:      join(SCRIPT_DIR, "crm_data.csv"),
  activity: join(SCRIPT_DIR, "crm_activity.csv"),
  meetings: join(SCRIPT_DIR, "meetings.csv"),
}

const prisma = new PrismaClient()

// ─────────────── parsing helpers ───────────────

function loadCsv<T = Record<string, string>>(path: string): T[] {
  if (!existsSync(path)) return []
  const content = readFileSync(path, "utf-8")
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as T[]
}

const NULL_TOKENS = new Set(["", "nan", "NaN", "none", "None", "—", "null"])

function nz(s: unknown): string | null {
  if (s === undefined || s === null) return null
  const t = String(s).trim()
  return NULL_TOKENS.has(t) ? null : t
}

function toFloat(s: unknown): number | null {
  const v = nz(s)
  if (!v) return null
  const f = parseFloat(v)
  return isFinite(f) ? f : null
}

function toInt(s: unknown): number {
  const v = nz(s)
  if (!v) return 0
  const i = parseInt(v, 10)
  return isFinite(i) ? i : 0
}

function toBool(s: unknown): boolean {
  const v = nz(s)
  if (!v) return false
  return /^(true|1|yes|sim)$/i.test(v)
}

function toDate(s: unknown): Date | null {
  const v = nz(s)
  if (!v) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

function cleanPhone(phone: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/\D/g, "")
  let n = digits
  if (n.startsWith("00351") && n.length === 14) n = n.slice(5)
  else if (n.startsWith("351") && n.length === 12) n = n.slice(3)
  return n.length === 9 ? n : null
}

// ─────────────── enum mapping ───────────────

const STATUS_MAP: Record<string, LeadStatus> = {
  new: LeadStatus.NEW,
  contacted: LeadStatus.CONTACTED,
  replied: LeadStatus.REPLIED,
  interested: LeadStatus.INTERESTED,
  meeting: LeadStatus.MEETING,
  proposal: LeadStatus.PROPOSAL,
  closed_won: LeadStatus.CLOSED_WON,
  closed_lost: LeadStatus.CLOSED_LOST,
}

const ANSWERED_MAP: Record<string, LeadCallAnswer> = {
  "—":             LeadCallAnswer.PENDING,
  "Sim":           LeadCallAnswer.YES,
  "Não atendeu":   LeadCallAnswer.NO_ANSWER,
  "Voicemail":     LeadCallAnswer.VOICEMAIL,
  "Número errado": LeadCallAnswer.WRONG_NUMBER,
}

const OWNER_MAP: Record<string, LeadOwnerType> = {
  "—":                     LeadOwnerType.UNKNOWN,
  "Sim, era o dono":       LeadOwnerType.OWNER,
  "Não, era funcionário":  LeadOwnerType.NOT_OWNER,
  "Não sei":               LeadOwnerType.UNKNOWN,
}

const CHANNEL_MAP: Record<string, LeadChannel> = {
  phone:    LeadChannel.PHONE,
  whatsapp: LeadChannel.WHATSAPP,
  email:    LeadChannel.EMAIL,
  other:    LeadChannel.OTHER,
}

const ACTIVITY_MAP: Record<string, LeadActivityType> = {
  nota:               LeadActivityType.NOTE,
  chamada:            LeadActivityType.CALL,
  whatsapp:           LeadActivityType.WHATSAPP,
  email:              LeadActivityType.EMAIL,
  "reunião":          LeadActivityType.MEETING,
  reuniao:            LeadActivityType.MEETING,
  "reunião_marcada":  LeadActivityType.MEETING,
  reuniao_marcada:    LeadActivityType.MEETING,
  "mudança_status":   LeadActivityType.STATUS_CHANGE,
  mudanca_status:     LeadActivityType.STATUS_CHANGE,
  proposta_enviada:   LeadActivityType.PROPOSAL_SENT,
}

// ─────────────── main ───────────────

async function main() {
  const startedAt = Date.now()
  console.log("▶ Loading CSVs...")
  const master   = loadCsv<Record<string, string>>(FILES.master)
  const scored   = loadCsv<Record<string, string>>(FILES.scored)
  const crm      = loadCsv<Record<string, string>>(FILES.crm)
  const activity = loadCsv<Record<string, string>>(FILES.activity)
  console.log(`  master   : ${master.length.toLocaleString("pt-PT")}`)
  console.log(`  scored   : ${scored.length.toLocaleString("pt-PT")}`)
  console.log(`  crm      : ${crm.length.toLocaleString("pt-PT")}`)
  console.log(`  activity : ${activity.length.toLocaleString("pt-PT")}`)

  // ───── 1) Leads — merge master + scored, upsert in batches ─────
  const masterById = new Map(master.map((r) => [String(r.place_id), r]))
  const scoredById = new Map(scored.map((r) => [String(r.place_id), r]))
  const allPids = new Set<string>([...masterById.keys(), ...scoredById.keys()])
  allPids.delete("")
  allPids.delete("undefined")

  console.log(`\n▶ Upserting ${allPids.size.toLocaleString("pt-PT")} unique leads...`)
  const BATCH = 100
  const pidList = [...allPids]
  let upserted = 0
  let skipped = 0

  for (let i = 0; i < pidList.length; i += BATCH) {
    const chunk = pidList.slice(i, i + BATCH)
    await prisma.$transaction(chunk.map((pid) => {
      const m = masterById.get(pid) ?? {}
      const s = scoredById.get(pid) ?? {}
      const merged = { ...m, ...s } // scored takes precedence

      const name = nz(merged.name)
      if (!name) { skipped++; return prisma.$queryRaw`SELECT 1` }

      const rawPhone = nz(merged.phone)
      const phoneClean = cleanPhone(rawPhone)

      const data = {
        placeId:      pid,
        name,
        category:     nz(merged.types),
        keyword:      nz(merged.keyword),
        city:         nz(merged.city),
        address:      nz(merged.address),
        lat:          toFloat(merged.lat),
        lng:          toFloat(merged.lon),
        phone:        rawPhone,
        phoneClean,
        whatsappLink: phoneClean ? `https://wa.me/351${phoneClean}` : null,
        email:        nz(merged.email),
        website:      nz(merged.website),
        rating:       toFloat(merged.rating),
        reviews:      toInt(merged.reviews),
        googleUrl:    nz(merged.google_maps_url),
        businessType: detectBusinessType({
          keyword:  merged.keyword,
          category: merged.types,
          name,
        }),
        priority:     toInt(merged.lead_score || merged.website_score),
        source:       "google_maps",
        enrichedAt:   new Date(),
      }

      upserted++
      return prisma.lead.upsert({
        where:  { placeId: pid },
        create: data,
        update: data,
      })
    }))
    process.stdout.write(`\r  ${Math.min(i + BATCH, pidList.length)}/${pidList.length}`)
  }
  console.log(`\n  ✓ ${upserted.toLocaleString("pt-PT")} upserted, ${skipped} skipped (no name)`)

  // ───── 2) CRM state — upsert by leadId ─────
  console.log(`\n▶ Upserting ${crm.length.toLocaleString("pt-PT")} CRM states...`)
  // Map placeId → leadId in one query
  const leadIdByPid = new Map<string, string>(
    (await prisma.lead.findMany({ select: { id: true, placeId: true } }))
      .filter((l): l is { id: string; placeId: string } => l.placeId !== null)
      .map((l) => [l.placeId, l.id])
  )

  let crmUpserted = 0
  let crmMissing = 0
  for (let i = 0; i < crm.length; i += BATCH) {
    const chunk = crm.slice(i, i + BATCH)
    await prisma.$transaction(chunk.map((c) => {
      const pid = nz(c.place_id)
      const leadId = pid ? leadIdByPid.get(pid) : null
      if (!leadId) { crmMissing++; return prisma.$queryRaw`SELECT 1` }

      const data = {
        leadId,
        status:           STATUS_MAP[String(c.status || "new").toLowerCase()] ?? LeadStatus.NEW,
        answered:         ANSWERED_MAP[c.answered ?? "—"] ?? LeadCallAnswer.PENDING,
        isOwner:          OWNER_MAP[c.is_owner ?? "—"] ?? LeadOwnerType.UNKNOWN,
        whoAnswered:      nz(c.who_answered),
        noWebsiteReason:  nz(c.no_website_reason),
        bestCallTime:     nz(c.best_call_time),
        voicemailLeft:    toBool(c.voicemail_left),
        attempts:         toInt(c.attempts),
        lastCallAt:       toDate(c.last_call_at),
        contactDate:      toDate(c.contact_date),
        followUpDate:     toDate(c.follow_up_date),
        nextAction:       nz(c.next_action),
        channel:          CHANNEL_MAP[String(c.channel || "whatsapp").toLowerCase()] ?? LeadChannel.WHATSAPP,
        dealValue:        toFloat(c.deal_value) ?? 0,
        lostReason:       nz(c.lost_reason),
        notes:            nz(c.notes),
      }

      crmUpserted++
      return prisma.leadCrmState.upsert({
        where:  { leadId },
        create: data,
        update: data,
      })
    }))
    process.stdout.write(`\r  ${Math.min(i + BATCH, crm.length)}/${crm.length}`)
  }
  console.log(`\n  ✓ ${crmUpserted.toLocaleString("pt-PT")} upserted, ${crmMissing} skipped (no matching lead)`)

  // ───── 3) Activity log — insert only for leads with no existing activity ─────
  console.log(`\n▶ Importing ${activity.length.toLocaleString("pt-PT")} activity rows...`)
  // Group by placeId
  const actByPid = new Map<string, Record<string, string>[]>()
  for (const a of activity) {
    const pid = nz(a.place_id)
    if (!pid) continue
    if (!actByPid.has(pid)) actByPid.set(pid, [])
    actByPid.get(pid)!.push(a)
  }

  // Find which leads already have activity (idempotency)
  const leadsWithActivity = new Set(
    (await prisma.leadActivity.findMany({
      select: { leadId: true },
      distinct: ["leadId"],
    })).map((r) => r.leadId)
  )

  let actInserted = 0
  let actSkippedLead = 0
  let actSkippedExisting = 0
  for (const [pid, rows] of actByPid) {
    const leadId = leadIdByPid.get(pid)
    if (!leadId) { actSkippedLead += rows.length; continue }
    if (leadsWithActivity.has(leadId)) { actSkippedExisting += rows.length; continue }

    const toInsert = rows.map((a) => ({
      leadId,
      type:      ACTIVITY_MAP[String(a.type || "").toLowerCase()] ?? LeadActivityType.OTHER,
      content:   nz(a.content),
      channel:   a.channel ? (CHANNEL_MAP[String(a.channel).toLowerCase()] ?? null) : null,
      oldStatus: STATUS_MAP[String(a.old_status || "").toLowerCase()] ?? null,
      newStatus: STATUS_MAP[String(a.new_status || "").toLowerCase()] ?? null,
      createdAt: toDate(a.timestamp) ?? new Date(),
    }))

    await prisma.leadActivity.createMany({ data: toInsert })
    actInserted += toInsert.length
  }
  console.log(`  ✓ ${actInserted.toLocaleString("pt-PT")} inserted`)
  console.log(`    ${actSkippedLead} skipped (lead not found)`)
  console.log(`    ${actSkippedExisting} skipped (lead already had activity)`)

  // ───── Summary ─────
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
  const counts = {
    leads:     await prisma.lead.count(),
    crmState:  await prisma.leadCrmState.count(),
    activity:  await prisma.leadActivity.count(),
  }
  console.log(`\n✓ Done in ${elapsed}s`)
  console.log(`  DB now has: ${counts.leads.toLocaleString("pt-PT")} leads · ${counts.crmState.toLocaleString("pt-PT")} crm states · ${counts.activity.toLocaleString("pt-PT")} activities`)
}

main()
  .catch((e) => { console.error("\n✗ Import failed:", e); process.exit(1) })
  .finally(() => prisma.$disconnect())

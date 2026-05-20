"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import {
  LeadActivityType,
  LeadCallAnswer,
  LeadChannel,
  LeadOwnerType,
  LeadStatus,
  type Prisma,
} from "@prisma/client"
import type { CallOutcome } from "./types"

interface SaveOutcomeInput {
  leadId: string
  outcome: CallOutcome
  notes?: string
  isOwner?: "yes" | "no" | "unknown"
  whoAnswered?: string
  bestCallTime?: string
  noWebsiteReason?: string
  lostReason?: string
  followUpDate?: string // ISO yyyy-mm-dd
}

const EARLIER_STATUSES: LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.REPLIED,
]

const OUTCOME_TO_STATE: Record<CallOutcome, {
  answered: LeadCallAnswer
  newStatus: LeadStatus
  voicemailLeft?: boolean
  closes?: boolean // bypasses earlier-status guard
}> = {
  interested:   { answered: LeadCallAnswer.YES,          newStatus: LeadStatus.INTERESTED },
  callback:     { answered: LeadCallAnswer.YES,          newStatus: LeadStatus.CONTACTED },
  not_int:      { answered: LeadCallAnswer.YES,          newStatus: LeadStatus.CLOSED_LOST, closes: true },
  no_answer:    { answered: LeadCallAnswer.NO_ANSWER,    newStatus: LeadStatus.CONTACTED },
  voicemail:    { answered: LeadCallAnswer.VOICEMAIL,    newStatus: LeadStatus.CONTACTED, voicemailLeft: true },
  wrong_number: { answered: LeadCallAnswer.WRONG_NUMBER, newStatus: LeadStatus.CLOSED_LOST, closes: true },
}

const OWNER_MAP: Record<"yes" | "no" | "unknown", LeadOwnerType> = {
  yes:     LeadOwnerType.OWNER,
  no:      LeadOwnerType.NOT_OWNER,
  unknown: LeadOwnerType.UNKNOWN,
}

/**
 * Record a call outcome on a lead. Updates LeadCrmState (status, attempts,
 * answered, etc.), appends a CALL activity, and logs status-change /
 * notes activities atomically.
 */
export async function saveCallOutcome(input: SaveOutcomeInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const lead = await prisma.lead.findUnique({
    where: { id: input.leadId },
    include: { crmState: true },
  })
  if (!lead) throw new Error("Lead not found")

  const map = OUTCOME_TO_STATE[input.outcome]
  if (!map) throw new Error("Invalid outcome")

  const current = lead.crmState
  const oldStatus = current?.status ?? LeadStatus.NEW

  // Only update status if it's an "early" status (don't downgrade interested → contacted)
  // or if the outcome explicitly closes (not_int / wrong_number always wins)
  const shouldChangeStatus = map.closes || EARLIER_STATUSES.includes(oldStatus)
  const newStatus = shouldChangeStatus ? map.newStatus : oldStatus

  const ops: Prisma.PrismaPromise<unknown>[] = [
    prisma.leadCrmState.upsert({
      where: { leadId: input.leadId },
      create: {
        leadId: input.leadId,
        status: newStatus,
        answered: map.answered,
        isOwner: input.isOwner ? OWNER_MAP[input.isOwner] : LeadOwnerType.UNKNOWN,
        whoAnswered: input.whoAnswered ?? null,
        bestCallTime: input.bestCallTime ?? null,
        noWebsiteReason: input.noWebsiteReason ?? null,
        lostReason: input.lostReason ?? null,
        voicemailLeft: map.voicemailLeft ?? false,
        attempts: 1,
        lastCallAt: new Date(),
        followUpDate: input.followUpDate ? new Date(input.followUpDate) : null,
        notes: input.notes ?? null,
        ownerUserId: session.user.id,
      },
      update: {
        status: newStatus,
        answered: map.answered,
        ...(input.isOwner    && { isOwner: OWNER_MAP[input.isOwner] }),
        ...(input.whoAnswered     !== undefined && { whoAnswered: input.whoAnswered }),
        ...(input.bestCallTime    !== undefined && { bestCallTime: input.bestCallTime }),
        ...(input.noWebsiteReason !== undefined && { noWebsiteReason: input.noWebsiteReason }),
        ...(input.lostReason      !== undefined && { lostReason: input.lostReason }),
        ...(map.voicemailLeft     !== undefined && { voicemailLeft: map.voicemailLeft }),
        attempts: { increment: 1 },
        lastCallAt: new Date(),
        ...(input.followUpDate && { followUpDate: new Date(input.followUpDate) }),
        ...(input.notes && { notes: input.notes }),
      },
    }),
    prisma.leadActivity.create({
      data: {
        leadId: input.leadId,
        userId: session.user.id,
        type: LeadActivityType.CALL,
        content: `Outcome: ${input.outcome}`,
        channel: LeadChannel.PHONE,
        oldStatus,
        newStatus,
        metadata: {
          outcome: input.outcome,
          isOwner: input.isOwner,
          whoAnswered: input.whoAnswered,
        },
      },
    }),
  ]

  if (input.notes?.trim()) {
    ops.push(prisma.leadActivity.create({
      data: {
        leadId: input.leadId,
        userId: session.user.id,
        type: LeadActivityType.NOTE,
        content: input.notes.trim(),
      },
    }))
  }

  if (oldStatus !== newStatus) {
    ops.push(prisma.leadActivity.create({
      data: {
        leadId: input.leadId,
        userId: session.user.id,
        type: LeadActivityType.STATUS_CHANGE,
        content: `${oldStatus} → ${newStatus}`,
        oldStatus,
        newStatus,
      },
    }))
  }

  await prisma.$transaction(ops)

  revalidatePath(`/admin/leads/${input.leadId}`)
  revalidatePath(`/admin/leads`)
  return { ok: true, newStatus, oldStatus }
}

export async function addNote(leadId: string, content: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  if (!content.trim()) return { ok: false, error: "empty" }
  await prisma.leadActivity.create({
    data: {
      leadId,
      userId: session.user.id,
      type: LeadActivityType.NOTE,
      content: content.trim(),
    },
  })
  revalidatePath(`/admin/leads/${leadId}`)
  return { ok: true }
}

export async function setLeadStatus(leadId: string, status: LeadStatus) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const current = await prisma.leadCrmState.findUnique({ where: { leadId } })
  const oldStatus = current?.status ?? LeadStatus.NEW
  await prisma.$transaction([
    prisma.leadCrmState.upsert({
      where: { leadId },
      create: { leadId, status, ownerUserId: session.user.id },
      update: { status },
    }),
    prisma.leadActivity.create({
      data: {
        leadId,
        userId: session.user.id,
        type: LeadActivityType.STATUS_CHANGE,
        content: `${oldStatus} → ${status}`,
        oldStatus,
        newStatus: status,
      },
    }),
  ])
  revalidatePath(`/admin/leads/${leadId}`)
  revalidatePath(`/admin/leads`)
  return { ok: true }
}

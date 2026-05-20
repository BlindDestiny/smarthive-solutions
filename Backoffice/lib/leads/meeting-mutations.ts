"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import {
  LeadActivityType,
  LeadMeetingStage,
  LeadMeetingStatus,
  LeadStatus,
  type Prisma,
} from "@prisma/client"

interface CreateMeetingInput {
  leadId: string
  startDt: string       // ISO
  durationMin?: number
  stage?: LeadMeetingStage
  meetLink?: string
  notes?: string
}

export async function createMeeting(input: CreateMeetingInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const startDt = new Date(input.startDt)
  if (isNaN(startDt.getTime())) throw new Error("Data inválida")

  const ops: Prisma.PrismaPromise<unknown>[] = [
    prisma.leadMeeting.create({
      data: {
        leadId:      input.leadId,
        userId:      session.user.id,
        stage:       input.stage ?? LeadMeetingStage.DISCOVERY,
        status:      LeadMeetingStatus.SCHEDULED,
        startDt,
        durationMin: input.durationMin ?? 30,
        meetLink:    input.meetLink ?? null,
        notes:       input.notes ?? null,
      },
    }),
    // Bump status to MEETING (if currently earlier in funnel)
    prisma.leadCrmState.upsert({
      where:  { leadId: input.leadId },
      create: {
        leadId: input.leadId,
        status: LeadStatus.MEETING,
        ownerUserId: session.user.id,
      },
      update: {
        status: LeadStatus.MEETING,
      },
    }),
    prisma.leadActivity.create({
      data: {
        leadId:    input.leadId,
        userId:    session.user.id,
        type:      LeadActivityType.MEETING,
        content:   `Reunião marcada · ${startDt.toLocaleString("pt-PT")}${input.stage ? ` · ${input.stage}` : ""}`,
        newStatus: LeadStatus.MEETING,
        metadata:  { startDt: input.startDt, durationMin: input.durationMin },
      },
    }),
  ]

  await prisma.$transaction(ops)
  revalidatePath(`/admin/leads/${input.leadId}`)
  revalidatePath(`/admin/leads/calendar`)
  return { ok: true }
}

export async function updateMeetingStatus(
  meetingId: string,
  status: LeadMeetingStatus,
  outcome?: string,
) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const m = await prisma.leadMeeting.findUnique({ where: { id: meetingId } })
  if (!m) throw new Error("Reunião não encontrada")

  await prisma.$transaction([
    prisma.leadMeeting.update({
      where: { id: meetingId },
      data: { status, ...(outcome !== undefined && { outcome }) },
    }),
    prisma.leadActivity.create({
      data: {
        leadId: m.leadId,
        userId: session.user.id,
        type:   LeadActivityType.MEETING,
        content: `Reunião ${status.toLowerCase()}${outcome ? ` · ${outcome}` : ""}`,
      },
    }),
  ])
  revalidatePath(`/admin/leads/${m.leadId}`)
  revalidatePath(`/admin/leads/calendar`)
  return { ok: true }
}

export async function rescheduleMeeting(meetingId: string, newStartDt: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")
  const m = await prisma.leadMeeting.findUnique({ where: { id: meetingId } })
  if (!m) throw new Error("Reunião não encontrada")
  const startDt = new Date(newStartDt)
  if (isNaN(startDt.getTime())) throw new Error("Data inválida")
  await prisma.$transaction([
    prisma.leadMeeting.update({
      where: { id: meetingId },
      data: { startDt, status: LeadMeetingStatus.RESCHEDULED },
    }),
    prisma.leadActivity.create({
      data: {
        leadId: m.leadId,
        userId: session.user.id,
        type: LeadActivityType.MEETING,
        content: `Reunião reagendada → ${startDt.toLocaleString("pt-PT")}`,
      },
    }),
  ])
  revalidatePath(`/admin/leads/${m.leadId}`)
  revalidatePath(`/admin/leads/calendar`)
  return { ok: true }
}

"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import {
  LeadActivityType,
  LeadProposalStatus,
  LeadStatus,
  type Prisma,
} from "@prisma/client"
import { ADDON_CATALOG, type ProposalKind } from "./proposal-catalogs"

interface CreateProposalInput {
  leadId:    string
  kind:      ProposalKind
  basePrice: number
  features:  string[]   // labels of selected features
  addons:    string[]   // labels of selected addons
}

function computeTotals(basePrice: number, addons: string[]) {
  let oneTime = basePrice
  let monthly = 0
  for (const lbl of addons) {
    const a = ADDON_CATALOG.find((x) => x.label === lbl)
    if (!a) continue
    if (a.kind === "/mês") monthly += a.price
    else oneTime += a.price
  }
  return { oneTime, monthly }
}

export async function createProposal(input: CreateProposalInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const totals = computeTotals(input.basePrice, input.addons)

  const proposal = await prisma.leadProposal.create({
    data: {
      leadId:         input.leadId,
      userId:         session.user.id,
      kind:           input.kind,
      features:       input.features,
      addons:         input.addons,
      totalOneTime:   totals.oneTime,
      totalRecurring: totals.monthly,
      status:         LeadProposalStatus.DRAFT,
    },
  })

  await prisma.leadActivity.create({
    data: {
      leadId: input.leadId,
      userId: session.user.id,
      type:   LeadActivityType.PROPOSAL_SENT, // re-using existing enum: actually DRAFT not sent
      content: `Proposta criada · ${input.kind} · ${totals.oneTime.toLocaleString("pt-PT")} € one-time${totals.monthly > 0 ? ` + ${totals.monthly.toLocaleString("pt-PT")} €/mês` : ""}`,
      metadata: { proposalId: proposal.id, totals },
    },
  })

  revalidatePath(`/admin/leads/${input.leadId}`)
  return { ok: true, proposalId: proposal.id }
}

export async function markProposalSent(proposalId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const p = await prisma.leadProposal.findUnique({ where: { id: proposalId } })
  if (!p) throw new Error("Proposta não encontrada")

  const ops: Prisma.PrismaPromise<unknown>[] = [
    prisma.leadProposal.update({
      where: { id: proposalId },
      data:  { status: LeadProposalStatus.SENT, sentAt: new Date() },
    }),
    prisma.leadCrmState.upsert({
      where:  { leadId: p.leadId },
      create: { leadId: p.leadId, status: LeadStatus.PROPOSAL, ownerUserId: session.user.id },
      update: { status: LeadStatus.PROPOSAL },
    }),
    prisma.leadActivity.create({
      data: {
        leadId:    p.leadId,
        userId:    session.user.id,
        type:      LeadActivityType.PROPOSAL_SENT,
        content:   "Proposta marcada como enviada",
        newStatus: LeadStatus.PROPOSAL,
      },
    }),
  ]

  await prisma.$transaction(ops)
  revalidatePath(`/admin/leads/${p.leadId}`)
  return { ok: true }
}

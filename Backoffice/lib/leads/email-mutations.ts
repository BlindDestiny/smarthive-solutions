"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { LeadActivityType, LeadChannel } from "@prisma/client"
import { Resend } from "resend"
import { getTemplate, renderTemplate } from "./email-templates"

interface SendEmailInput {
  leadId:       string
  templateId:   string
  toAddress:    string
  subject?:     string       // override
  body?:        string       // override (already rendered)
}

export async function sendLeadEmail(input: SendEmailInput) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const lead = await prisma.lead.findUnique({
    where: { id: input.leadId },
    include: { crmState: { select: { whoAnswered: true } } },
  })
  if (!lead) throw new Error("Lead não encontrado")

  const tpl = getTemplate(input.templateId)
  if (!tpl) throw new Error("Template não encontrado")

  // Either use overrides (caller already rendered preview) or render now
  const rendered = input.subject && input.body
    ? { subject: input.subject, body: input.body }
    : renderTemplate(tpl, {
        name: lead.name,
        city: lead.city,
        reviews: lead.reviews,
        rating: lead.rating,
        businessType: lead.businessType,
        email: lead.email,
        whoAnswered: lead.crmState?.whoAnswered ?? null,
        senderName: session.user.name ?? "Pedro Bicas",
      })

  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.OUTREACH_FROM ?? "Smart Hive <geral@smarthivesolutions.pt>"

  let status: "sent" | "draft" | "failed" = "draft"
  let error: string | null = null

  if (apiKey) {
    try {
      const resend = new Resend(apiKey)
      const r = await resend.emails.send({
        from,
        to: input.toAddress,
        subject: rendered.subject,
        text: rendered.body,
      })
      if (r.error) {
        status = "failed"
        error  = r.error.message
      } else {
        status = "sent"
      }
    } catch (e) {
      status = "failed"
      error  = (e as Error).message
    }
  } else {
    status = "draft"
    error  = "RESEND_API_KEY não configurada — email guardado como rascunho"
  }

  await prisma.$transaction([
    prisma.leadEmailLog.create({
      data: {
        leadId:    input.leadId,
        userId:    session.user.id,
        toAddress: input.toAddress,
        subject:   rendered.subject,
        template:  input.templateId,
        status,
        error,
      },
    }),
    prisma.leadActivity.create({
      data: {
        leadId:  input.leadId,
        userId:  session.user.id,
        type:    LeadActivityType.EMAIL,
        channel: LeadChannel.EMAIL,
        content: `${input.templateId}${status === "sent" ? " · enviado" : status === "draft" ? " · rascunho (sem API key)" : " · falhou: " + (error ?? "")} → ${input.toAddress}`,
        metadata: { templateId: input.templateId, subject: rendered.subject, status },
      },
    }),
  ])

  revalidatePath(`/admin/leads/${input.leadId}`)
  return { ok: status === "sent", status, error }
}

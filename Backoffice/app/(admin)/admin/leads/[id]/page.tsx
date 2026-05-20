import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft, Phone, Mail, Globe, MapPin, Star, ExternalLink,
  MessageSquare, Award,
} from "lucide-react"
import { getLeadDetail } from "@/lib/leads/queries"
import { PitchPanel } from "@/components/leads/PitchPanel"
import { OutcomeButtons } from "@/components/leads/OutcomeButtons"
import { ActivityTimeline } from "@/components/leads/ActivityTimeline"
import { STATUS_LABEL, STATUS_COLOR, ANSWERED_LABEL, type CallOutcome } from "@/lib/leads/types"
import { VERTICAL_LABEL } from "@/lib/pitch"
import type { LeadCallAnswer, LeadStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

function inferOutcome(
  answered: LeadCallAnswer | undefined,
  status: LeadStatus | undefined,
  lostReason: string | null | undefined,
): CallOutcome | null {
  if (!answered || answered === "PENDING") return null
  if (answered === "NO_ANSWER")    return "no_answer"
  if (answered === "VOICEMAIL")    return "voicemail"
  if (answered === "WRONG_NUMBER") return "wrong_number"
  if (answered === "YES") {
    if (status === "MEETING" || status === "INTERESTED") return "interested"
    if (status === "CLOSED_LOST" && lostReason && lostReason !== "Número errado") return "not_int"
    return "callback"
  }
  return null
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLeadDetail(id)
  if (!lead) notFound()

  const crm = lead.crmState
  const status = crm?.status ?? "NEW"
  const lastOutcome = inferOutcome(crm?.answered, crm?.status, crm?.lostReason)

  const phoneCleaned = lead.phoneClean
  const waLink = phoneCleaned ? `https://wa.me/351${phoneCleaned}` : null

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/admin/leads"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar à tabela
      </Link>

      {/* Header */}
      <header className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_COLOR[status]}`}>
                {STATUS_LABEL[status]}
              </span>
              <span className="text-[11px] uppercase tracking-widest text-gray-500">
                {VERTICAL_LABEL[lead.businessType]}
              </span>
              {lead.priority > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                  <Award className="w-3 h-3" /> prio {lead.priority}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 break-words">
              {lead.name}
            </h1>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 flex-wrap">
              {lead.city && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {lead.city}
                </span>
              )}
              {lead.rating != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {lead.rating.toFixed(1)} ({lead.reviews.toLocaleString("pt-PT")} reviews)
                </span>
              )}
              {crm?.attempts ? (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {crm.attempts} tentativa{crm.attempts > 1 ? "s" : ""}
                  {lastOutcome && (
                    <span className="text-gray-400">· última: {ANSWERED_LABEL[crm.answered]}</span>
                  )}
                </span>
              ) : null}
            </div>
          </div>

          {/* Contact actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Phone className="w-3.5 h-3.5" /> {lead.phone}
              </a>
            )}
            {waLink && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Mail className="w-3.5 h-3.5" /> {lead.email}
              </a>
            )}
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            )}
            {lead.googleUrl && (
              <a
                href={lead.googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Google Maps <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main grid: outcome + pitch (2/3) | timeline (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OutcomeButtons
            leadId={lead.id}
            initialOutcome={lastOutcome ?? undefined}
            initialNotes={crm?.notes ?? undefined}
          />
          <PitchPanel
            lead={{
              name:         lead.name,
              city:         lead.city,
              reviews:      lead.reviews,
              rating:       lead.rating,
              businessType: lead.businessType,
              keyword:      lead.keyword,
              category:     lead.category,
            }}
          />
        </div>

        <div className="lg:col-span-1">
          <ActivityTimeline rows={lead.activities} />
        </div>
      </div>
    </div>
  )
}

import Link from "next/link"
import {
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, Minus,
  Globe, Mail, Phone, ExternalLink, Star,
} from "lucide-react"
import { STATUS_LABEL, STATUS_COLOR, type SortDir, type SortKey } from "@/lib/leads/types"
import { VERTICAL_LABEL } from "@/lib/pitch"
import type { LeadStatus } from "@prisma/client"

interface LeadRow {
  id: string
  placeId: string | null
  name: string
  city: string | null
  email: string | null
  phone: string | null
  website: string | null
  rating: number | null
  reviews: number
  priority: number
  businessType: keyof typeof VERTICAL_LABEL
  crmState: {
    status: LeadStatus
    attempts: number
    answered: string
    lastCallAt: Date | null
  } | null
}

interface LeadsTableProps {
  rows: LeadRow[]
  total: number
  page: number
  pageCount: number
  pageSize: number
  sortBy: SortKey
  sortDir: SortDir
  baseParams: URLSearchParams
}

function sortLink(
  base: URLSearchParams,
  current: { sortBy: SortKey; sortDir: SortDir },
  target: SortKey,
): { href: string; dir: SortDir | null } {
  const params = new URLSearchParams(base.toString())
  let nextDir: SortDir = "desc"
  if (current.sortBy === target) nextDir = current.sortDir === "desc" ? "asc" : "desc"
  params.set("sort", target)
  params.set("dir", nextDir)
  params.delete("page")
  return {
    href: `?${params.toString()}`,
    dir: current.sortBy === target ? current.sortDir : null,
  }
}

function pageHref(base: URLSearchParams, page: number) {
  const params = new URLSearchParams(base.toString())
  if (page === 0) params.delete("page")
  else params.set("page", String(page))
  return `?${params.toString()}`
}

function SortHeader({
  label, target, current, base, align = "left",
}: {
  label: string
  target: SortKey
  current: { sortBy: SortKey; sortDir: SortDir }
  base: URLSearchParams
  align?: "left" | "right" | "center"
}) {
  const { href, dir } = sortLink(base, current, target)
  const ArrowIcon = dir === "asc" ? ArrowUp : dir === "desc" ? ArrowDown : Minus
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-gray-500 hover:text-gray-900 ${
        align === "right" ? "justify-end" : ""
      }`}
    >
      {label}
      <ArrowIcon className={`w-3 h-3 ${dir ? "text-sky-500" : "text-gray-300 group-hover:text-gray-400"}`} />
    </Link>
  )
}

export function LeadsTable(props: LeadsTableProps) {
  const { rows, total, page, pageCount, pageSize, sortBy, sortDir, baseParams } = props
  const current = { sortBy, sortDir }
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min(total, (page + 1) * pageSize)

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left">
                <SortHeader label="Lead" target="name" current={current} base={baseParams} />
              </th>
              <th className="px-4 py-3 text-left">Vertical</th>
              <th className="px-4 py-3 text-left">Cidade</th>
              <th className="px-4 py-3 text-right">
                <SortHeader label="Rating" target="rating" current={current} base={baseParams} align="right" />
              </th>
              <th className="px-4 py-3 text-left">Canais</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">
                <SortHeader label="Prio" target="priority" current={current} base={baseParams} align="right" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-500">
                  Sem leads para estes filtros.
                </td>
              </tr>
            ) : (
              rows.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <div className="font-medium text-gray-900 hover:text-sky-600">{lead.name}</div>
                      {lead.crmState?.attempts ? (
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          📞 {lead.crmState.attempts} tentativa{lead.crmState.attempts > 1 ? "s" : ""}
                          {lead.crmState.lastCallAt && (
                            <> · última {new Date(lead.crmState.lastCallAt).toLocaleDateString("pt-PT")}</>
                          )}
                        </div>
                      ) : null}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700">
                      {VERTICAL_LABEL[lead.businessType]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.city ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    {lead.rating != null ? (
                      <span className="inline-flex items-center gap-1 text-gray-700 tabular-nums">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {lead.rating.toFixed(1)}
                        <span className="text-gray-400 text-xs">({lead.reviews.toLocaleString("pt-PT")})</span>
                      </span>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-2 text-gray-400">
                      <Globe className={`w-3.5 h-3.5 ${lead.website ? "text-emerald-500" : ""}`} aria-label={lead.website ? "tem website" : "sem website"} />
                      <Mail  className={`w-3.5 h-3.5 ${lead.email   ? "text-amber-500"   : ""}`} aria-label={lead.email   ? "tem email"   : "sem email"} />
                      <Phone className={`w-3.5 h-3.5 ${lead.phone   ? "text-violet-500" : ""}`} aria-label={lead.phone   ? "tem telefone" : "sem telefone"} />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {lead.crmState?.status ? (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_COLOR[lead.crmState.status]}`}>
                        {STATUS_LABEL[lead.crmState.status]}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-500">
                        Novo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-gray-700">
                    {lead.priority || "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 tabular-nums">
          {from.toLocaleString("pt-PT")}–{to.toLocaleString("pt-PT")} de {total.toLocaleString("pt-PT")}
        </p>
        <div className="flex items-center gap-1">
          <Link
            href={page > 0 ? pageHref(baseParams, page - 1) : "#"}
            aria-disabled={page === 0}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded ${
              page === 0 ? "text-gray-300 pointer-events-none" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Anterior
          </Link>
          <span className="text-xs text-gray-600 px-2 tabular-nums">
            Pág. {page + 1} / {pageCount}
          </span>
          <Link
            href={page < pageCount - 1 ? pageHref(baseParams, page + 1) : "#"}
            aria-disabled={page >= pageCount - 1}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded ${
              page >= pageCount - 1 ? "text-gray-300 pointer-events-none" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Próximo <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

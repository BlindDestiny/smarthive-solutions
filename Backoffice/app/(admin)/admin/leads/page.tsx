import { listLeads, getLeadsStats, listCities } from "@/lib/leads/queries"
import { LeadFilters } from "@/components/leads/LeadFilters"
import { LeadsTable } from "@/components/leads/LeadsTable"
import { StatsBar } from "@/components/leads/StatsBar"
import type { LeadsFilter, SortDir, SortKey } from "@/lib/leads/types"
import type { LeadStatus, LeadBusinessType } from "@prisma/client"

export const dynamic = "force-dynamic"

const VALID_SORT_KEYS: SortKey[] = ["priority", "name", "reviews", "rating", "createdAt"]

function parseFilters(p: Record<string, string | string[] | undefined>): LeadsFilter {
  const get = (k: string) => {
    const v = p[k]
    return Array.isArray(v) ? v[0] : v
  }
  const boolFlag = (k: string) => {
    const v = get(k)
    return v === "1" ? true : v === "0" ? false : undefined
  }
  const sortRaw = get("sort") ?? "priority"
  const dirRaw  = get("dir")  ?? "desc"
  const pageRaw = get("page")

  return {
    search:       get("q") ?? undefined,
    status:       (get("status")   as LeadStatus       | undefined) || undefined,
    businessType: (get("vertical") as LeadBusinessType | undefined) || undefined,
    city:         get("city") || undefined,
    hasWebsite:   boolFlag("web"),
    hasEmail:     boolFlag("email"),
    hasPhone:     boolFlag("phone"),
    minPriority:  get("prio") ? Number(get("prio")) : undefined,
    sortBy:       (VALID_SORT_KEYS.includes(sortRaw as SortKey) ? sortRaw : "priority") as SortKey,
    sortDir:      (dirRaw === "asc" ? "asc" : "desc") as SortDir,
    page:         pageRaw ? Math.max(0, parseInt(pageRaw, 10)) : 0,
    pageSize:     50,
  }
}

function rebuildBaseParams(filters: LeadsFilter): URLSearchParams {
  const p = new URLSearchParams()
  if (filters.search)        p.set("q", filters.search)
  if (filters.status)        p.set("status", filters.status)
  if (filters.businessType)  p.set("vertical", filters.businessType)
  if (filters.city)          p.set("city", filters.city)
  if (filters.hasWebsite === true)  p.set("web", "1")
  if (filters.hasWebsite === false) p.set("web", "0")
  if (filters.hasEmail === true)    p.set("email", "1")
  if (filters.hasEmail === false)   p.set("email", "0")
  if (filters.hasPhone === true)    p.set("phone", "1")
  if (filters.hasPhone === false)   p.set("phone", "0")
  if (filters.minPriority)   p.set("prio", String(filters.minPriority))
  if (filters.sortBy && filters.sortBy !== "priority") p.set("sort", filters.sortBy)
  if (filters.sortDir && filters.sortDir !== "desc")   p.set("dir", filters.sortDir)
  return p
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const filters = parseFilters(params)
  const [data, stats, cities] = await Promise.all([
    listLeads(filters),
    getLeadsStats({
      search:       filters.search,
      businessType: filters.businessType,
      city:         filters.city,
    }),
    listCities(),
  ])

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">
          Lead Machine
        </p>
        <h1 className="text-3xl font-semibold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pipeline de prospeção · {stats.total.toLocaleString("pt-PT")} leads que correspondem ao filtro
        </p>
      </header>

      <StatsBar stats={stats} />
      <LeadFilters cities={cities} initialSearch={filters.search} />
      <LeadsTable
        rows={data.rows}
        total={data.total}
        page={data.page}
        pageCount={data.pageCount}
        pageSize={data.pageSize}
        sortBy={filters.sortBy ?? "priority"}
        sortDir={filters.sortDir ?? "desc"}
        baseParams={rebuildBaseParams(filters)}
      />
    </div>
  )
}

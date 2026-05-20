import "server-only"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import type { LeadsFilter } from "./types"

function buildWhere(f: LeadsFilter): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {}

  if (f.search) where.name = { contains: f.search, mode: "insensitive" }
  if (f.businessType) where.businessType = f.businessType
  if (f.city) where.city = { equals: f.city, mode: "insensitive" }

  if (f.hasWebsite === true)  where.website = { not: null }
  if (f.hasWebsite === false) where.website = null
  if (f.hasEmail === true)    where.email   = { not: null }
  if (f.hasEmail === false)   where.email   = null
  if (f.hasPhone === true)    where.phone   = { not: null }
  if (f.hasPhone === false)   where.phone   = null

  if (f.minPriority) where.priority = { gte: f.minPriority }
  if (f.status) where.crmState = { is: { status: f.status } }

  return where
}

const DEFAULT_PAGE_SIZE = 50

export async function listLeads(f: LeadsFilter) {
  const page = f.page ?? 0
  const pageSize = f.pageSize ?? DEFAULT_PAGE_SIZE
  const where = buildWhere(f)

  const sortBy = f.sortBy ?? "priority"
  const sortDir = f.sortDir ?? "desc"
  const orderBy: Prisma.LeadOrderByWithRelationInput[] =
    sortBy === "priority"
      ? [{ priority: sortDir }, { reviews: "desc" }]
      : [{ [sortBy]: sortDir } as Prisma.LeadOrderByWithRelationInput]

  const [rows, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        crmState: {
          select: {
            status: true,
            attempts: true,
            answered: true,
            lastCallAt: true,
            followUpDate: true,
          },
        },
      },
      orderBy,
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
  ])

  return {
    rows,
    total,
    page,
    pageSize,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
  }
}

export type LeadRow = Awaited<ReturnType<typeof listLeads>>["rows"][number]

export async function getLeadDetail(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      crmState: { include: { owner: { select: { id: true, name: true, email: true } } } },
      activities: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { user: { select: { id: true, name: true, email: true } } },
      },
      meetings: {
        orderBy: { startDt: "desc" },
        take: 10,
      },
    },
  })
}

export async function getLeadsStats(
  f: Pick<LeadsFilter, "search" | "businessType" | "city">,
) {
  const where = buildWhere(f)
  const [total, withWebsite, withEmail, withPhone, byStatus, byType] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.count({ where: { ...where, website: { not: null } } }),
    prisma.lead.count({ where: { ...where, email: { not: null } } }),
    prisma.lead.count({ where: { ...where, phone: { not: null } } }),
    prisma.leadCrmState.groupBy({
      by: ["status"],
      where: { lead: where },
      _count: { _all: true },
    }),
    prisma.lead.groupBy({
      by: ["businessType"],
      where,
      _count: { _all: true },
      orderBy: { _count: { businessType: "desc" } },
      take: 12,
    }),
  ])
  return { total, withWebsite, withEmail, withPhone, byStatus, byType }
}

export async function listCities() {
  const rows = await prisma.lead.findMany({
    select: { city: true },
    distinct: ["city"],
    where: { city: { not: null } },
    orderBy: { city: "asc" },
  })
  return rows.map((r) => r.city!).filter(Boolean)
}

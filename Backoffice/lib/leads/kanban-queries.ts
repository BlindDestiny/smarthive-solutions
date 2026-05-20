import "server-only"
import { prisma } from "@/lib/prisma"
import { ALL_STATUSES } from "./types"

const CARDS_PER_COLUMN = 50

export async function listKanban() {
  return Promise.all(
    ALL_STATUSES.map(async (status) => {
      const [rows, total] = await Promise.all([
        prisma.lead.findMany({
          where: { crmState: { is: { status } } },
          select: {
            id: true,
            name: true,
            city: true,
            reviews: true,
            rating: true,
            priority: true,
            phone: true,
            website: true,
            email: true,
            businessType: true,
            crmState: {
              select: { status: true, attempts: true, lastCallAt: true },
            },
          },
          orderBy: [{ priority: "desc" }, { reviews: "desc" }],
          take: CARDS_PER_COLUMN,
        }),
        prisma.leadCrmState.count({ where: { status } }),
      ])
      return { status, rows, total }
    }),
  )
}

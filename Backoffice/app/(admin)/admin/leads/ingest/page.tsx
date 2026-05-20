import { prisma } from "@/lib/prisma"
import { ScrapeRunner } from "@/components/leads/ScrapeRunner"

type ScrapeRunnerRecent = { source: string; keyword: string; found: number; ts: number }

export const dynamic = "force-dynamic"

export default async function IngestPage() {
  const initialJobs = await prisma.scrapeJob.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    include: { user: { select: { name: true, email: true } } },
  })
  const existingLeadCount = await prisma.lead.count()

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Ingest Google Places</h1>
        <p className="text-sm text-gray-500 mt-1">
          Scrape novos leads do Google Maps · {existingLeadCount.toLocaleString("pt-PT")} leads atualmente no DB.
          Combos já corridos (mesma lat, lon, keyword) são automaticamente saltados.
        </p>
      </header>

      <ScrapeRunner
        initialJobs={initialJobs.map((j) => ({
          ...j,
          createdAt:      j.createdAt.toISOString(),
          startedAt:      j.startedAt?.toISOString() ?? null,
          endedAt:        j.endedAt?.toISOString() ?? null,
          updatedAt:      j.updatedAt.toISOString(),
          keywords:       (j.keywords as string[]) ?? [],
          recentActivity: (j.recentActivity as ScrapeRunnerRecent[] | null) ?? null,
        }))}
      />
    </div>
  )
}

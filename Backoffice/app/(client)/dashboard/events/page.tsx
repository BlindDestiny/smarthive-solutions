import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatDate } from "@/lib/utils"
import EventsManager from "@/components/client/EventsManager"

export default async function EventsPage() {
  const session = await auth()
  const tenantId = session!.user.tenantId!

  const website = await prisma.website.findUnique({
    where: { tenantId },
    select: { id: true, events: { orderBy: { date: "asc" } } },
  })

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
        <p className="text-gray-500 mt-1">Gere os eventos do teu website.</p>
      </div>

      <EventsManager
        websiteId={website?.id ?? ""}
        initialEvents={(website?.events ?? []).map((e) => ({
          ...e,
          date: e.date.toISOString(),
          description: e.description ?? "",
          imageUrl: e.imageUrl ?? "",
          isEnded: e.isEnded,
        }))}
      />
    </div>
  )
}

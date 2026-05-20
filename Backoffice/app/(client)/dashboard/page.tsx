import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Globe, Image, Calendar, Share2, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import PublishButton from "@/components/client/PublishButton"

export default async function ClientDashboard() {
  const session = await auth()
  const tenantId = session!.user.tenantId!

  const website = await prisma.website.findUnique({
    where: { tenantId },
    include: {
      _count: { select: { events: true, socialLinks: true, contents: true } },
    },
  })

  const mediaCount = await prisma.mediaFile.count({ where: { tenantId } })

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {session?.user.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1">Gere o conteúdo do teu website.</p>
        </div>

        {website && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm">
              {website.isDraft ? (
                <><Clock className="w-4 h-4 text-amber-500" /><span className="text-amber-600">Rascunho</span></>
              ) : (
                <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-600">Publicado</span></>
              )}
            </div>
            <PublishButton isDraft={website.isDraft} publishedAt={website.publishedAt?.toISOString() ?? null} />
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Conteúdos", value: website?._count.contents ?? 0, icon: Globe, href: "/dashboard/website" },
          { label: "Imagens", value: mediaCount, icon: Image, href: "/dashboard/images" },
          { label: "Eventos", value: website?._count.events ?? 0, icon: Calendar, href: "/dashboard/events" },
          { label: "Redes Sociais", value: website?._count.socialLinks ?? 0, icon: Share2, href: "/dashboard/social" },
        ].map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:border-sky-200 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <Icon className="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition-colors" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </Link>
        ))}
      </div>

      {/* Info do website */}
      {website && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Estado do Website</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Estado</p>
              <p className="font-medium text-gray-800">
                {website.isDraft ? "Rascunho — alterações por publicar" : "Publicado"}
              </p>
            </div>
            {website.publishedAt && (
              <div>
                <p className="text-gray-400 mb-1">Última publicação</p>
                <p className="font-medium text-gray-800">{formatDate(website.publishedAt)}</p>
              </div>
            )}
            {website.vercelUrl && (
              <div>
                <p className="text-gray-400 mb-1">URL do website</p>
                <a
                  href={website.vercelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-sky-700 font-medium"
                >
                  {website.vercelUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

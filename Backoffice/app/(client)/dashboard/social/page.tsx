import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import SocialLinksManager from "@/components/client/SocialLinksManager"

export default async function SocialPage() {
  const session = await auth()
  const tenantId = session!.user.tenantId!

  const website = await prisma.website.findUnique({
    where: { tenantId },
    select: { id: true, socialLinks: { orderBy: { order: "asc" } } },
  })

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Redes Sociais</h1>
        <p className="text-gray-500 mt-1">Adiciona os links das tuas redes sociais.</p>
      </div>

      <SocialLinksManager
        websiteId={website?.id ?? ""}
        initialLinks={website?.socialLinks ?? []}
      />
    </div>
  )
}

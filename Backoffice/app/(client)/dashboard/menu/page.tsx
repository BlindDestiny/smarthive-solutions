import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import MenuManager from "@/components/client/MenuManager"

export default async function MenuPage() {
  const session = await auth()
  const tenantId = session!.user.tenantId!

  const website = await prisma.website.findUnique({
    where: { tenantId },
    select: {
      id: true,
      menuItems: { orderBy: [{ category: "asc" }, { order: "asc" }] },
    },
  })

  const items = (website?.menuItems ?? []).map((item) => ({
    ...item,
    description: item.description,
    badge: item.badge,
    imageUrl: item.imageUrl,
  }))

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Menu / Ementa</h1>
        <p className="text-gray-500 mt-1">
          {items.length > 0
            ? `${items.length} items em ${[...new Set(items.map((i) => i.category))].length} categorias`
            : "Adiciona os items do menu do teu website."}
        </p>
      </div>

      <MenuManager initialItems={items} />
    </div>
  )
}

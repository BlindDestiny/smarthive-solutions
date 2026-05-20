import { auth } from "@/lib/auth"
import { getClientWebsite } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { type ContentSchema } from "@/lib/content-schema"
import ContentEditor from "@/components/client/ContentEditor"
import Link from "next/link"
import { Eye } from "lucide-react"

export default async function WebsiteEditorPage() {
  const session = await auth()
  const tenantId = session!.user.tenantId!

  const website = await getClientWebsite(tenantId)
  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId }, select: { slug: true } })

  const schema = (website?.contentSchema ?? []) as ContentSchema

  const contentMap: Record<string, string> = {}
  website?.contents.forEach((c) => { contentMap[c.key] = c.value })

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conteúdo do Website</h1>
          <p className="text-gray-500 mt-1">
            {schema.length > 0
              ? `${schema.length} campos em ${[...new Set(schema.map((f) => f.section))].length} secções`
              : "Edita os textos e informações do teu website."}
          </p>
        </div>
        <Link
          href={`/preview/${tenant?.slug ?? ""}`}
          className="flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:border-sky-300 hover:text-sky-600 hover:bg-sky-50 transition-all"
        >
          <Eye className="w-4 h-4" />
          Pré-visualizar
        </Link>
      </div>

      <ContentEditor schema={schema} initialContent={contentMap} />
    </div>
  )
}

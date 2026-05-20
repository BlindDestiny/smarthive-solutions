import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { validatePreviewToken } from "@/lib/preview-tokens"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const previewToken = req.nextUrl.searchParams.get("preview")

  // Se preview token presente e válido, usa tenantId do token em vez do slug
  let isDraftMode = false
  if (previewToken) {
    const tokenTenantId = validatePreviewToken(previewToken)
    if (tokenTenantId) isDraftMode = true
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      website: {
        include: {
          contents: true,
          events: {
            // Em draft mode: mostra todos os eventos não terminados
            // Em modo normal: só publicados
            where: isDraftMode ? { isEnded: false } : { isPublished: true, isEnded: false },
            orderBy: { date: "asc" },
          },
          socialLinks: { orderBy: { order: "asc" } },
          menuItems: {
            where: { isAvailable: true },
            orderBy: [{ category: "asc" }, { order: "asc" }],
          },
        },
      },
    },
  })

  if (!tenant || !tenant.website) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const content: Record<string, string> = {}
  tenant.website.contents.forEach((c) => { content[c.key] = c.value })

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
  }

  // Sem cache em preview; cache normal em produção
  if (!isDraftMode) {
    headers["Cache-Control"] = "public, s-maxage=60, stale-while-revalidate=300"
  } else {
    headers["Cache-Control"] = "no-store"
  }

  return NextResponse.json(
    {
      tenant: { name: tenant.name, slug: tenant.slug },
      content,
      events: tenant.website.events,
      socialLinks: tenant.website.socialLinks,
      menuItems: tenant.website.menuItems,
      publishedAt: tenant.website.publishedAt,
      isDraft: tenant.website.isDraft,
    },
    { headers }
  )
}

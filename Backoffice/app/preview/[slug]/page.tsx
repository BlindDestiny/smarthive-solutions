import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import PreviewFrame from "@/components/client/PreviewFrame"

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) redirect("/login")

  const { slug } = await params

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: { website: { select: { isDraft: true, publishedAt: true, vercelUrl: true } } },
  })

  // Só o próprio cliente ou admin pode ver o preview
  if (session.user.role !== "ADMIN" && tenant?.slug !== slug) {
    redirect("/dashboard")
  }

  return (
    <PreviewFrame
      slug={slug}
      tenantName={tenant?.name ?? slug}
      websiteUrl={tenant?.website?.vercelUrl ?? null}
      isDraft={tenant?.website?.isDraft ?? true}
      publishedAt={tenant?.website?.publishedAt?.toISOString() ?? null}
    />
  )
}

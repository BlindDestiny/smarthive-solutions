import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ImageUploader from "@/components/client/ImageUploader"

export default async function ImagesPage() {
  const session = await auth()
  const tenantId = session!.user.tenantId!

  const images = await prisma.mediaFile.findMany({
    where: { tenantId },
    orderBy: { uploadedAt: "desc" },
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Imagens</h1>
        <p className="text-gray-500 mt-1">Faz upload e gere as imagens do teu website.</p>
      </div>

      <ImageUploader initialImages={images.map((i) => ({ id: i.id, url: i.url, filename: i.filename }))} />
    </div>
  )
}

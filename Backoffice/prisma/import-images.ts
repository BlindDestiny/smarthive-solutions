/**
 * Importa as imagens de galeria hardcoded nos websites para a tabela MediaFile.
 * Corre com: npx tsx prisma/import-images.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const caveImages = [
  { filename: "Signature cocktail",    url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=85&auto=format&fit=crop" },
  { filename: "Cave bar",              url: "https://images.unsplash.com/photo-1551024709-8f23befc548b?w=700&q=85&auto=format&fit=crop" },
  { filename: "Dark lounge interior",  url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=85&auto=format&fit=crop" },
  { filename: "Evening crowd",         url: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=700&q=85&auto=format&fit=crop" },
  { filename: "Premium spirits",       url: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=700&q=85&auto=format&fit=crop" },
  { filename: "Candlelight ambiance",  url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85&auto=format&fit=crop" },
  { filename: "Cocktail hero",         url: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=85&auto=format&fit=crop" },
  { filename: "About image",           url: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=85&auto=format&fit=crop" },
]

const portoImages = [
  { filename: "Interior do restaurante", url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80&auto=format&fit=crop" },
  { filename: "Prato principal",         url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop" },
  { filename: "Mesa de comida",          url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80&auto=format&fit=crop" },
  { filename: "Jantar romântico",        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop" },
  { filename: "Pratos especiais",        url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80&auto=format&fit=crop" },
  { filename: "Comida colorida",         url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80&auto=format&fit=crop" },
  { filename: "Ambiente do restaurante", url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&auto=format&fit=crop" },
  { filename: "Feijoada completa",       url: "https://images.unsplash.com/photo-1547592180-85f173990554?w=700&q=80&auto=format&fit=crop" },
  { filename: "Picanha na chapa",        url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80&auto=format&fit=crop" },
  { filename: "Moqueca baiana",          url: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=700&q=80&auto=format&fit=crop" },
  { filename: "About image",             url: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80&auto=format&fit=crop" },
]

async function importImages(slug: string, images: { filename: string; url: string }[], label: string) {
  const tenant = await prisma.tenant.findUnique({ where: { slug } })
  if (!tenant) { console.warn(`⚠️  ${label} não encontrado.`); return }

  const existing = await prisma.mediaFile.count({ where: { tenantId: tenant.id } })
  if (existing > 0) {
    console.log(`✅ ${label}: ${existing} imagens já existiam — a saltar.`)
    return
  }

  // Deduplicate by URL
  const unique = images.filter((img, i, arr) => arr.findIndex((x) => x.url === img.url) === i)

  for (const img of unique) {
    await prisma.mediaFile.create({
      data: {
        tenantId: tenant.id,
        filename:  img.filename,
        url:       img.url,
        r2Key:     `external/${img.url.split("/").pop()?.split("?")[0] ?? "image"}`,
        size:      0,
        mimeType:  "image/jpeg",
      },
    })
  }

  console.log(`✅ ${label}: ${unique.length} imagens importadas`)
}

async function main() {
  console.log("🖼  A importar imagens dos websites...\n")
  await importImages("cave-lounge",        caveImages,  "Cave Lounge")
  await importImages("porto-dos-ribeiros", portoImages, "Porto dos Ribeiros")
  console.log("\n✨ Concluído!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

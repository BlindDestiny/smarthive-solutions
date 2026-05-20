/**
 * Importa eventos reais do cave-lounge e configura flags hasEvents/hasSocial.
 * Corre com: npx tsx prisma/import-events.ts
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Calcular próxima ocorrência de um dado dia da semana (0=Dom, 1=Seg, ..., 4=Qui, 5=Sex, 6=Sáb)
function nextWeekday(dayOfWeek: number, hour: number): Date {
  const now = new Date()
  const result = new Date(now)
  const diff = (dayOfWeek - now.getDay() + 7) % 7
  result.setDate(now.getDate() + (diff === 0 ? 7 : diff))
  result.setHours(hour, 0, 0, 0)
  return result
}

// Primeiro domingo do próximo mês
function firstSundayNextMonth(): Date {
  const now = new Date()
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const diff = (7 - firstOfNextMonth.getDay()) % 7
  firstOfNextMonth.setDate(firstOfNextMonth.getDate() + diff)
  firstOfNextMonth.setHours(19, 0, 0, 0)
  return firstOfNextMonth
}

const caveEvents = [
  {
    title: "Jazz & Bourbon Night",
    description: "Live jazz quartet from 9pm. Curated bourbon selection with expert-guided tastings. Intimate and soulful.",
    date: nextWeekday(4, 21), // Quinta-feira às 21h
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=85&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "Underground Sessions",
    description: "Resident DJs spin deep house and techno in the lower cave. The city disappears. Only the music remains.",
    date: nextWeekday(5, 22), // Sexta-feira às 22h
    imageUrl: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=700&q=85&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "Cave Saturdays",
    description: "Our flagship night. Guest DJs from across Europe, exclusive cocktail menus and a crowd that knows how to move.",
    date: nextWeekday(6, 22), // Sábado às 22h
    imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=700&q=85&auto=format&fit=crop",
    isPublished: true,
  },
  {
    title: "Secret Sessions",
    description: "First Sunday of every month. Invite-only acoustic sets in the inner cave. Whiskey, vinyl and conversation.",
    date: firstSundayNextMonth(), // Primeiro domingo do mês
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&q=85&auto=format&fit=crop",
    isPublished: true,
  },
]

async function main() {
  console.log("🎵 A importar eventos e configurar features...\n")

  // ── Cave Lounge ────────────────────────────────────────────────────────────
  const cave = await prisma.tenant.findUnique({
    where: { slug: "cave-lounge" },
    include: { website: true },
  })

  if (cave?.website) {
    // Configurar flags
    await prisma.website.update({
      where: { id: cave.website.id },
      data: { hasEvents: true, hasSocial: true },
    })

    // Importar eventos (só se não existirem já)
    const existing = await prisma.event.count({ where: { websiteId: cave.website.id } })
    if (existing === 0) {
      for (const event of caveEvents) {
        await prisma.event.create({
          data: { ...event, websiteId: cave.website.id },
        })
      }
      console.log(`✅ Cave Lounge: ${caveEvents.length} eventos importados, hasEvents=true`)
    } else {
      console.log(`✅ Cave Lounge: ${existing} eventos já existiam — a saltar importação. hasEvents=true aplicado.`)
    }
  } else {
    console.warn("⚠️  Cave Lounge não encontrado.")
  }

  // ── Porto dos Ribeiros ─────────────────────────────────────────────────────
  const porto = await prisma.tenant.findUnique({
    where: { slug: "porto-dos-ribeiros" },
    include: { website: true },
  })

  if (porto?.website) {
    await prisma.website.update({
      where: { id: porto.website.id },
      data: { hasEvents: false, hasSocial: true },
    })
    console.log("✅ Porto dos Ribeiros: sem secção de eventos — hasEvents=false")
  } else {
    console.warn("⚠️  Porto dos Ribeiros não encontrado.")
  }

  console.log("\n✨ Concluído!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const PORTO_MENU: Array<{
  category: string
  name: string
  description: string
  price: number
  badge?: string
  isVegetarian?: boolean
}> = [
  // Entradas
  { category: "Entradas", name: "Pão de Queijo (x6)",    description: "Pão de queijo mineiro tradicional, crocante por fora, cremoso por dentro", price: 4.50, badge: "🇧🇷 Clássico", isVegetarian: true },
  { category: "Entradas", name: "Coxinha de Frango",      description: "Coxinha estaladiça com recheio de frango desfiado e catupiry",              price: 5.00 },
  { category: "Entradas", name: "Caldinho de Feijão",     description: "Caldo de feijão preto cremoso com bacon crocante e cebolinha",              price: 4.00 },
  { category: "Entradas", name: "Bolinho de Bacalhau BR", description: "Bolinho frito à maneira brasileira, com bacalhau desfiado e ervas",         price: 5.50 },
  { category: "Entradas", name: "Salada Vinagrete",       description: "Tomate, cebola, pimento, coentros, azeite e vinagre — leve e fresca",       price: 4.00, isVegetarian: true },
  { category: "Entradas", name: "Mandioca Frita",         description: "Mandioca crocante frita com vinagrete e molho de alho",                     price: 4.50, badge: "Favorito", isVegetarian: true },

  // Pratos Principais
  { category: "Pratos Principais", name: "Feijoada Completa",    description: "Feijão preto, costelinha, paio, linguiça, arroz, couve, farofa e laranja",  price: 13.50, badge: "🏆 Especialidade" },
  { category: "Pratos Principais", name: "Picanha na Chapa",     description: "Picanha grelhada com arroz, feijão, farofa e vinagrete",                    price: 14.00, badge: "🔥 Mais pedido" },
  { category: "Pratos Principais", name: "Stroganoff de Frango", description: "Frango cremoso ao stroganoff, arroz e batata palha crocante",               price: 11.00 },
  { category: "Pratos Principais", name: "Moqueca Baiana",       description: "Peixe no leite de coco com dendê, coentros e arroz branco",                 price: 13.00 },
  { category: "Pratos Principais", name: "Arroz Carreteiro",     description: "Arroz com carne seca desfiada, pimento, cebola e ovo estrelado",             price: 12.00 },
  { category: "Pratos Principais", name: "Frango Grelhado",      description: "Frango temperado, grelhado, com arroz, feijão e salada",                     price: 10.00 },
  { category: "Pratos Principais", name: "Prato Vegetariano",    description: "Arroz, feijão, legumes grelhados, ovo e farofa de mandioca",                 price: 9.50, isVegetarian: true },

  // Sobremesas
  { category: "Sobremesas", name: "Brigadeiro Artesanal",  description: "Trufa de chocolate caseira enrolada em granulado — pura nostalgia", price: 4.00, badge: "🍫 Clássico", isVegetarian: true },
  { category: "Sobremesas", name: "Pudim de Leite",        description: "Pudim tradicional brasileiro, aveludado e caramelizado",            price: 4.50, isVegetarian: true },
  { category: "Sobremesas", name: "Mousse de Maracujá",    description: "Mousse leve e refrescante de maracujá fresco",                      price: 4.50, isVegetarian: true },
  { category: "Sobremesas", name: "Açaí na Tigela",        description: "Açaí puro com banana, granola, mel e morango",                      price: 6.00, badge: "Saudável", isVegetarian: true },

  // Bebidas
  { category: "Bebidas", name: "Caipirinha Clássica",    description: "Cachaça, lima, açúcar e gelo picado — a rainha das bebidas", price: 6.00, badge: "🍹 Assinatura" },
  { category: "Bebidas", name: "Caipirinha de Maracujá", description: "Cachaça, maracujá fresco, lima e açúcar",                      price: 6.50 },
  { category: "Bebidas", name: "Caipiroska de Morango",  description: "Vodka, morango fresco, lima e açúcar",                         price: 7.00 },
  { category: "Bebidas", name: "Suco Natural",           description: "Maracujá, laranja, manga ou goiaba — feito na hora",           price: 3.50, isVegetarian: true },
  { category: "Bebidas", name: "Guaraná Antarctica",     description: "O refrigerante mais icónico do Brasil, direto ao Porto",       price: 2.50, badge: "🇧🇷" },
  { category: "Bebidas", name: "Água de Coco",           description: "Natural, fresca e hidratante",                                 price: 3.00, isVegetarian: true },
]

async function main() {
  const portoWebsite = await prisma.website.findFirst({
    where: { tenant: { slug: "porto-dos-ribeiros" } },
    select: { id: true, tenantId: true },
  })

  if (!portoWebsite) {
    console.error("Website porto-dos-ribeiros não encontrado. Certifica que o seed foi corrido.")
    process.exit(1)
  }

  console.log(`Importando menu para website ${portoWebsite.id}...`)

  // Delete existing menu items to avoid duplicates
  const deleted = await prisma.menuItem.deleteMany({ where: { websiteId: portoWebsite.id } })
  console.log(`Removidos ${deleted.count} items anteriores.`)

  // Insert all items with order by category
  const categoryCounts: Record<string, number> = {}
  for (const item of PORTO_MENU) {
    const order = categoryCounts[item.category] ?? 0
    categoryCounts[item.category] = order + 1

    await prisma.menuItem.create({
      data: {
        websiteId:   portoWebsite.id,
        category:    item.category,
        name:        item.name,
        description: item.description,
        price:       item.price,
        badge:       item.badge ?? null,
        isVegetarian: item.isVegetarian ?? false,
        isAvailable:  true,
        order,
      },
    })
  }

  // Enable hasMenu for porto-dos-ribeiros
  await prisma.website.update({
    where: { id: portoWebsite.id },
    data: { hasMenu: true, hasReservations: true },
  })

  console.log(`Importados ${PORTO_MENU.length} items do menu.`)
  console.log("hasMenu e hasReservations activados para porto-dos-ribeiros.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

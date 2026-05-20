/**
 * Script one-time: importa schemas e conteúdo reais dos websites cave-lounge e porto-dos-ribeiros.
 * Corre com: npx tsx prisma/import-websites.ts
 */
import { PrismaClient } from "@prisma/client"
import type { ContentSchema } from "../lib/content-schema"

const prisma = new PrismaClient()

// ─── CAVE LOUNGE ─────────────────────────────────────────────────────────────

const caveSchema: ContentSchema = [
  // Hero
  { key: "hero.eyebrow",       label: "Tag eyebrow",         type: "text",     section: "Hero",    placeholder: "Ex: Underground Bar & Lounge" },
  { key: "hero.title1",        label: "Título — linha 1",    type: "text",     section: "Hero",    placeholder: "Ex: ENTER" },
  { key: "hero.title2",        label: "Título — linha 2",    type: "text",     section: "Hero",    placeholder: "Ex: THE CAVE" },
  { key: "hero.subtitle",      label: "Subtítulo",           type: "textarea", section: "Hero" },
  { key: "hero.cta_primary",   label: "Botão CTA principal", type: "text",     section: "Hero",    placeholder: "Ex: Reserve Now" },
  { key: "hero.cta_secondary", label: "Botão CTA secundário",type: "text",     section: "Hero",    placeholder: "Ex: Explore Menu" },
  { key: "hero.image",         label: "Imagem de fundo",     type: "image",    section: "Hero" },
  // About
  { key: "about.label",        label: "Label da secção",     type: "text",     section: "Sobre Nós" },
  { key: "about.title",        label: "Título",              type: "text",     section: "Sobre Nós" },
  { key: "about.body1",        label: "Parágrafo 1",         type: "textarea", section: "Sobre Nós" },
  { key: "about.body2",        label: "Parágrafo 2",         type: "textarea", section: "Sobre Nós" },
  { key: "about.image",        label: "Imagem",              type: "image",    section: "Sobre Nós" },
  { key: "about.founded_year", label: "Ano de fundação",     type: "text",     section: "Sobre Nós", placeholder: "Ex: 2018" },
  { key: "about.pillar1_title",label: "Pilar 1 — Título",    type: "text",     section: "Sobre Nós" },
  { key: "about.pillar1_desc", label: "Pilar 1 — Descrição", type: "textarea", section: "Sobre Nós" },
  { key: "about.pillar2_title",label: "Pilar 2 — Título",    type: "text",     section: "Sobre Nós" },
  { key: "about.pillar2_desc", label: "Pilar 2 — Descrição", type: "textarea", section: "Sobre Nós" },
  { key: "about.pillar3_title",label: "Pilar 3 — Título",    type: "text",     section: "Sobre Nós" },
  { key: "about.pillar3_desc", label: "Pilar 3 — Descrição", type: "textarea", section: "Sobre Nós" },
  // Contacto
  { key: "contact.phone",      label: "Telefone",            type: "phone",    section: "Contacto" },
  { key: "contact.email",      label: "Email",               type: "email",    section: "Contacto" },
  { key: "contact.address",    label: "Morada",              type: "text",     section: "Contacto" },
  { key: "contact.hours",      label: "Horário",             type: "textarea", section: "Contacto", hint: "Ex: Qui–Sáb 21h–5h · Dom 19h–23h" },
  // Reservas
  { key: "reservation.info",   label: "Texto de reservas",   type: "textarea", section: "Reservas" },
  { key: "reservation.promise1",label: "Promessa 1",         type: "text",     section: "Reservas" },
  { key: "reservation.promise2",label: "Promessa 2",         type: "text",     section: "Reservas" },
  { key: "reservation.promise3",label: "Promessa 3",         type: "text",     section: "Reservas" },
  { key: "reservation.promise4",label: "Promessa 4",         type: "text",     section: "Reservas" },
  // Footer
  { key: "footer.description",  label: "Descrição no footer", type: "textarea", section: "Footer" },
  { key: "footer.hours_thu",    label: "Horário — Quinta",    type: "text",     section: "Footer" },
  { key: "footer.hours_fri",    label: "Horário — Sexta",     type: "text",     section: "Footer" },
  { key: "footer.hours_sat",    label: "Horário — Sábado",    type: "text",     section: "Footer" },
  { key: "footer.hours_sun",    label: "Horário — Domingo",   type: "text",     section: "Footer" },
  // SEO
  { key: "seo.title",           label: "Título SEO",          type: "text",     section: "SEO", hint: "Ideal 50-60 caracteres" },
  { key: "seo.description",     label: "Descrição SEO",       type: "textarea", section: "SEO", hint: "Ideal 140-160 caracteres" },
]

const caveContent: Record<string, string> = {
  "hero.eyebrow":        "Underground Bar & Lounge",
  "hero.title1":         "ENTER",
  "hero.title2":         "THE CAVE",
  "hero.subtitle":       "Where extraordinary cocktails meet a world built beneath the streets. Bold flavours. Pure atmosphere.",
  "hero.cta_primary":    "Reserve Now",
  "hero.cta_secondary":  "Explore Menu",
  "hero.image":          "/cocktail-hero.png",
  "about.label":         "Our Story",
  "about.title":         "Born from the depths below",
  "about.body1":         "Tucked beneath the city streets, Cave Lounge was born from a passion for exceptional drinks and the kind of atmosphere that makes time disappear. Raw stone walls, flickering fire and a curated soundtrack — the stage for evenings you won't forget.",
  "about.body2":         "Our mixologists draw on global traditions to create cocktails as beautiful as they are complex. Every detail — from the glassware to the garnish — chosen with obsessive care.",
  "about.image":         "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=85&auto=format&fit=crop",
  "about.founded_year":  "2018",
  "about.pillar1_title": "Craft Cocktails",
  "about.pillar1_desc":  "Every drink is a ritual. Premium spirits and house-made infusions, crafted with obsessive care.",
  "about.pillar2_title": "Live Sounds",
  "about.pillar2_desc":  "From jazz on Thursdays to underground electronic on weekends — the music never stops.",
  "about.pillar3_title": "The Atmosphere",
  "about.pillar3_desc":  "Stone walls, candlelight and the warmth of fire. A world apart from the city above.",
  "contact.phone":       "+351 912 345 678",
  "contact.email":       "hello@cavelounge.pt",
  "contact.address":     "Rua do Alecrim 45, Lisboa",
  "contact.hours":       "Qui–Sáb: 21h–5h\nDom: 19h–23h",
  "reservation.info":    "Tables fill fast on weekends. Secure yours and we'll confirm within 2 hours. Private cave bookings available for groups of 8 or more.",
  "reservation.promise1":"Confirmation within 2 hours",
  "reservation.promise2":"Free cancellation 24h before",
  "reservation.promise3":"Private cave for groups 8+",
  "reservation.promise4":"Special occasions curated",
  "footer.description":  "Underground bar & lounge. Where the night has no ceiling and every drink tells a story. Bairro Alto, Lisboa.",
  "footer.hours_thu":    "9pm–2am",
  "footer.hours_fri":    "10pm–4am",
  "footer.hours_sat":    "10pm–5am",
  "footer.hours_sun":    "7pm–11pm",
  "seo.title":           "Cave Lounge — Underground Bar & Cocktails Lisboa",
  "seo.description":     "Bar & lounge underground em Lisboa. Cocktails artesanais, música ao vivo e atmosfera única no Bairro Alto.",
}

// ─── PORTO DOS RIBEIROS ────────────────────────────────────────────────────────

const portoSchema: ContentSchema = [
  // Hero
  { key: "hero.eyebrow",           label: "Tag eyebrow",              type: "text",     section: "Hero", placeholder: "Ex: 🇧🇷 Restaurante Brasileiro · Porto" },
  { key: "hero.title1",            label: "Título — linha 1",         type: "text",     section: "Hero" },
  { key: "hero.title2",            label: "Título — linha 2",         type: "text",     section: "Hero" },
  { key: "hero.tagline",           label: "Tagline",                  type: "text",     section: "Hero" },
  { key: "hero.rating",            label: "Texto de avaliação",       type: "text",     section: "Hero", placeholder: "Ex: 4.7 · 287 opiniões Google" },
  { key: "hero.whatsapp",          label: "Número WhatsApp (c/ 351)", type: "phone",    section: "Hero", placeholder: "Ex: 351963349411" },
  { key: "hero.address",           label: "Morada (linha hero)",      type: "text",     section: "Hero" },
  // Sobre Nós
  { key: "about.label",            label: "Label da secção",          type: "text",     section: "Sobre Nós" },
  { key: "about.title",            label: "Título",                   type: "text",     section: "Sobre Nós" },
  { key: "about.body1",            label: "Parágrafo 1",              type: "textarea", section: "Sobre Nós" },
  { key: "about.body2",            label: "Parágrafo 2",              type: "textarea", section: "Sobre Nós" },
  { key: "about.image",            label: "Imagem",                   type: "image",    section: "Sobre Nós" },
  { key: "about.rating_value",     label: "Avaliação Google (valor)", type: "text",     section: "Sobre Nós", placeholder: "Ex: 4.7" },
  { key: "about.rating_count",     label: "Nº de opiniões",           type: "text",     section: "Sobre Nós", placeholder: "Ex: 287 opiniões" },
  { key: "about.highlight1",       label: "Destaque 1",               type: "text",     section: "Sobre Nós", placeholder: "🍛 Feijoada todos os dias" },
  { key: "about.highlight2",       label: "Destaque 2",               type: "text",     section: "Sobre Nós", placeholder: "🥩 Picanha fresca" },
  { key: "about.highlight3",       label: "Destaque 3",               type: "text",     section: "Sobre Nós", placeholder: "🌿 Opções vegetarianas" },
  { key: "about.highlight4",       label: "Destaque 4",               type: "text",     section: "Sobre Nós", placeholder: "☀️ Esplanada disponível" },
  // Contacto
  { key: "contact.phone",          label: "Telefone",                 type: "phone",    section: "Contacto" },
  { key: "contact.address",        label: "Morada",                   type: "text",     section: "Contacto" },
  { key: "contact.address_zip",    label: "Código postal",            type: "text",     section: "Contacto", placeholder: "Ex: 4200-196 Porto" },
  { key: "contact.hours_weekday",  label: "Horário — Seg a Qui",      type: "text",     section: "Contacto", placeholder: "Ex: Dom–Qui: 07h–22h" },
  { key: "contact.hours_weekend",  label: "Horário — Sex e Sáb",      type: "text",     section: "Contacto", placeholder: "Ex: Sex–Sáb: 07h–24h" },
  { key: "contact.amenities",      label: "Comodidades",              type: "text",     section: "Contacto", placeholder: "Ex: Wi-Fi grátis · Esplanada · Vegetariano" },
  { key: "contact.whatsapp_msg",   label: "Mensagem WhatsApp padrão", type: "textarea", section: "Contacto" },
  // Footer
  { key: "footer.tagline",         label: "Tagline footer",           type: "text",     section: "Footer" },
  { key: "footer.description",     label: "Descrição footer",         type: "textarea", section: "Footer" },
  { key: "footer.instagram",       label: "Instagram handle",         type: "text",     section: "Footer", placeholder: "Ex: @portodosribeiros" },
  // SEO
  { key: "seo.title",              label: "Título SEO",               type: "text",     section: "SEO", hint: "Ideal 50-60 caracteres" },
  { key: "seo.description",        label: "Descrição SEO",            type: "textarea", section: "SEO", hint: "Ideal 140-160 caracteres" },
]

const portoContent: Record<string, string> = {
  "hero.eyebrow":          "🇧🇷 Restaurante Brasileiro · Porto",
  "hero.title1":           "Porto dos",
  "hero.title2":           "Ribeiros",
  "hero.tagline":          "Comida Brasileira Autêntica",
  "hero.rating":           "4.7 · 287 opiniões Google",
  "hero.whatsapp":         "351963349411",
  "hero.address":          "Rua da Constituição 982, Porto",
  "about.label":           "A Nossa História",
  "about.title":           "Sabores do Brasil no coração do Porto",
  "about.body1":           "Somos um restaurante familiar com a alma do Brasil. Cada prato que sai da nossa cozinha carrega a tradição, o calor e os sabores autênticos da culinária brasileira — desde a feijoada que aquece a alma até à picanha que conquista de imediato.",
  "about.body2":           "Estamos na Rua da Constituição desde o primeiro dia, e fizemos do Porto a nossa segunda casa. Aqui não há apenas clientes — há família.",
  "about.image":           "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80&auto=format&fit=crop",
  "about.rating_value":    "4.7",
  "about.rating_count":    "287 opiniões",
  "about.highlight1":      "🍛 Feijoada todos os dias",
  "about.highlight2":      "🥩 Picanha fresca",
  "about.highlight3":      "🌿 Opções vegetarianas",
  "about.highlight4":      "☀️ Esplanada disponível",
  "contact.phone":         "963 349 411",
  "contact.address":       "Rua da Constituição 982, Porto",
  "contact.address_zip":   "4200-196 Porto",
  "contact.hours_weekday": "Dom–Qui: 07h–22h",
  "contact.hours_weekend": "Sex–Sáb: 07h–24h",
  "contact.amenities":     "Wi-Fi grátis · Esplanada · Vegetariano",
  "contact.whatsapp_msg":  "Olá! Gostaria de fazer uma reserva.",
  "footer.tagline":        "Comida Brasileira Autêntica",
  "footer.description":    "Sabores autênticos do Brasil no coração do Porto. Uma família que serve família.",
  "footer.instagram":      "@portodosribeiros",
  "seo.title":             "Porto dos Ribeiros — Restaurante Brasileiro no Porto",
  "seo.description":       "Restaurante brasileiro autêntico no Porto. Feijoada, picanha, moqueca e caipirinhas. Aberto todos os dias.",
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 A importar conteúdo dos websites...\n")

  for (const { slug, schema, content, label } of [
    { slug: "cave-lounge",       schema: caveSchema,  content: caveContent,  label: "Cave Lounge" },
    { slug: "porto-dos-ribeiros",schema: portoSchema, content: portoContent, label: "Porto dos Ribeiros" },
  ]) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: { website: true },
    })

    if (!tenant?.website) {
      console.warn(`⚠️  Tenant "${label}" não encontrado ou sem website. A saltar.`)
      continue
    }

    const websiteId = tenant.website.id

    // Actualizar schema
    await prisma.website.update({
      where: { id: websiteId },
      data: { contentSchema: schema },
    })

    // Upsert de cada campo de conteúdo
    for (const [key, value] of Object.entries(content)) {
      await prisma.websiteContent.upsert({
        where: { websiteId_key: { websiteId, key } },
        update: { value, updatedAt: new Date() },
        create: { websiteId, key, value },
      })
    }

    console.log(`✅ ${label}: ${schema.length} campos de schema, ${Object.keys(content).length} valores importados`)
  }

  console.log("\n✨ Importação concluída!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

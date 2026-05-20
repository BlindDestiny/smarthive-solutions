import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { SCHEMA_TEMPLATES } from "../lib/content-schema"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 A iniciar seed...")

  // Planos
  const planFree = await prisma.plan.upsert({
    where: { id: "plan-free" },
    update: {},
    create: {
      id: "plan-free",
      name: "Gratuito",
      type: "FREE",
      priceEur: 0,
      features: { hasLanding: false, hasSubscription: false, maxImages: 5, customDomain: false },
    },
  })

  const planLanding = await prisma.plan.upsert({
    where: { id: "plan-landing" },
    update: {},
    create: {
      id: "plan-landing",
      name: "Landing Page",
      type: "LANDING",
      priceEur: 49,
      features: { hasLanding: true, hasSubscription: false, maxImages: 20, customDomain: true },
    },
  })

  const planPro = await prisma.plan.upsert({
    where: { id: "plan-pro" },
    update: {},
    create: {
      id: "plan-pro",
      name: "Landing + Subscrição",
      type: "LANDING_SUBSCRIPTION",
      priceEur: 99,
      features: { hasLanding: true, hasSubscription: true, maxImages: 100, customDomain: true },
    },
  })

  console.log("✅ Planos criados:", planFree.name, planLanding.name, planPro.name)

  // Admin
  const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123456", 12)
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@smarthive.pt" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@smarthive.pt",
      passwordHash: adminHash,
      name: "Miguel Lourenço",
      role: "ADMIN",
    },
  })
  console.log("✅ Admin criado:", admin.email)

  // Tenant 1 — Cave Lounge
  const tenant1 = await prisma.tenant.upsert({
    where: { slug: "cave-lounge" },
    update: {},
    create: {
      name: "Cave Lounge",
      slug: "cave-lounge",
      status: "ACTIVE",
      planId: planPro.id,
    },
  })

  const client1Hash = await bcrypt.hash("cliente123", 12)
  await prisma.user.upsert({
    where: { email: "cave@smarthive.pt" },
    update: {},
    create: {
      email: "cave@smarthive.pt",
      passwordHash: client1Hash,
      name: "Cave Lounge",
      role: "CLIENT",
      tenantId: tenant1.id,
    },
  })

  await prisma.website.upsert({
    where: { tenantId: tenant1.id },
    update: {},
    create: {
      tenantId: tenant1.id,
      isDraft: false,
      publishedAt: new Date(),
      vercelUrl: "https://cave-lounge.vercel.app",
      contentSchema: SCHEMA_TEMPLATES.restaurant.fields,
      contents: {
        create: [
          { key: "hero.title",       value: "Cave Lounge" },
          { key: "hero.subtitle",    value: "Bar & Cocktails em Lisboa" },
          { key: "about.title",      value: "A Nossa História" },
          { key: "about.text",       value: "Um espaço único para momentos especiais no coração de Lisboa." },
          { key: "menu.title",       value: "A Nossa Carta" },
          { key: "contact.phone",    value: "+351 210 000 000" },
          { key: "contact.email",    value: "info@cavelounge.pt" },
          { key: "contact.address",  value: "Rua da Cave, 42, Lisboa" },
          { key: "contact.hours",    value: "Ter-Dom: 18h-02h" },
          { key: "seo.title",        value: "Cave Lounge — Bar & Cocktails em Lisboa" },
          { key: "seo.description",  value: "O melhor bar de cocktails em Lisboa. Atmosfera única, drinks artesanais." },
        ],
      },
      socialLinks: {
        create: [
          { platform: "instagram", url: "https://instagram.com/cavelounge", icon: "Instagram", order: 0 },
          { platform: "facebook",  url: "https://facebook.com/cavelounge",  icon: "Facebook",  order: 1 },
        ],
      },
    },
  })

  console.log("✅ Tenant criado:", tenant1.name)

  // Tenant 2 — Porto dos Ribeiros
  const tenant2 = await prisma.tenant.upsert({
    where: { slug: "porto-dos-ribeiros" },
    update: {},
    create: {
      name: "Porto dos Ribeiros",
      slug: "porto-dos-ribeiros",
      status: "ACTIVE",
      planId: planLanding.id,
    },
  })

  const client2Hash = await bcrypt.hash("cliente123", 12)
  await prisma.user.upsert({
    where: { email: "porto@smarthive.pt" },
    update: {},
    create: {
      email: "porto@smarthive.pt",
      passwordHash: client2Hash,
      name: "Porto dos Ribeiros",
      role: "CLIENT",
      tenantId: tenant2.id,
    },
  })

  await prisma.website.upsert({
    where: { tenantId: tenant2.id },
    update: {},
    create: {
      tenantId: tenant2.id,
      isDraft: true,
      vercelUrl: "https://porto-ribeiros.vercel.app",
      contentSchema: SCHEMA_TEMPLATES.restaurant.fields,
      contents: {
        create: [
          { key: "hero.title",       value: "Porto dos Ribeiros" },
          { key: "hero.subtitle",    value: "Restaurante Português Tradicional" },
          { key: "about.title",      value: "A Nossa Cozinha" },
          { key: "about.text",       value: "Sabores autênticos da cozinha portuguesa, receitas de família." },
          { key: "menu.title",       value: "A Nossa Ementa" },
          { key: "contact.phone",    value: "+351 220 000 000" },
          { key: "contact.email",    value: "info@portodosribeiros.pt" },
          { key: "contact.address",  value: "Rua dos Ribeiros, 8, Porto" },
          { key: "contact.hours",    value: "Seg-Dom: 12h-23h" },
          { key: "seo.title",        value: "Porto dos Ribeiros — Restaurante Tradicional" },
          { key: "seo.description",  value: "Restaurante português tradicional no Porto. Pratos típicos e ambiente familiar." },
        ],
      },
    },
  })

  console.log("✅ Tenant criado:", tenant2.name)
  console.log("\n🎉 Seed concluído!")
  console.log("\nCredenciais:")
  console.log(`  Admin: ${process.env.ADMIN_EMAIL || "admin@smarthive.pt"} / ${process.env.ADMIN_PASSWORD || "admin123456"}`)
  console.log("  Cliente 1: cave@smarthive.pt / cliente123")
  console.log("  Cliente 2: porto@smarthive.pt / cliente123")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

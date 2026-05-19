const SLUG = process.env.NEXT_PUBLIC_SITE_SLUG ?? "porto-dos-ribeiros"
const BACKOFFICE = process.env.BACKOFFICE_URL ?? "http://localhost:3010"

export type SiteContent = Record<string, string>

export const DEFAULT_CONTENT: SiteContent = {
  "hero.eyebrow":          "🇧🇷 Restaurante Brasileiro · Porto",
  "hero.title1":           "Porto dos",
  "hero.title2":           "Ribeiros",
  "hero.tagline":          "Comida Brasileira Autêntica",
  "hero.rating":           "4.7 · 287 opiniões Google",
  "hero.whatsapp":         "351963349411",
  "hero.address":          "Rua da Constituição 982, Porto",
  "about.label":           "A Nossa História",
  "about.title":           "Sabores do Brasil no coração do Porto",
  "about.body1":           "Somos um restaurante familiar com a alma do Brasil. Cada prato que sai da nossa cozinha carrega a tradição, o calor e os sabores autênticos da culinária brasileira.",
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

export async function getSiteContent(previewToken?: string): Promise<SiteContent> {
  const url = previewToken
    ? `${BACKOFFICE}/api/public/${SLUG}?preview=${previewToken}`
    : `${BACKOFFICE}/api/public/${SLUG}`

  try {
    const res = await fetch(url, {
      cache: previewToken ? "no-store" : "force-cache",
      next: previewToken ? undefined : { revalidate: 300 },
    })
    if (!res.ok) return DEFAULT_CONTENT
    const data = await res.json()
    return { ...DEFAULT_CONTENT, ...data.content }
  } catch {
    return DEFAULT_CONTENT
  }
}

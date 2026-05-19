const SLUG = process.env.NEXT_PUBLIC_SITE_SLUG ?? "cave-lounge"
const BACKOFFICE = process.env.BACKOFFICE_URL ?? "http://localhost:3010"

export type SiteContent = Record<string, string>

/** Conteúdo hardcoded — fallback se a API não estiver disponível */
export const DEFAULT_CONTENT: SiteContent = {
  "hero.eyebrow":        "Underground Bar & Lounge",
  "hero.title1":         "ENTER",
  "hero.title2":         "THE CAVE",
  "hero.subtitle":       "Where extraordinary cocktails meet a world built beneath the streets. Bold flavours. Pure atmosphere.",
  "hero.cta_primary":    "Reserve Now",
  "hero.cta_secondary":  "Explore Menu",
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
  "footer.description":  "Underground bar & lounge. Where the night has no ceiling and every drink tells a story. Bairro Alto, Lisboa.",
  "footer.hours_thu":    "9pm–2am",
  "footer.hours_fri":    "10pm–4am",
  "footer.hours_sat":    "10pm–5am",
  "footer.hours_sun":    "7pm–11pm",
  "seo.title":           "Cave Lounge — Underground Bar & Cocktails Lisboa",
  "seo.description":     "Bar & lounge underground em Lisboa. Cocktails artesanais, música ao vivo e atmosfera única no Bairro Alto.",
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
    // Merge com defaults para garantir que todos os campos existem
    return { ...DEFAULT_CONTENT, ...data.content }
  } catch {
    return DEFAULT_CONTENT
  }
}

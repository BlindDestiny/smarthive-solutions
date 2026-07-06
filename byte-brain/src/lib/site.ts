/** Global site constants — single source of truth for brand + URLs. */
export const site = {
  name: "Byte & Brain",
  shortName: "Byte & Brain",
  domain: "byteandbrain.pt",
  url: "https://byteandbrain.pt",
  email: "geral@byteandbrain.pt",
  whatsapp: "351913768074",
  // Positioning line used in metadata + structured data.
  slogan: "Digital Growth Systems for SMEs",
  locales: ["pt", "en", "es", "fr"] as const,
  foundingYear: "2025",
  founder: "Miguel Lourenço",
  // Service-area business (no fixed storefront) based in Setúbal, Portugal.
  location: {
    locality: "Setúbal",
    region: "Setúbal",
    country: "PT",
  },
  ogImage: "/brand/og.png",
  legalUpdated: "2026-07-01",
  social: {
    linkedin: "https://www.linkedin.com/company/byte-and-brain",
    instagram: "https://www.instagram.com/bytandbrain",
    facebook: "https://www.facebook.com/byteandbrain",
  },
} as const;

/**
 * Primary navigation. `page` items are real routes (next-intl Link handles the
 * locale prefix + localized path); `anchor` items scroll to a homepage section.
 */
export const mainNav = [
  { key: "services", type: "page", href: "/services" },
  { key: "process", type: "anchor", hash: "process" },
  { key: "cases", type: "anchor", hash: "cases" },
  { key: "tech", type: "anchor", hash: "tech" },
  { key: "blog", type: "page", href: "/blog" },
] as const;

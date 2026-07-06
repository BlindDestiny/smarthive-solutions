import { defineRouting } from "next-intl/routing";

export const locales = ["pt", "en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Portuguese lives at the root (/), other locales are prefixed (/en, /es, /fr).
  localePrefix: "as-needed",
  // Localized URL segments per locale. Dynamic [slug] values are localized
  // in code (see content/services.ts slugFor); these translate static parts.
  pathnames: {
    "/": "/",
    "/services": {
      pt: "/servicos",
      en: "/services",
      es: "/servicios",
      fr: "/services",
    },
    "/services/[slug]": {
      pt: "/servicos/[slug]",
      en: "/services/[slug]",
      es: "/servicios/[slug]",
      fr: "/services/[slug]",
    },
    "/about": {
      pt: "/sobre",
      en: "/about",
      es: "/nosotros",
      fr: "/a-propos",
    },
    "/contact": {
      pt: "/contacto",
      en: "/contact",
      es: "/contacto",
      fr: "/contact",
    },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/blog/category/[category]": {
      pt: "/blog/categoria/[category]",
      en: "/blog/category/[category]",
      es: "/blog/categoria/[category]",
      fr: "/blog/categorie/[category]",
    },
    "/privacy": {
      pt: "/privacidade",
      en: "/privacy",
      es: "/privacidad",
      fr: "/confidentialite",
    },
    "/terms": {
      pt: "/termos",
      en: "/terms",
      es: "/terminos",
      fr: "/conditions",
    },
  },
});

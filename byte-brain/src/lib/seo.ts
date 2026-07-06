import { site } from "./site";
import { getPathname } from "@/i18n/navigation";
import { locales, defaultLocale, type Locale } from "@/i18n/routing";
import { slugFor } from "@/content/services";

/** Absolute URL for a locale + raw path (no pathname localization). */
export function absoluteUrl(locale: Locale, path = "") {
  const prefix = locale === "pt" ? "" : `/${locale}`;
  const clean = path.replace(/^\//, "");
  return `${site.url}${prefix}${clean ? `/${clean}` : ""}`;
}

// next-intl href accepted by getPathname (string route or dynamic descriptor).
type Href = Parameters<typeof getPathname>[0]["href"];

/** Absolute URL for a localized route (translates static segments). */
export function localizedUrl(locale: Locale, href: Href) {
  return `${site.url}${getPathname({ locale, href })}`;
}

/** hreflang alternates for a localized route. */
export function localizedAlternates(href: Href) {
  const map: Record<string, string> = {
    "x-default": localizedUrl(defaultLocale, href),
  };
  for (const l of locales) map[l] = localizedUrl(l, href);
  return map;
}

/** Absolute URL for a service, using the locale's native slug. */
export function serviceUrl(locale: Locale, canonical: string) {
  return localizedUrl(locale, {
    pathname: "/services/[slug]",
    params: { slug: slugFor(canonical, locale) },
  });
}

/** hreflang alternates for a service (per-locale native slugs). */
export function serviceAlternates(canonical: string) {
  const map: Record<string, string> = { "x-default": serviceUrl("pt", canonical) };
  for (const l of locales) map[l] = serviceUrl(l, canonical);
  return map;
}

/** @deprecated use localizedAlternates — kept for raw paths. */
export function languageAlternates(path = "") {
  const map: Record<string, string> = {
    "x-default": absoluteUrl(defaultLocale, path),
  };
  for (const l of locales) map[l] = absoluteUrl(l, path);
  return map;
}

export function organizationSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.name,
    url: site.url,
    email: site.email,
    slogan: site.slogan,
    description:
      "Byte & Brain builds Digital Growth Systems for SMEs — high-performance websites, SEO, AI SEO, automation and analytics in one integrated system.",
    inLanguage: locale,
    logo: {
      "@type": "ImageObject",
      "@id": `${site.url}/#logo`,
      url: `${site.url}/icon.png`,
      width: 512,
      height: 512,
    },
    image: `${site.url}${site.ogImage}`,
    foundingDate: site.foundingYear,
    founder: {
      "@type": "Person",
      name: site.founder,
      jobTitle: "Founder",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location.locality,
      addressRegion: site.location.region,
      addressCountry: site.location.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: site.email,
      contactType: "customer support",
      availableLanguage: ["Portuguese", "English", "Spanish", "French"],
    },
    sameAs: [site.social.linkedin, site.social.instagram, site.social.facebook],
    areaServed: ["Setúbal", "PT", "ES", "FR", "Europe"],
    knowsAbout: [
      "Web Development",
      "Search Engine Optimization",
      "AI SEO",
      "Marketing Automation",
      "Artificial Intelligence",
      "Web Analytics",
    ],
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    inLanguage: locale,
    publisher: { "@id": `${site.url}/#organization` },
  };
}

/** ProfessionalService — richer than Organization for a services business. */
export function professionalServiceSchema(locale: Locale) {
  const services = [
    "Website Development",
    "SEO",
    "AI SEO",
    "Local SEO",
    "Automation",
    "Artificial Intelligence",
    "Analytics",
    "Maintenance",
    "Consulting",
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#service`,
    name: site.name,
    url: site.url,
    inLanguage: locale,
    parentOrganization: { "@id": `${site.url}/#organization` },
    serviceType: "Digital Growth Systems",
    areaServed: ["PT", "ES", "Europe"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Growth Services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s },
      })),
    },
  };
}

export function serviceSchema(
  locale: Locale,
  service: { canonical: string; name: string; description: string },
) {
  const url = serviceUrl(locale, service.canonical);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    description: service.description,
    serviceType: service.name,
    url,
    inLanguage: locale,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: ["PT", "ES", "Europe"],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

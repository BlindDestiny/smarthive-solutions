import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import { services } from "@/content/services";
import { getAllPosts, categoriesForLocale } from "@/lib/blog";
import {
  localizedUrl,
  localizedAlternates,
  serviceUrl,
  serviceAlternates,
} from "@/lib/seo";

const lastModified = new Date("2026-07-03");

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static localized routes (one entry per locale + hreflang alternates).
  const staticRoutes: {
    href: "/" | "/services" | "/blog" | "/about" | "/contact" | "/privacy" | "/terms";
    priority: number;
  }[] = [
    { href: "/", priority: 1 },
    { href: "/services", priority: 0.9 },
    { href: "/about", priority: 0.8 },
    { href: "/blog", priority: 0.8 },
    { href: "/contact", priority: 0.7 },
    { href: "/privacy", priority: 0.3 },
    { href: "/terms", priority: 0.3 },
  ];

  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: localizedUrl(locale, route.href),
        lastModified,
        changeFrequency: route.href === "/" ? "weekly" : "monthly",
        priority: route.priority,
        alternates: { languages: localizedAlternates(route.href) },
      });
    }
  }

  // Service pages (native slug per locale).
  for (const s of services) {
    for (const locale of locales) {
      entries.push({
        url: serviceUrl(locale, s.slug),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: serviceAlternates(s.slug) },
      });
    }
  }

  // Blog category hub pages.
  for (const locale of locales) {
    for (const category of categoriesForLocale(locale)) {
      entries.push({
        url: localizedUrl(locale, {
          pathname: "/blog/category/[category]",
          params: { category },
        }),
        lastModified,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  // Blog posts (each authored in a single locale).
  for (const post of getAllPosts()) {
    entries.push({
      url: localizedUrl(post.locale, {
        pathname: "/blog/[slug]",
        params: { slug: post.slug },
      }),
      lastModified: new Date(post.date),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}

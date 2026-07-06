import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { services, getServiceContent, slugFor } from "@/content/services";
import { serviceIcons } from "@/lib/service-icons";
import {
  localizedUrl,
  localizedAlternates,
  serviceUrl,
  breadcrumbSchema,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { CtaBanner } from "@/components/sections/cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesIndex" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: localizedUrl(locale as Locale, "/services"),
      languages: localizedAlternates("/services"),
    },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: localizedUrl(locale as Locale, "/services"),
      siteName: site.name,
      locale,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ServicesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "servicesIndex" });
  const tp = await getTranslations({ locale, namespace: "servicePage" });

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: getServiceContent(s, loc).eyebrow,
      url: serviceUrl(loc, s.slug),
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          itemList,
          breadcrumbSchema([
            { name: tp("breadcrumbHome"), url: localizedUrl(loc, "/") },
            { name: tp("breadcrumbServices"), url: localizedUrl(loc, "/services") },
          ]),
        ]}
      />

      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
        <div
          className="glow-brand absolute left-1/2 top-[-20%] -z-10 h-[420px] w-[720px] -translate-x-1/2"
          aria-hidden
        />
        <div className="container-page py-16 sm:py-24">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              {tp("breadcrumbHome")}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">{tp("breadcrumbServices")}</span>
          </nav>

          <div className="mt-10 max-w-3xl">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {t("eyebrow")}
            </span>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const c = getServiceContent(s, loc);
            const Icon = serviceIcons[s.iconKey];
            return (
              <Reveal key={s.slug} index={i % 3}>
                <Link
                  href={{
                    pathname: "/services/[slug]",
                    params: { slug: slugFor(s.slug, loc) },
                  }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    {Icon && <Icon className="size-5" />}
                  </span>
                  <h2 className="mt-5 flex items-center gap-1.5 text-lg font-semibold text-foreground">
                    {c.eyebrow}
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.subtitle}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

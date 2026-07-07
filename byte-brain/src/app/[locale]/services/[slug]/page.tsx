import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronRight, Check, ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  services,
  getService,
  getServiceContent,
  slugFor,
  canonicalFromLocalizedSlug,
  localizedServiceParams,
} from "@/content/services";
import { serviceIcons } from "@/lib/service-icons";
import {
  localizedUrl,
  serviceUrl,
  serviceAlternates,
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { CtaBanner } from "@/components/sections/cta";

export function generateStaticParams() {
  return localizedServiceParams(routing.locales);
}

function resolve(slug: string, locale: Locale) {
  const canonical = canonicalFromLocalizedSlug(slug, locale);
  return canonical ? getService(canonical) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const service = resolve(slug, loc);
  if (!service) return {};
  const c = getServiceContent(service, loc);
  const url = serviceUrl(loc, service.slug);

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: service.keywords,
    alternates: {
      canonical: url,
      languages: serviceAlternates(service.slug),
    },
    openGraph: {
      type: "website",
      title: c.metaTitle,
      description: c.metaDescription,
      url,
      siteName: site.name,
      locale,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const loc = locale as Locale;
  const service = resolve(slug, loc);
  if (!service) notFound();

  const c = getServiceContent(service, loc);
  const t = await getTranslations({ locale, namespace: "servicePage" });
  const tc = await getTranslations({ locale, namespace: "cta" });
  const Icon = serviceIcons[service.iconKey];

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  const crumbs = [
    { name: t("breadcrumbHome"), url: localizedUrl(loc, "/") },
    { name: t("breadcrumbServices"), url: localizedUrl(loc, "/services") },
    { name: c.eyebrow, url: serviceUrl(loc, service.slug) },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema(loc, {
            canonical: service.slug,
            name: c.eyebrow,
            description: c.metaDescription,
          }),
          faqSchema(c.faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
        <div
          className="glow-brand absolute left-1/2 top-[-20%] -z-10 h-[420px] w-[720px] -translate-x-1/2"
          aria-hidden
        />
        <div className="container-page py-16 sm:py-20">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              {t("breadcrumbHome")}
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/services" className="hover:text-foreground">
              {t("breadcrumbServices")}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">{c.eyebrow}</span>
          </nav>

          <div className="mt-10 max-w-3xl">
            <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {Icon && <Icon className="size-7" />}
            </span>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
              {c.title}
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {c.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground shadow-[0_12px_32px_-10px_var(--glow)] transition-all hover:-translate-y-0.5 hover:brightness-110"
              >
                {tc("primary")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview + benefits */}
      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {t("overviewTitle")}
            </span>
            <p className="mt-4 text-pretty text-xl leading-relaxed text-foreground">
              {c.intro}
            </p>
          </Reveal>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("benefitsTitle")}
            </h2>
            <div className="mt-6 grid gap-4">
              {c.benefits.map((b, i) => (
                <Reveal key={b.title} index={i}>
                  <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Check className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {b.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {b.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="border-t border-border bg-background-subtle py-20 sm:py-24">
        <div className="container-page">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("deliverablesTitle")}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              {t("deliverablesSubtitle")}
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {c.deliverables.map((d, i) => (
              <Reveal key={d.title} index={i % 2}>
                <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6">
                  <span className="font-mono text-sm font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {d.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {d.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — native details for zero-JS accessibility + SEO */}
      <section className="py-20 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              FAQ
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("faqTitle")}
            </h2>
          </Reveal>

          <ul className="divide-y divide-border border-y border-border">
            {c.faqs.map((f) => (
              <li key={f.q}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-base font-medium text-foreground">
                      {f.q}
                    </span>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Related services */}
      <section className="border-t border-border bg-background-subtle py-20 sm:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t("relatedTitle")}
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                {t("relatedSubtitle")}
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {t("allServices")}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {related.map((s) => {
              const rc = getServiceContent(s, loc);
              const RIcon = serviceIcons[s.iconKey];
              return (
                <Link
                  key={s.slug}
                  href={{
                    pathname: "/services/[slug]",
                    params: { slug: slugFor(s.slug, loc) },
                  }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elevated"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {RIcon && <RIcon className="size-5" />}
                  </span>
                  <h3 className="mt-5 flex items-center gap-1.5 text-lg font-semibold text-foreground">
                    {rc.eyebrow}
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {rc.subtitle}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {t("backToServices")}
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

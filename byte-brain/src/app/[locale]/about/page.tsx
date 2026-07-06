import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  localizedUrl,
  localizedAlternates,
  breadcrumbSchema,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";
import { Section, Eyebrow } from "@/components/sections/section-shell";
import { CtaBanner } from "@/components/sections/cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: localizedUrl(locale as Locale, "/about"),
      languages: localizedAlternates("/about"),
    },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: localizedUrl(locale as Locale, "/about"),
      siteName: site.name,
      locale,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  const tp = await getTranslations({ locale, namespace: "servicePage" });

  const story = t.raw("story") as string[];
  const values = t.raw("values") as { title: string; desc: string }[];
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${localizedUrl(loc, "/about")}#about`,
            url: localizedUrl(loc, "/about"),
            name: t("metaTitle"),
            inLanguage: loc,
            about: { "@id": `${site.url}/#organization` },
            mainEntity: {
              "@type": "Person",
              name: site.founder,
              jobTitle: t("founderRole"),
              worksFor: { "@id": `${site.url}/#organization` },
              sameAs: [site.social.linkedin],
            },
          },
          breadcrumbSchema([
            { name: tp("breadcrumbHome"), url: localizedUrl(loc, "/") },
            { name: t("eyebrow"), url: localizedUrl(loc, "/about") },
          ]),
        ]}
      />

      {/* Hero */}
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
            <span className="text-foreground">{t("eyebrow")}</span>
          </nav>

          <div className="mt-10 max-w-3xl">
            <Eyebrow>{t("eyebrow")}</Eyebrow>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>

          {/* Stats */}
          <dl className="mt-14 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col-reverse items-center gap-1 bg-background px-6 py-7 text-center"
              >
                <dt className="text-sm text-muted-foreground">{s.label}</dt>
                <dd className="text-2xl font-semibold tracking-tight text-foreground">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Story + Mission */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1px_1fr] lg:gap-16">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("storyTitle")}
            </h2>
            <div className="mt-5 space-y-4">
              {story.map((p, i) => (
                <p key={i} className="text-pretty leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <div className="hidden bg-border lg:block" aria-hidden />
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("missionTitle")}
            </h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground">
              {t("mission")}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Founder */}
      <Section className="border-t border-border bg-background-subtle">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>{t("founderTitle")}</Eyebrow>
          <div className="mt-6 flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center">
            <span className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent text-2xl font-bold text-white">
              ML
            </span>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {site.founder}
              </h2>
              <p className="text-sm font-medium text-primary">
                {t("founderRole")}
              </p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t("founderBio")}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section className="border-t border-border">
        <div className="max-w-2xl">
          <Eyebrow>{t("valuesTitle")}</Eyebrow>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} index={i % 2}>
              <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6">
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Check className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {v.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBanner />
    </>
  );
}

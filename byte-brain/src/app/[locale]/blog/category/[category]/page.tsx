import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ChevronRight, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  postsByCategory,
  categoriesForLocale,
  allCategoryParams,
  type BlogCategory,
} from "@/lib/blog";
import {
  localizedUrl,
  localizedAlternates,
  breadcrumbSchema,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { Reveal } from "@/components/motion/reveal";

export function generateStaticParams() {
  return allCategoryParams();
}

function href(category: string) {
  return {
    pathname: "/blog/category/[category]" as const,
    params: { category },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const label = t(`categories.${category as BlogCategory}`);
  return {
    title: `${label} · Blog`,
    description: `${t("subtitle")} — ${label}.`,
    alternates: {
      canonical: localizedUrl(locale as Locale, href(category)),
      languages: localizedAlternates(href(category)),
    },
    openGraph: {
      type: "website",
      title: `${label} · Blog · ${site.name}`,
      description: t("metaDescription"),
      url: localizedUrl(locale as Locale, href(category)),
      siteName: site.name,
      locale,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const cat = category as BlogCategory;

  if (!categoriesForLocale(loc).includes(cat)) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const label = t(`categories.${cat}`);
  const posts = postsByCategory(loc, cat);

  const fmt = (d: string) =>
    new Intl.DateTimeFormat(loc, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(d));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Byte & Brain", url: localizedUrl(loc, "/") },
          { name: t("eyebrow"), url: localizedUrl(loc, "/blog") },
          { name: label, url: localizedUrl(loc, href(category)) },
        ])}
      />

      <section className="relative overflow-hidden border-b border-border">
        <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
        <div className="container-page py-16 sm:py-20">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              Byte &amp; Brain
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/blog" className="hover:text-foreground">
              {t("eyebrow")}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">{label}</span>
          </nav>
          <div className="mt-8 max-w-2xl">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {t("eyebrow")}
            </span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              {label}
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.slug} index={i % 3}>
                <Link
                  href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                      {label}
                    </span>
                    <span className="text-muted-foreground">
                      {post.readingMinutes} {t("readingTime")}
                    </span>
                  </div>
                  <h2 className="mt-4 flex items-start gap-1.5 text-lg font-semibold leading-snug text-foreground">
                    {post.title}
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                  <time className="mt-5 text-xs font-medium text-muted-foreground">
                    {fmt(post.date)}
                  </time>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {t("backToBlog")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

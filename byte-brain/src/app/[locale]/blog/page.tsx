import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { getPostsForLocale, categoriesForLocale } from "@/lib/blog";
import {
  localizedUrl,
  localizedAlternates,
  breadcrumbSchema,
} from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { BlogList } from "@/components/blog/blog-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: localizedUrl(locale as Locale, "/blog"),
      languages: localizedAlternates("/blog"),
    },
    openGraph: {
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: localizedUrl(locale as Locale, "/blog"),
      siteName: site.name,
      locale,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;
  const t = await getTranslations({ locale, namespace: "blog" });

  const posts = getPostsForLocale(loc).map(({ content: _content, ...meta }) => {
    void _content;
    return meta;
  });

  const categoryLabels: Record<string, string> = {
    seo: t("categories.seo"),
    ai: t("categories.ai"),
    automation: t("categories.automation"),
    "digital-growth": t("categories.digital-growth"),
    "web-development": t("categories.web-development"),
    business: t("categories.business"),
  };

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${localizedUrl(loc, "/blog")}#blog`,
            name: `${site.name} — ${t("title")}`,
            url: localizedUrl(loc, "/blog"),
            inLanguage: loc,
            publisher: { "@id": `${site.url}/#organization` },
          },
          breadcrumbSchema([
            { name: "Byte & Brain", url: localizedUrl(loc, "/") },
            { name: t("eyebrow"), url: localizedUrl(loc, "/blog") },
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
          <div className="max-w-3xl">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {t("eyebrow")}
            </span>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            {/* Crawlable links to category hub pages (topical clusters). */}
            <div className="mt-8 flex flex-wrap gap-2">
              {categoriesForLocale(loc).map((c) => (
                <Link
                  key={c}
                  href={{
                    pathname: "/blog/category/[category]",
                    params: { category: c },
                  }}
                  className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                  {categoryLabels[c]}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">{t("empty")}</p>
          ) : (
            <BlogList
              posts={posts}
              allLabel={t("all")}
              categoryLabels={categoryLabels}
              readingLabel={t("readingTime")}
              locale={loc}
            />
          )}
        </div>
      </section>
    </>
  );
}

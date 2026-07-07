import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { compileMDX } from "next-mdx-remote/rsc";
import { ChevronRight, ArrowLeft, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getPost, allPostParams } from "@/lib/blog";
import { localizedUrl, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";
import { mdxComponents } from "@/components/mdx-components";
import { CtaBanner } from "@/components/sections/cta";

export function generateStaticParams() {
  return allPostParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug, locale as Locale);
  if (!post) return {};
  const url = localizedUrl(locale as Locale, {
    pathname: "/blog/[slug]",
    params: { slug },
  });
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: site.name,
      locale,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const post = getPost(slug, loc);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  });

  const url = localizedUrl(loc, { pathname: "/blog/[slug]", params: { slug } });
  const dateLabel = new Intl.DateTimeFormat(loc, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(post.date));

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "@id": `${url}#article`,
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            inLanguage: loc,
            mainEntityOfPage: url,
            author: {
              "@type": "Person",
              name: post.author,
              ...(post.authorRole ? { jobTitle: post.authorRole } : {}),
              url: localizedUrl(loc, "/about"),
              sameAs: [site.social.linkedin],
            },
            publisher: { "@id": `${site.url}/#organization` },
          },
          breadcrumbSchema([
            { name: "Byte & Brain", url: localizedUrl(loc, "/") },
            { name: t("eyebrow"), url: localizedUrl(loc, "/blog") },
            { name: post.title, url },
          ]),
        ]}
      />

      <article className="relative">
        <div className="bg-grid bg-grid-fade absolute inset-0 top-0 -z-10 h-80" aria-hidden />
        <div className="container-page py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            {/* Breadcrumbs */}
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
            </nav>

            <div className="mt-8 flex items-center gap-3 text-sm">
              <Link
                href={{
                  pathname: "/blog/category/[category]",
                  params: { category: post.category },
                }}
                className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary transition-colors hover:bg-primary/20"
              >
                {t(`categories.${post.category}`)}
              </Link>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Clock className="size-3.5" />
                {post.readingMinutes} {t("readingTime")}
              </span>
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-3 border-b border-border pb-8 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{post.author}</span>
              {post.authorRole && <span>· {post.authorRole}</span>}
              <span>·</span>
              <time dateTime={post.date}>{dateLabel}</time>
            </div>

            {/* MDX body */}
            <div className="mt-2">{content}</div>

            <div className="mt-14 border-t border-border pt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                {t("backToBlog")}
              </Link>
            </div>
          </div>
        </div>
      </article>

      <CtaBanner />
    </>
  );
}

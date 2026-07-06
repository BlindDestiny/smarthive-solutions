import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedUrl, breadcrumbSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

/** Shared renderer for Privacy / Terms (content from the `legal` namespace). */
export async function LegalPage({
  locale,
  doc,
  path,
}: {
  locale: Locale;
  doc: "privacy" | "terms";
  path: "/privacy" | "/terms";
}) {
  const t = await getTranslations({ locale, namespace: "legal" });
  const tp = await getTranslations({ locale, namespace: "servicePage" });
  const sections = t.raw(`${doc}.sections`) as { h: string; p: string }[];

  const updatedLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(site.legalUpdated));

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: tp("breadcrumbHome"), url: localizedUrl(locale, "/") },
          { name: t(`${doc}.title`), url: localizedUrl(locale, path) },
        ])}
      />
      <div className="container-page py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground">
              {tp("breadcrumbHome")}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">{t(`${doc}.title`)}</span>
          </nav>

          <h1 className="mt-8 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {t(`${doc}.title`)}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("updated")}: {updatedLabel}
          </p>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
            {t(`${doc}.intro`)}
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-lg font-semibold text-foreground">
                  {i + 1}. {s.h}
                </h2>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                  {s.p}
                </p>
              </section>
            ))}
          </div>

          <p className="mt-12 rounded-xl border border-border bg-background-subtle p-4 text-xs italic text-muted-foreground">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </>
  );
}

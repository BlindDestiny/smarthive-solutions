import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Mail, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { localizedUrl, localizedAlternates } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { ContactForm } from "@/components/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cta" });
  return {
    title: t("primary"),
    alternates: {
      canonical: localizedUrl(locale as Locale, "/contact"),
      languages: localizedAlternates("/contact"),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cta" });
  const tf = await getTranslations({ locale, namespace: "contactForm" });

  return (
    <div className="relative overflow-hidden">
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
      <div className="container-page py-24 sm:py-32">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("title")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              {t("subtitle")}
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{tf("emailLabel")}</p>
                  <p className="font-medium text-foreground">{site.email}</p>
                </div>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Clock className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("note")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}

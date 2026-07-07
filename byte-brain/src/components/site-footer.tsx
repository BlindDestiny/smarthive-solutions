import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { services, getServiceContent, slugFor } from "@/content/services";
import { Logo } from "@/components/brand/logo";
import {
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/brand/social-icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { site } from "@/lib/site";

const linkCls =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";

function anchorHref(locale: Locale, hash: string) {
  return locale === "pt" ? `/#${hash}` : `/${locale}#${hash}`;
}

export function SiteFooter() {
  const t = useTranslations("footer");
  const locale = useLocale() as Locale;
  const year = 2026;

  const serviceLinks = services.slice(0, 5);

  return (
    <footer className="relative border-t border-border bg-background-subtle">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {t("tagline")}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={site.social.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <LinkedInIcon />
              </a>
              <a
                href={site.social.instagram}
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <InstagramIcon />
              </a>
              <a
                href={site.social.facebook}
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <FacebookIcon />
              </a>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <NewsletterForm />
            </div>
          </div>

          <FooterColumn title={t("columns.services")}>
            {serviceLinks.map((s) => (
              <li key={s.slug}>
                <Link
                  href={{
                    pathname: "/services/[slug]",
                    params: { slug: slugFor(s.slug, locale) },
                  }}
                  className={linkCls}
                >
                  {getServiceContent(s, locale).eyebrow}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title={t("columns.company")}>
            <li>
              <Link href="/about" className={linkCls}>
                {t("links.about")}
              </Link>
            </li>
            <li>
              <a href={anchorHref(locale, "process")} className={linkCls}>
                {t("links.process")}
              </a>
            </li>
            <li>
              <a href={anchorHref(locale, "cases")} className={linkCls}>
                {t("links.cases")}
              </a>
            </li>
            <li>
              <Link href="/contact" className={linkCls}>
                {t("links.contact")}
              </Link>
            </li>
          </FooterColumn>

          <FooterColumn title={t("columns.resources")}>
            <li>
              <Link href="/blog" className={linkCls}>
                {t("links.blog")}
              </Link>
            </li>
            <li>
              <a href={anchorHref(locale, "faq")} className={linkCls}>
                {t("links.faq")}
              </a>
            </li>
            <li>
              <Link href="/privacy" className={linkCls}>
                {t("links.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className={linkCls}>
                {t("links.terms")}
              </Link>
            </li>
          </FooterColumn>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. {t("rights")}
          </p>
          <p className="font-mono text-xs uppercase tracking-wider">
            {t("slogan")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">{children}</ul>
    </div>
  );
}

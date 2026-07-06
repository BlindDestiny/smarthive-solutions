"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { mainNav } from "@/lib/site";
import type { Locale } from "@/i18n/routing";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { cn } from "@/lib/utils";

/** Locale-prefixed link to a homepage section (works from any page). */
function anchorHref(locale: Locale, hash: string) {
  return locale === "pt" ? `/#${hash}` : `/${locale}#${hash}`;
}

export function SiteHeader() {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Byte & Brain — início" className="shrink-0">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const cls =
              "rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
            return item.type === "page" ? (
              <Link key={item.key} href={item.href} className={cls}>
                {t(item.key)}
              </Link>
            ) : (
              <a key={item.key} href={anchorHref(locale, item.hash)} className={cls}>
                {t(item.key)}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <Link
            href="/contact"
            className="hidden h-10 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_var(--glow)] transition-all hover:-translate-y-px hover:brightness-110 sm:inline-flex"
          >
            {t("cta")}
            <ArrowRight className="size-4" />
          </Link>

          {/* Mobile trigger */}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-6">
            {mainNav.map((item) => {
              const cls =
                "rounded-lg px-3 py-3 text-lg font-medium text-foreground transition-colors hover:bg-background-muted";
              return item.type === "page" ? (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cls}
                >
                  {t(item.key)}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={anchorHref(locale, item.hash)}
                  onClick={() => setMenuOpen(false)}
                  className={cls}
                >
                  {t(item.key)}
                </a>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-base font-semibold text-primary-foreground"
            >
              {t("cta")}
              <ArrowRight className="size-4" />
            </Link>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

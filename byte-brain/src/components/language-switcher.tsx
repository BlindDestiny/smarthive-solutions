"use client";

import { useLocale } from "next-intl";
import { useState } from "react";
import { Check } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { canonicalFromLocalizedSlug, slugFor } from "@/content/services";
import { Flag } from "@/components/brand/flags";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
  fr: "Français",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Switching locale must remap the localized service slug to the target locale
  // (e.g. /servicos/desenvolvimento-web → /services/website-development).
  function switchTo(target: Locale) {
    const service = pathname.match(/^\/services\/([^/]+)$/);
    if (service) {
      const canonical = canonicalFromLocalizedSlug(service[1], locale);
      if (canonical) {
        router.replace(
          { pathname: "/services/[slug]", params: { slug: slugFor(canonical, target) } },
          { locale: target },
        );
        setOpen(false);
        return;
      }
    }
    const blog = pathname.match(/^\/blog\/([^/]+)$/);
    if (blog) {
      router.replace(
        { pathname: "/blog/[slug]", params: { slug: blog[1] } },
        { locale: target },
      );
      setOpen(false);
      return;
    }
    // Static routes: pathname is already a known key.
    router.replace(pathname as "/", { locale: target });
    setOpen(false);
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Mudar idioma"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-background-muted hover:text-foreground"
      >
        <Flag locale={locale} />
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <ul className="absolute right-0 top-12 z-50 min-w-[160px] overflow-hidden rounded-xl border border-border bg-card p-1 shadow-elevated">
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                onClick={() => switchTo(l)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-background-muted",
                  l === locale ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <Flag locale={l} />
                <span className="flex-1 text-left">{labels[l]}</span>
                {l === locale && <Check className="size-4 text-primary" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

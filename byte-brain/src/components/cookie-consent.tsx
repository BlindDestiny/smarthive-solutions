"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Cookie } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export const CONSENT_KEY = "bb-cookie-consent";
export const CONSENT_EVENT = "bb-consent-changed";

const copy: Record<
  Locale,
  { text: string; accept: string; reject: string; privacy: string }
> = {
  pt: {
    text: "Usamos cookies para melhorar a sua experiência e analisar o tráfego.",
    accept: "Aceitar",
    reject: "Recusar",
    privacy: "Política de Privacidade",
  },
  en: {
    text: "We use cookies to improve your experience and analyze traffic.",
    accept: "Accept",
    reject: "Decline",
    privacy: "Privacy Policy",
  },
  es: {
    text: "Usamos cookies para mejorar tu experiencia y analizar el tráfico.",
    accept: "Aceptar",
    reject: "Rechazar",
    privacy: "Política de Privacidad",
  },
  fr: {
    text: "Nous utilisons des cookies pour améliorer votre expérience et analyser le trafic.",
    accept: "Accepter",
    reject: "Refuser",
    privacy: "Politique de confidentialité",
  },
};

export function CookieConsent() {
  const locale = useLocale() as Locale;
  const t = copy[locale] ?? copy.pt;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {}
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookies"
      className="animate-fade-up fixed inset-x-3 bottom-4 z-[70] mx-auto max-w-2xl rounded-2xl border border-border bg-card p-5 shadow-elevated sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Cookie className="size-5" />
        </span>
        <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
          {t.text}{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {t.privacy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-background-muted hover:text-foreground sm:flex-none"
          >
            {t.reject}
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 sm:flex-none"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

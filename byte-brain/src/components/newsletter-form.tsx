"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import type { Locale } from "@/i18n/routing";

type Status = "idle" | "sending" | "ok" | "error";

const copy: Record<
  Locale,
  {
    title: string;
    text: string;
    placeholder: string;
    button: string;
    success: string;
    error: string;
  }
> = {
  pt: {
    title: "Newsletter",
    text: "Ideias práticas de crescimento digital, sem spam.",
    placeholder: "O seu email",
    button: "Subscrever",
    success: "Subscrito! Obrigado.",
    error: "Algo correu mal. Tente novamente.",
  },
  en: {
    title: "Newsletter",
    text: "Practical digital growth ideas, no spam.",
    placeholder: "Your email",
    button: "Subscribe",
    success: "Subscribed! Thank you.",
    error: "Something went wrong. Please try again.",
  },
  es: {
    title: "Newsletter",
    text: "Ideas prácticas de crecimiento digital, sin spam.",
    placeholder: "Tu email",
    button: "Suscribirse",
    success: "¡Suscrito! Gracias.",
    error: "Algo salió mal. Inténtalo de nuevo.",
  },
  fr: {
    title: "Newsletter",
    text: "Des idées concrètes de croissance digitale, sans spam.",
    placeholder: "Votre email",
    button: "S'abonner",
    success: "Inscrit ! Merci.",
    error: "Une erreur est survenue. Réessayez.",
  },
};

export function NewsletterForm() {
  const locale = useLocale() as Locale;
  const t = copy[locale] ?? copy.pt;
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
        {t.title}
      </h3>
      <p className="mt-4 text-sm text-muted-foreground">{t.text}</p>

      {status === "ok" ? (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-success">
          <Check className="size-4" />
          {t.success}
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4">
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="hidden"
          />
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              required
              placeholder={t.placeholder}
              aria-label={t.placeholder}
              className="h-10 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              aria-label={t.button}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:brightness-110 disabled:opacity-70"
            >
              {status === "sending" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
            </button>
          </div>
          {status === "error" && (
            <p className="mt-2 text-xs text-red-500">{t.error}</p>
          )}
        </form>
      )}
    </div>
  );
}

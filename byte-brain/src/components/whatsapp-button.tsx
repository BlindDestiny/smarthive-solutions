"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { X } from "lucide-react";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

const copy: Record<Locale, { bubble: string; aria: string; prefill: string }> = {
  pt: {
    bubble: "Olá! 👋 Fala connosco pelo WhatsApp",
    aria: "Falar connosco pelo WhatsApp",
    prefill: "Olá! Vim do site da Byte & Brain e gostava de saber mais.",
  },
  en: {
    bubble: "Hi! 👋 Chat with us on WhatsApp",
    aria: "Chat with us on WhatsApp",
    prefill: "Hi! I came from the Byte & Brain website and would like to know more.",
  },
  es: {
    bubble: "¡Hola! 👋 Habla con nosotros por WhatsApp",
    aria: "Hablar con nosotros por WhatsApp",
    prefill: "¡Hola! Vengo de la web de Byte & Brain y me gustaría saber más.",
  },
  fr: {
    bubble: "Bonjour ! 👋 Discutez avec nous sur WhatsApp",
    aria: "Discuter avec nous sur WhatsApp",
    prefill: "Bonjour ! Je viens du site de Byte & Brain et j'aimerais en savoir plus.",
  },
};

const STORAGE_KEY = "bb-wa-dismissed";

export function WhatsAppButton() {
  const locale = useLocale() as Locale;
  const t = copy[locale] ?? copy.pt;
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setShowBubble(true), 2600);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setShowBubble(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(t.prefill)}`;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {showBubble && (
        <div className="animate-fade-up flex max-w-[16rem] items-start gap-2 rounded-2xl rounded-br-sm border border-border bg-card px-4 py-3 shadow-elevated">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {t.bubble}
          </a>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Fechar"
            className="-mr-1 -mt-1 shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.aria}
        onClick={dismiss}
        className="group relative inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_30px_-6px_rgba(37,211,102,0.5)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-20 [animation-duration:2.5s]" />
        <svg viewBox="0 0 24 24" className="relative size-7 fill-white" aria-hidden>
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.42 9.42 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.44 9.44 0 0 1-1.44-5.02c0-5.21 4.24-9.45 9.46-9.45 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.68c-.01 5.22-4.25 9.45-9.46 9.45zm8.05-17.5A11.36 11.36 0 0 0 12.04.5C5.79.5.7 5.59.7 11.84c0 2 .52 3.95 1.52 5.67L.6 23.5l6.13-1.61a11.3 11.3 0 0 0 5.4 1.38h.01c6.25 0 11.34-5.09 11.34-11.34 0-3.03-1.18-5.88-3.32-8.02z" />
        </svg>
      </a>
    </div>
  );
}

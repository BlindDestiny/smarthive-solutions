import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Compact rounded SVG flags — reliable cross-platform (emoji flags don't render on Windows). */

function FlagPT({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={cn("h-4 w-6 rounded-[3px]", className)} aria-hidden>
      <clipPath id="flag-pt-clip">
        <rect width="24" height="16" rx="2.5" />
      </clipPath>
      <g clipPath="url(#flag-pt-clip)">
        <rect width="24" height="16" fill="#da291c" />
        <rect width="9.6" height="16" fill="#046a38" />
        <circle cx="9.6" cy="8" r="3" fill="#ffe000" stroke="#046a38" strokeWidth="0.7" />
        <circle cx="9.6" cy="8" r="1.5" fill="#fff" stroke="#da291c" strokeWidth="0.7" />
      </g>
    </svg>
  );
}

function FlagGB({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={cn("h-4 w-6 rounded-[3px]", className)} aria-hidden>
      <clipPath id="flag-gb-clip">
        <rect width="24" height="16" rx="2.5" />
      </clipPath>
      <g clipPath="url(#flag-gb-clip)">
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#fff" strokeWidth="3.2" />
        <path d="M0 0 24 16M24 0 0 16" stroke="#c8102e" strokeWidth="1.6" />
        <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="5.3" />
        <path d="M12 0V16M0 8H24" stroke="#c8102e" strokeWidth="3.2" />
      </g>
    </svg>
  );
}

function FlagES({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={cn("h-4 w-6 rounded-[3px]", className)} aria-hidden>
      <clipPath id="flag-es-clip">
        <rect width="24" height="16" rx="2.5" />
      </clipPath>
      <g clipPath="url(#flag-es-clip)">
        <rect width="24" height="16" fill="#c60b1e" />
        <rect y="4" width="24" height="8" fill="#ffc400" />
      </g>
    </svg>
  );
}

function FlagFR({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 16" className={cn("h-4 w-6 rounded-[3px]", className)} aria-hidden>
      <clipPath id="flag-fr-clip">
        <rect width="24" height="16" rx="2.5" />
      </clipPath>
      <g clipPath="url(#flag-fr-clip)">
        <rect width="24" height="16" fill="#fff" />
        <rect width="8" height="16" fill="#0055a4" />
        <rect x="16" width="8" height="16" fill="#ef4135" />
      </g>
    </svg>
  );
}

const flags: Record<Locale, (p: { className?: string }) => React.ReactElement> = {
  pt: FlagPT,
  en: FlagGB,
  es: FlagES,
  fr: FlagFR,
};

export function Flag({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const Component = flags[locale];
  return <Component className={className} />;
}

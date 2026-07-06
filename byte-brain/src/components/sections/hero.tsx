import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "@/i18n/navigation";
import { HeroMockup } from "./hero-mockup";

// Small helper to express the staggered load delay as a CSS variable.
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

export function Hero() {
  const t = useTranslations("hero");
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section className="relative overflow-hidden">
      {/* atmosphere */}
      <div className="bg-grid bg-grid-fade absolute inset-0 -z-10" aria-hidden />
      <div
        className="glow-brand absolute left-1/2 top-[-10%] -z-10 h-[520px] w-[820px] -translate-x-1/2"
        aria-hidden
      />

      <div className="container-page pb-20 pt-16 sm:pt-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span
            className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur"
            style={delay(0)}
          >
            <Sparkles className="size-3.5 text-primary" />
            {t("badge")}
          </span>

          <h1
            className="animate-rise mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-[4.25rem]"
            style={delay(40)}
          >
            <span className="text-gradient">{t("title")}</span>
            <br />
            <span className="text-gradient-brand">{t("titleAccent")}</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
            style={delay(150)}
          >
            {t("subtitle")}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-col items-center gap-3 sm:flex-row"
            style={delay(230)}
          >
            <Link
              href="/contact"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-[0.95rem] font-semibold text-primary-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_12px_32px_-10px_var(--glow)] transition-all hover:-translate-y-0.5 hover:brightness-110"
            >
              {t("ctaPrimary")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#process"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border-strong bg-card/60 px-6 text-[0.95rem] font-semibold text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-background-muted"
            >
              {t("ctaSecondary")}
            </a>
          </div>
        </div>

        {/* product visual */}
        <div
          className="animate-fade-up mx-auto mt-16 max-w-4xl"
          style={delay(330)}
        >
          <HeroMockup />
        </div>

        {/* stats */}
        <dl
          className="animate-fade-up mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3"
          style={delay(430)}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col-reverse items-center gap-1 bg-background px-6 py-8 text-center"
            >
              <dt className="text-sm text-muted-foreground">{s.label}</dt>
              <dd className="text-3xl font-semibold tracking-tight text-foreground">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>

        <p
          className="animate-fade-up mt-8 text-center font-mono text-xs uppercase tracking-wider text-muted-foreground"
          style={delay(510)}
        >
          {t("trustedBy")}
        </p>
      </div>
    </section>
  );
}

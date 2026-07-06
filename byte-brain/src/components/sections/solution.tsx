import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Section, Eyebrow } from "./section-shell";
import { Reveal } from "@/components/motion/reveal";

export function Solution() {
  const t = useTranslations("solution");
  const points = t.raw("points") as { title: string; desc: string }[];

  return (
    <Section id="solution" className="relative overflow-hidden">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* Left: heading */}
        <Reveal className="flex flex-col gap-5">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
            {t("title")}
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>

          {/* Concept diagram */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Website", "SEO", "AI", "Automation", "Analytics"].map((n) => (
              <span
                key={n}
                className="rounded-lg border border-border bg-card px-3 py-1.5 font-mono text-xs text-muted-foreground"
              >
                {n}
              </span>
            ))}
            <span className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-xs font-medium text-primary">
              = 1 System
            </span>
          </div>
        </Reveal>

        {/* Right: point cards */}
        <div className="grid gap-4">
          {points.map((p, i) => (
            <Reveal key={p.title} index={i}>
              <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-border-strong">
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Check className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

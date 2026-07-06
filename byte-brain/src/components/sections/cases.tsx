import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "./section-shell";
import { Reveal } from "@/components/motion/reveal";

export function Cases() {
  const t = useTranslations("cases");
  const items = t.raw("items") as {
    client: string;
    sector: string;
    metric: string;
    metricLabel: string;
    desc: string;
  }[];

  return (
    <Section id="cases" className="border-t border-border bg-background-subtle">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-16 grid gap-5 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.client} index={i}>
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elevated">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.sector}
                </span>
                <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              <p className="mt-8 text-5xl font-semibold tracking-tight text-gradient-brand">
                {item.metric}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {item.metricLabel}
              </p>

              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-base font-semibold text-foreground">
                  {item.client}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

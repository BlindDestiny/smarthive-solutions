import { useTranslations } from "next-intl";
import { ShieldCheck, Gauge, KeyRound, Eye } from "lucide-react";
import { Section, SectionHeading } from "./section-shell";
import { Reveal } from "@/components/motion/reveal";

const icons = [ShieldCheck, Gauge, KeyRound, Eye];

export function Cases() {
  const t = useTranslations("cases");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <Section id="cases" className="border-t border-border bg-background-subtle">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = icons[i] ?? ShieldCheck;
          return (
            <Reveal key={item.title} index={i}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-border-strong">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

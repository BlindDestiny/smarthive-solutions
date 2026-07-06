import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "./section-shell";
import { Reveal } from "@/components/motion/reveal";

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as { n: string; title: string; desc: string }[];

  return (
    <Section id="process">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="relative mt-16">
        {/* connecting line (desktop) */}
        <div
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block"
          aria-hidden
        />
        <ol className="grid gap-8 lg:grid-cols-4 lg:gap-6">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.n} index={i} className="relative">
              <span className="relative z-10 inline-flex size-14 items-center justify-center rounded-2xl border border-border bg-card font-mono text-sm font-semibold text-primary shadow-sm">
                {step.n}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

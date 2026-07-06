import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "./section-shell";
import { Reveal } from "@/components/motion/reveal";

export function Tech() {
  const t = useTranslations("tech");
  const stack = t.raw("stack") as string[];
  // Double the list for a seamless marquee loop.
  const loop = [...stack, ...stack];

  return (
    <Section id="tech">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <Reveal className="relative mt-16 overflow-hidden">
        {/* edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-marquee gap-4">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-5 py-3 text-sm font-medium text-foreground"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              {name}
            </span>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

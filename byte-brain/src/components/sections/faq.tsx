import { useTranslations } from "next-intl";
import { Section, SectionHeading } from "./section-shell";

export function Faq() {
  const t = useTranslations("faq");
  const items = t.raw("items") as { q: string; a: string }[];

  return (
    <Section id="faq" className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
          align="left"
          className="lg:sticky lg:top-24 lg:self-start"
        />

        {/* Native <details> — accessible, open-by-default first item, zero JS. */}
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item, i) => (
            <li key={item.q}>
              <details className="group py-5" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                  <span className="text-base font-medium text-foreground">
                    {item.q}
                  </span>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border text-lg leading-none text-muted-foreground transition-transform duration-300 group-open:rotate-45 group-open:border-primary/40 group-open:text-primary">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

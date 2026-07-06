import { useLocale, useTranslations } from "next-intl";
import {
  Code2,
  Search,
  Sparkles,
  MapPin,
  Workflow,
  BrainCircuit,
  BarChart3,
  ShieldCheck,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { slugFor } from "@/content/services";
import type { Locale } from "@/i18n/routing";
import { Section, SectionHeading } from "./section-shell";
import { Reveal } from "@/components/motion/reveal";

const meta = [
  { icon: Code2, slug: "website-development" },
  { icon: Search, slug: "seo" },
  { icon: Sparkles, slug: "ai-seo" },
  { icon: MapPin, slug: "local-seo" },
  { icon: Workflow, slug: "automation" },
  { icon: BrainCircuit, slug: "artificial-intelligence" },
  { icon: BarChart3, slug: "analytics" },
  { icon: ShieldCheck, slug: "maintenance" },
  { icon: Compass, slug: "consulting" },
];

export function Services() {
  const t = useTranslations("services");
  const locale = useLocale() as Locale;
  const items = t.raw("items") as { name: string; tag: string; desc: string }[];

  return (
    <Section id="services" className="border-t border-border bg-background-subtle">
      <SectionHeading
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => {
          const { icon: Icon, slug } = meta[i] ?? meta[0];
          return (
            <Reveal key={item.name} index={i % 3}>
              <Link
                href={{
                  pathname: "/services/[slug]",
                  params: { slug: slugFor(slug, locale) },
                }}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated"
              >
                <div className="flex items-start justify-between">
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                    <Icon className="size-5" />
                  </span>
                  <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.tag}
                  </span>
                </div>

                <h3 className="mt-5 flex items-center gap-1.5 text-lg font-semibold text-foreground">
                  {item.name}
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>

                <span className="mt-5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {t("learnMore")} →
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

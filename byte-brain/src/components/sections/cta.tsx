import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/motion/reveal";

export function CtaBanner() {
  const t = useTranslations("cta");

  return (
    <section className="py-24 sm:py-28">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-[#0b1120] px-6 py-16 text-center sm:px-16 sm:py-20">
            {/* atmosphere on the dark panel */}
            <div className="bg-grid absolute inset-0 opacity-40" aria-hidden />
            <div
              className="glow-brand absolute left-1/2 top-0 h-[360px] w-[600px] -translate-x-1/2"
              style={{ "--glow": "rgba(56,189,248,0.22)" } as React.CSSProperties}
              aria-hidden
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">
                {t("title")}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-slate-300">
                {t("subtitle")}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-7 text-[0.95rem] font-semibold text-slate-900 transition-all hover:-translate-y-0.5"
                >
                  {t("primary")}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 text-[0.95rem] font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/10"
                >
                  {t("secondary")}
                </Link>
              </div>

              <p className="mt-6 font-mono text-xs uppercase tracking-wider text-slate-400">
                {t("note")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

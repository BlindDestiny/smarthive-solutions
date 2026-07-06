import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { faqSchema, professionalServiceSchema } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Cases } from "@/components/sections/cases";
import { Tech } from "@/components/sections/tech";
import { Faq } from "@/components/sections/faq";
import { CtaBanner } from "@/components/sections/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "faq" });
  const faqItems = t.raw("items") as { q: string; a: string }[];

  return (
    <>
      <JsonLd
        data={[
          professionalServiceSchema(locale as Locale),
          faqSchema(faqItems),
        ]}
      />
      <Hero />
      <Problem />
      <Solution />
      <Services />
      <Process />
      <Cases />
      <Tech />
      <Faq />
      <CtaBanner />
    </>
  );
}

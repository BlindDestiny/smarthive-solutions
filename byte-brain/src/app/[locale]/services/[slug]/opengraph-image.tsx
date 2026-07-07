import { routing, type Locale } from "@/i18n/routing";
import {
  getService,
  getServiceContent,
  canonicalFromLocalizedSlug,
  localizedServiceParams,
} from "@/content/services";
import { renderOgImage, OG_SIZE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Byte & Brain";

export function generateStaticParams() {
  return localizedServiceParams(routing.locales);
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = locale as Locale;
  const canonical = canonicalFromLocalizedSlug(slug, loc);
  const service = canonical ? getService(canonical) : undefined;
  const c = service ? getServiceContent(service, loc) : undefined;
  return renderOgImage({
    eyebrow: c?.eyebrow ?? "Byte & Brain",
    title: c?.title ?? "Byte & Brain",
  });
}

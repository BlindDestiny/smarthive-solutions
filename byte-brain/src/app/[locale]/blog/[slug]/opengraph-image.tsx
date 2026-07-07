import { getPost, allPostParams } from "@/lib/blog";
import type { Locale } from "@/i18n/routing";
import { renderOgImage, OG_SIZE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Byte & Brain";

export function generateStaticParams() {
  return allPostParams();
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = getPost(slug, locale as Locale);
  return renderOgImage({
    eyebrow: "Blog",
    title: post?.title ?? "Byte & Brain",
  });
}

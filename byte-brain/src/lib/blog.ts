import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { locales, type Locale } from "@/i18n/routing";

export type BlogCategory =
  | "seo"
  | "ai"
  | "automation"
  | "digital-growth"
  | "web-development"
  | "business";

export type PostMeta = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  date: string; // ISO YYYY-MM-DD
  category: BlogCategory;
  author: string;
  authorRole?: string;
  readingMinutes: number;
};

export type Post = PostMeta & { content: string };

const BLOG_DIR = join(process.cwd(), "src", "content", "blog");

function readingMinutes(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function parseFile(file: string): Post | null {
  const raw = readFileSync(join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (!data.title || !data.date) return null;
  return {
    slug: file.replace(/\.mdx?$/, ""),
    locale: (data.locale as Locale) ?? "pt",
    title: data.title,
    description: data.description ?? "",
    date: String(data.date),
    category: (data.category as BlogCategory) ?? "digital-growth",
    author: data.author ?? "Byte & Brain",
    authorRole: data.authorRole,
    readingMinutes: readingMinutes(content),
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!existsSync(BLOG_DIR)) return [];
  return readdirSync(BLOG_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseFile)
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Posts for a locale, falling back to PT if a locale has none yet. */
export function getPostsForLocale(locale: Locale): Post[] {
  const all = getAllPosts();
  const forLocale = all.filter((p) => p.locale === locale);
  return forLocale.length > 0 ? forLocale : all.filter((p) => p.locale === "pt");
}

export function getPost(slug: string, locale: Locale): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug && p.locale === locale);
}

/** { locale, slug } pairs for generateStaticParams. */
export function allPostParams() {
  return getAllPosts().map((p) => ({ locale: p.locale, slug: p.slug }));
}

/** Categories that actually have at least one post in the given locale. */
export function categoriesForLocale(locale: Locale): BlogCategory[] {
  const present = new Set(getPostsForLocale(locale).map((p) => p.category));
  return [...present];
}

export function postsByCategory(
  locale: Locale,
  category: BlogCategory,
): Post[] {
  return getPostsForLocale(locale).filter((p) => p.category === category);
}

/** { locale, category } pairs for generateStaticParams across all locales. */
export function allCategoryParams() {
  return locales.flatMap((locale) =>
    categoriesForLocale(locale).map((category) => ({ locale, category })),
  );
}

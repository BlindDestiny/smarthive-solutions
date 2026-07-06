"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { PostMeta, BlogCategory } from "@/lib/blog";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Props = {
  posts: PostMeta[];
  allLabel: string;
  categoryLabels: Record<string, string>;
  readingLabel: string;
  locale: string;
};

export function BlogList({
  posts,
  allLabel,
  categoryLabels,
  readingLabel,
  locale,
}: Props) {
  const [active, setActive] = useState<BlogCategory | "all">("all");

  // Only show category chips that actually have posts.
  const categories = useMemo(() => {
    const present = new Set(posts.map((p) => p.category));
    return (Object.keys(categoryLabels) as BlogCategory[]).filter((c) =>
      present.has(c),
    );
  }, [posts, categoryLabels]);

  const filtered =
    active === "all" ? posts : posts.filter((p) => p.category === active);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Chip active={active === "all"} onClick={() => setActive("all")}>
          {allLabel}
        </Chip>
        {categories.map((c) => (
          <Chip key={c} active={active === c} onClick={() => setActive(c)}>
            {categoryLabels[c]}
          </Chip>
        ))}
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post, i) => (
          <Reveal key={post.slug} index={i % 3}>
            <Link
              href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-border-strong hover:shadow-elevated"
            >
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
                  {categoryLabels[post.category]}
                </span>
                <span className="text-muted-foreground">
                  {post.readingMinutes} {readingLabel}
                </span>
              </div>
              <h2 className="mt-4 flex items-start gap-1.5 text-lg font-semibold leading-snug text-foreground">
                {post.title}
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>
              <time
                dateTime={post.date}
                className="mt-5 text-xs font-medium text-muted-foreground"
              >
                {new Intl.DateTimeFormat(locale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                }).format(new Date(post.date))}
              </time>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

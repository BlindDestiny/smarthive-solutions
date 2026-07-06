import type { ComponentPropsWithoutRef } from "react";

/** Prose styling for MDX content — no typography plugin, full control. */
export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-8 text-xl font-semibold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-5 flex flex-col gap-2.5 text-[1.05rem] text-muted-foreground" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="mt-5 flex list-decimal flex-col gap-2.5 pl-5 text-[1.05rem] text-muted-foreground marker:text-primary"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="relative pl-6 leading-relaxed [ol_&]:pl-1" {...props}>
      <span className="absolute left-0 top-2.5 size-1.5 rounded-full bg-primary [ol_&]:hidden" />
      {props.children}
    </li>
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="font-medium text-primary underline-offset-4 hover:underline" {...props} />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="mt-6 border-l-2 border-primary pl-5 text-lg italic text-foreground"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded-md border border-border bg-background-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-border" />,
};

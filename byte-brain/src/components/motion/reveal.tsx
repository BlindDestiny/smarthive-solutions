import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Kept for API compatibility; scroll-driven CSS no longer needs a delay. */
  index?: number;
  as?: "div" | "li" | "span" | "section";
};

/**
 * Scroll-into-view reveal — pure CSS (scroll-driven animation, see `.reveal`
 * in globals.css). No JavaScript, no hydration cost. Degrades to visible on
 * browsers without scroll timelines and for reduced-motion users.
 */
export function Reveal({ children, className, as: Tag = "div" }: RevealProps) {
  return <Tag className={cn("reveal", className)}>{children}</Tag>;
}

import { ArrowUpRight, TrendingUp, Search, Bot, Zap } from "lucide-react";

/**
 * Abstract "Digital Growth System" dashboard — a stylised product visual.
 * Pure markup + SVG, no data. Adapts to both themes via tokens.
 */
export function HeroMockup() {
  return (
    <div className="relative">
      {/* glow behind the card */}
      <div className="glow-brand absolute inset-0 -z-10 scale-125 blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elevated ring-hairline">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <div className="ml-3 flex h-6 flex-1 items-center rounded-md bg-background-muted px-3 font-mono text-[11px] text-muted-foreground">
            growth.byteandbrain.pt
          </div>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-5">
          {/* Chart panel */}
          <div className="rounded-xl border border-border bg-background-subtle p-4 sm:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Organic growth
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">
                  +214%
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                <TrendingUp className="size-3.5" /> Trending
              </span>
            </div>
            <Sparkline />
          </div>

          {/* Metric stack */}
          <div className="flex flex-col gap-3 sm:col-span-2">
            <MiniStat
              icon={<Search className="size-4" />}
              label="SEO position"
              value="#2"
            />
            <MiniStat
              icon={<Bot className="size-4" />}
              label="AI citations"
              value="1.4k"
            />
            <MiniStat
              icon={<Zap className="size-4" />}
              label="Leads / mo"
              value="+38"
            />
          </div>

          {/* Pipeline row */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-background-subtle p-3 sm:col-span-5">
            {["Website", "SEO", "AI SEO", "Automation", "Analytics"].map(
              (node, i) => (
                <span key={node} className="flex items-center gap-2">
                  <span className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground">
                    {node}
                  </span>
                  {i < 4 && (
                    <ArrowUpRight className="size-3.5 rotate-45 text-primary" />
                  )}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* floating badge */}
      <div className="absolute -right-3 -top-3 hidden rounded-xl border border-border bg-card px-3 py-2 shadow-elevated sm:flex sm:items-center sm:gap-2">
        <span className="size-2 rounded-full bg-success" />
        <span className="font-mono text-[11px] text-muted-foreground">
          System live
        </span>
      </div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background-subtle p-3">
      <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="truncate font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Sparkline() {
  return (
    <svg
      viewBox="0 0 320 80"
      className="mt-4 h-20 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="spark-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <path
        d="M0 66 L40 60 L80 62 L120 48 L160 50 L200 34 L240 30 L280 16 L320 8"
        fill="none"
        stroke="url(#spark-line)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 66 L40 60 L80 62 L120 48 L160 50 L200 34 L240 30 L280 16 L320 8 L320 80 L0 80 Z"
        fill="url(#spark-fill)"
      />
    </svg>
  );
}

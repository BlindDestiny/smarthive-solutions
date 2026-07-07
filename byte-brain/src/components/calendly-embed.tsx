"use client";

import Script from "next/script";

/**
 * Calendly inline scheduling widget. Renders only when a URL is provided
 * (set NEXT_PUBLIC_CALENDLY_URL). Free Calendly tier is enough.
 */
export function CalendlyEmbed({ url }: { url: string }) {
  // Brand the widget + hide the cookie banner (we already have our own).
  const src = `${url}${url.includes("?") ? "&" : "?"}hide_gdpr_banner=1&primary_color=2563eb`;

  return (
    <>
      <div
        className="calendly-inline-widget overflow-hidden rounded-2xl border border-border bg-card"
        data-url={src}
        style={{ minWidth: "320px", height: "640px" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}

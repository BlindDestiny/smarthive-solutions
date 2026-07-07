import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared branded Open Graph card (title + eyebrow on the brand gradient). */
export function renderOgImage({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #020617 0%, #0b1220 100%)",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              height: "8px",
              width: "128px",
              borderRadius: "4px",
              background: "linear-gradient(90deg, #2563eb, #38bdf8)",
              marginBottom: "44px",
            }}
          />
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "6px",
              color: "#38bdf8",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: "66px",
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.1,
              marginTop: "28px",
              maxWidth: "960px",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "30px",
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          Byte
          <span style={{ color: "#64748b", margin: "0 10px" }}>&</span>
          <span style={{ color: "#38bdf8" }}>Brain</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}

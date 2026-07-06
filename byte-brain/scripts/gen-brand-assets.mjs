/**
 * Generates favicon/app icons + a social (OG) image from the logo.
 *   src/app/icon.png        (512×512 app icon → favicon)
 *   src/app/apple-icon.png  (180×180 Apple touch icon)
 *   public/brand/og.png     (1200×630 Open Graph / Twitter card)
 *
 * Run:  npm run gen-assets   (after prepare-logo has produced the marks)
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const brand = join(root, "public", "brand");
const appDir = join(root, "src", "app");

const markPath = join(brand, "logo-mark-dark.png");
const lockupPath = join(brand, "logo-dark.png");

if (!existsSync(markPath) || !existsSync(lockupPath)) {
  console.error("✗ Missing marks. Run `npm run prepare-logo` first.");
  process.exit(1);
}

const BG = "#0b1120";

/** Square app icon: brand-dark rounded background with the mark centered. */
async function makeIcon(size, out) {
  const pad = Math.round(size * 0.18);
  const inner = size - pad * 2;
  const radius = Math.round(size * 0.22);

  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/></svg>`,
  );
  const mark = await sharp(markPath)
    .resize({ width: inner, height: inner, fit: "inside" })
    .toBuffer();

  await sharp(bg)
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(join(appDir, out));
  console.log(`✓ ${out} (${size}×${size})`);
}

/** 1200×630 OG card: gradient background + glow + centered logo lockup. */
async function makeOg() {
  const W = 1200;
  const H = 630;
  const bg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#020617"/>
          <stop offset="1" stop-color="#0b1220"/>
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.12" r="0.6">
          <stop offset="0" stop-color="#2563eb" stop-opacity="0.38"/>
          <stop offset="1" stop-color="#2563eb" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#2563eb"/>
          <stop offset="1" stop-color="#38bdf8"/>
        </linearGradient>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="#94a3b8" stroke-opacity="0.06" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#bg)"/>
      <rect width="${W}" height="${H}" fill="url(#grid)"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
      <rect x="0" y="0" width="${W}" height="8" fill="url(#bar)"/>
    </svg>`,
  );

  const lockup = await sharp(lockupPath)
    .resize({ width: 820, fit: "inside" })
    .toBuffer();

  await sharp(bg)
    .composite([{ input: lockup, gravity: "center" }])
    .png()
    .toFile(join(brand, "og.png"));
  console.log("✓ og.png (1200×630)");
}

await makeIcon(512, "icon.png");
await makeIcon(180, "apple-icon.png");
await makeOg();
console.log("Done.");

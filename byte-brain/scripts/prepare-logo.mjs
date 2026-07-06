/**
 * Prepares the Byte & Brain logo lockups for the site:
 *  - keys out the solid background (white for light, black for dark) → transparent
 *  - trims the surrounding margin so the logo sits tightly in the header/footer
 *
 * Source files (put your exports here, keep the "-source" suffix):
 *   public/brand/logo-light-source.png   (logo on a light/white background)
 *   public/brand/logo-dark-source.png    (logo on a dark/black background)
 *
 * Run:  npm run prepare-logo
 * Output: public/brand/logo-light.png, public/brand/logo-dark.png
 */
import sharp from "sharp";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const brand = join(__dirname, "..", "public", "brand");

const jobs = [
  { src: "logo-light-source.png", out: "logo-light.png", mode: "light" },
  { src: "logo-dark-source.png", out: "logo-dark.png", mode: "dark" },
];

// Alpha ramp: fully transparent past `clear`, fully opaque before `keep`.
const RAMP = {
  light: { clear: 246, keep: 214 }, // remove near-white
  dark: { clear: 12, keep: 46 }, // remove near-black
};

function alphaFor(brightness, mode) {
  const { clear, keep } = RAMP[mode];
  if (mode === "light") {
    if (brightness >= clear) return 0;
    if (brightness <= keep) return 255;
    return Math.round(((clear - brightness) / (clear - keep)) * 255);
  }
  if (brightness <= clear) return 0;
  if (brightness >= keep) return 255;
  return Math.round(((brightness - clear) / (keep - clear)) * 255);
}

for (const job of jobs) {
  const srcPath = join(brand, job.src);
  if (!existsSync(srcPath)) {
    console.warn(`⚠ Skipping ${job.out} — source ${job.src} not found`);
    continue;
  }

  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const ch = info.channels;
  for (let i = 0; i < data.length; i += ch) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const a = alphaFor(brightness, job.mode);
    if (a < data[i + 3]) data[i + 3] = a;
  }

  const keyed = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: ch },
  })
    .png()
    .toBuffer();

  // Full lockup: trim fully-transparent margins + a little breathing room.
  const trimmed = await sharp(keyed)
    .trim({ threshold: 1 })
    .png()
    .toBuffer();
  const meta = await sharp(trimmed)
    .extend({
      top: 6,
      bottom: 6,
      left: 6,
      right: 6,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(join(brand, job.out));

  console.log(`✓ ${job.out} → ${meta.width}×${meta.height} (transparent, trimmed)`);

  // Mark only: the "B" symbol lives in the left ~26% of the lockup (before the
  // divider). Crop it out and trim so it can be used large in the header.
  const t = sharp(trimmed);
  const tMeta = await t.metadata();
  const markOut = job.out.replace("logo-", "logo-mark-");
  const markMeta = await sharp(trimmed)
    .extract({
      left: 0,
      top: 0,
      width: Math.round(tMeta.width * 0.26),
      height: tMeta.height,
    })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(join(brand, markOut));
  console.log(`✓ ${markOut} → ${markMeta.width}×${markMeta.height} (mark only)`);
}

console.log("Done. Hard-refresh the site (Ctrl+Shift+R) to see the logo.");

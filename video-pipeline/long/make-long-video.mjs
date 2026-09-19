// Builds one long-form inspiration video from a theme file:
//   node video-pipeline/long/make-long-video.mjs video-pipeline/long/themes/<slug>.json
// Images come from video-pipeline/long/images/<slug>/<section dir>/ (drop
// Google Flow exports there, in any order/format), or from an explicit
// "images" list per section. Writes the MP4 and a ready-to-paste YouTube
// description (chapters + clickable "shop the look" links) to out/long/.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT_DIR, ARTICLES_DIR, SITE_DOMAIN } from "../config.mjs";
import { renderLongVideo, formatTimestamp } from "./render-long.mjs";

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const LONG_DIR = path.join(ROOT_DIR, "video-pipeline", "long");

function resolveSectionImages(theme, section) {
  if (section.images?.length) return section.images.map((p) => path.resolve(ROOT_DIR, p));
  const dir = path.join(LONG_DIR, "images", theme.slug, section.dir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f))
    .sort()
    .map((f) => path.join(dir, f));
}

function shopTheLook(slugs) {
  const blocks = [];
  for (const slug of slugs || []) {
    const file = path.join(ARTICLES_DIR, `${slug}.json`);
    if (!fs.existsSync(file)) continue;
    const a = JSON.parse(fs.readFileSync(file, "utf8"));
    const url = `${SITE_DOMAIN}/${a.category}/${a.slug}?utm_source=youtube&utm_medium=video_longue`;
    const products = (a.products || [])
      .filter((p) => p.affiliateUrl && /\d/.test(p.price || ""))
      .slice(0, 2)
      .map((p) => `   • ${p.name} (${p.price}) : ${p.affiliateUrl}`);
    blocks.push([`▶ ${a.title} : ${url}`, ...products].join("\n"));
  }
  return blocks.join("\n\n");
}

export function buildDescription(theme, chapters) {
  const lines = [
    theme.intro,
    "",
    "⏱ CHAPITRES",
    ...chapters.map((c) => `${formatTimestamp(c.time)} ${c.title}`),
  ];
  const shop = shopTheLook(theme.shop);
  if (shop) lines.push("", "🛒 RECRÉER CE STYLE CHEZ VOUS, NOS SÉLECTIONS :", "", shop);
  lines.push(
    "",
    `🏡 Toutes nos idées déco : ${SITE_DOMAIN}`,
    "",
    "Images d'inspiration générées par intelligence artificielle.",
    "Certains liens sont des liens d'affiliation Amazon : nous touchons une petite commission sur vos achats, sans surcoût pour vous. Les prix peuvent avoir changé depuis la publication.",
    "",
    (theme.hashtags || []).map((h) => `#${h}`).join(" ")
  );
  return lines.join("\n").slice(0, 5000);
}

async function main() {
  const themeFile = process.argv[2];
  if (!themeFile) {
    console.error("Usage : node video-pipeline/long/make-long-video.mjs <fichier-theme.json>");
    process.exit(1);
  }
  const theme = JSON.parse(fs.readFileSync(path.resolve(themeFile), "utf8"));

  const sections = theme.sections
    .map((s) => ({ ...s, images: resolveSectionImages(theme, s) }))
    .filter((s) => s.images.length);
  const missing = theme.sections.filter((s) => !sections.find((x) => x.title === s.title));
  if (missing.length) console.warn(`Sections sans image, ignorées : ${missing.map((s) => s.title).join(", ")}`);
  if (sections.length < 3) {
    console.error("Il faut au moins 3 sections avec des images (YouTube exige 3 chapitres minimum).");
    process.exit(1);
  }

  const outDir = path.join(ROOT_DIR, "video-pipeline", "out", "long");
  const outPath = path.join(outDir, `${theme.slug}.mp4`);
  const tmpDir = path.join(ROOT_DIR, "video-pipeline", "tmp", `long-${theme.slug}`);
  fs.rmSync(tmpDir, { recursive: true, force: true });

  const imageCount = sections.reduce((n, s) => n + s.images.length, 0);
  console.log(`${sections.length} sections, ${imageCount} images → ${outPath}`);
  const { duration, chapters, withMusic } = await renderLongVideo({ theme: { ...theme, sections }, outPath, tmpDir });

  const description = buildDescription(theme, chapters);
  fs.writeFileSync(path.join(outDir, `${theme.slug}.description.txt`), `${theme.title}\n\n${description}\n`);
  console.log(`Vidéo : ${formatTimestamp(duration)} ${withMusic ? "avec musique" : "SANS musique (ajoutez des pistes dans video-pipeline/assets/music/)"}`);
  console.log(`Description : ${path.join(outDir, `${theme.slug}.description.txt`)}`);
  if (process.env.KEEP_TMP !== "1") fs.rmSync(tmpDir, { recursive: true, force: true });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

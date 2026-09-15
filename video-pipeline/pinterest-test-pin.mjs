// Renders one article's video and publishes it as a Pinterest Pin, without
// touching YouTube or state.json — for testing and the Standard-access demo.
// Usage: node video-pipeline/pinterest-test-pin.mjs <article-slug>
import fs from "node:fs";
import path from "node:path";
import { loadArticleBySlug } from "./select-article.mjs";
import { buildScript } from "./build-script.mjs";
import { synthesizeLines } from "./tts.mjs";
import { renderVideo } from "./render.mjs";
import { uploadToPinterest } from "./pinterest-upload.mjs";
import { TMP_DIR, OUT_DIR } from "./config.mjs";

const slug = process.argv[2];
const picked = slug && loadArticleBySlug(slug);
if (!picked) {
  console.error(`Article "${slug}" introuvable ou sans produit avec prix.`);
  process.exit(1);
}

const tmp = path.join(TMP_DIR, `pinterest-${slug}`);
fs.mkdirSync(tmp, { recursive: true });
const outPath = path.join(OUT_DIR, `pinterest-${slug}.mp4`);

const lines = await synthesizeLines(buildScript(picked.article), tmp);
await renderVideo({ lines, article: picked.article, tmpDir: tmp, outPath });
console.log(`Vidéo rendue : ${outPath}`);

const pin = await uploadToPinterest({ videoPath: outPath, article: picked.article });
console.log(`Épingle créée : ${pin.pinId} -> ${pin.link}`);

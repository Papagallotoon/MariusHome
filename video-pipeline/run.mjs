import fs from "node:fs";
import path from "node:path";
import { selectNextArticle, markUsed } from "./select-article.mjs";
import { buildScript } from "./build-script.mjs";
import { synthesizeLines } from "./tts.mjs";
import { renderVideo } from "./render.mjs";
import { uploadVideo } from "./upload.mjs";
import { TMP_DIR, OUT_DIR } from "./config.mjs";

async function main() {
  const picked = selectNextArticle();
  if (!picked) {
    console.log("No unused article left in content/articles — nothing to do this run.");
    return;
  }
  const { slug, article } = picked;
  console.log(`Selected article: ${slug}`);

  const runTmpDir = path.join(TMP_DIR, slug);
  fs.rmSync(runTmpDir, { recursive: true, force: true });
  fs.mkdirSync(runTmpDir, { recursive: true });

  const scriptLines = buildScript(article);
  console.log(`Built script with ${scriptLines.length} lines`);

  const linesWithAudio = await synthesizeLines(scriptLines, runTmpDir);
  console.log("Voice-over generated for all lines");

  const outPath = path.join(OUT_DIR, `${slug}.mp4`);
  await renderVideo({ lines: linesWithAudio, article, tmpDir: runTmpDir, outPath });
  console.log(`Video rendered: ${outPath}`);

  if (process.env.SKIP_UPLOAD === "1") {
    console.log("SKIP_UPLOAD=1 set — skipping YouTube upload (local test run).");
  } else {
    const result = await uploadVideo({ videoPath: outPath, article });
    console.log(`Uploaded: https://youtube.com/watch?v=${result.id} (privacy: ${result.status?.privacyStatus})`);
  }

  markUsed(slug);
  console.log(`Marked "${slug}" as used.`);

  if (process.env.KEEP_TMP !== "1") {
    fs.rmSync(runTmpDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

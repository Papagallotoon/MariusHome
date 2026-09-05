import fs from "node:fs";
import path from "node:path";
import { selectNextArticle, loadArticleBySlug, markUsed } from "./select-article.mjs";
import { buildScript } from "./build-script.mjs";
import { synthesizeLines } from "./tts.mjs";
import { renderVideo } from "./render.mjs";
import { uploadVideo } from "./upload.mjs";
import { generateThemedImage } from "./generate-image.mjs";
import { TMP_DIR, OUT_DIR } from "./config.mjs";

async function main() {
  // FORCE_ARTICLE_SLUG lets you redo one specific video (e.g. after fixing
  // a bad product photo or swapping a discontinued item) instead of
  // advancing to the next unused article in the queue.
  const forcedSlug = process.env.FORCE_ARTICLE_SLUG;
  const picked = forcedSlug ? loadArticleBySlug(forcedSlug) : selectNextArticle();
  if (!picked) {
    console.log(
      forcedSlug
        ? `Article "${forcedSlug}" not found or has no product with a real price.`
        : "No unused article left in content/articles — nothing to do this run."
    );
    return;
  }
  const { slug, article } = picked;
  console.log(`Selected article: ${slug}`);

  const runTmpDir = path.join(TMP_DIR, slug);
  fs.rmSync(runTmpDir, { recursive: true, force: true });
  fs.mkdirSync(runTmpDir, { recursive: true });

  const introCoverPath = path.join(runTmpDir, "cover-intro.png");
  const outroCoverPath = path.join(runTmpDir, "cover-outro.png");
  const introGenerated = await generateThemedImage(article, "intro", introCoverPath);
  const outroGenerated = await generateThemedImage(article, "outro", outroCoverPath);
  console.log(
    introGenerated
      ? `Generated themed cover images with OpenAI (outro: ${outroGenerated ? "distinct" : "reused intro"})`
      : "OpenAI cover generation unavailable — falling back to the room-photo pool"
  );

  const scriptLines = buildScript(article, {
    coverImage: introGenerated ? introCoverPath : undefined,
    outroImage: outroGenerated ? outroCoverPath : undefined,
  });
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
  // Node's default console.error truncates nested objects (e.g. the actual
  // Google API error payload), which is exactly the part that matters.
  if (err?.response?.data) {
    console.error("API error response:", JSON.stringify(err.response.data, null, 2));
  }
  console.error(err);
  process.exit(1);
});

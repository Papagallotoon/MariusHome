import fs from "node:fs";
import path from "node:path";
import { ARTICLES_DIR, STATE_PATH } from "./config.mjs";

export function loadState() {
  if (!fs.existsSync(STATE_PATH)) return { usedSlugs: [] };
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
}

export function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

export function markUsed(slug) {
  const state = loadState();
  if (!state.usedSlugs.includes(slug)) state.usedSlugs.push(slug);
  saveState(state);
}

// Picks the next article that hasn't been turned into a video yet.
// Returns null once every article has been used at least once.
export function selectNextArticle() {
  const state = loadState();
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    if (state.usedSlugs.includes(slug)) continue;
    const article = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8"));
    // Many articles (the "ambiance" mood-board ones, buying guides, etc.)
    // carry no products / affiliate links at all — skip those, a video with
    // nothing to sell isn't worth publishing.
    if (!article.products || article.products.length === 0) continue;
    return { slug, article };
  }
  return null;
}

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

// Always moves the slug to the *end* of usedSlugs, even on a repeat — this
// is what makes the rotation fallback in selectNextArticle() work: the
// least-recently-published topic is always usedSlugs[0], so cycling back
// through the catalog never repeats a topic until every other one has had
// its turn again.
export function markUsed(slug) {
  const state = loadState();
  state.usedSlugs = state.usedSlugs.filter((s) => s !== slug);
  state.usedSlugs.push(slug);
  state.lastRunAt = new Date().toISOString();
  saveState(state);
}

// The 3 intended daily slots (7h/12h/17h UTC) are 5h apart. cron-job.org's
// redundant trigger and GitHub's own native schedule can both fire for the
// same slot (near-simultaneously, or one delayed by hours behind the
// other) — without a real time-based guard, each extra fire still produces
// a full extra video. 3h is short enough to never block a legitimate next
// slot, long enough to absorb any duplicate/delayed re-fire of the current
// one. Bypassed by FORCE_ARTICLE_SLUG, which is always a deliberate ask.
const MIN_HOURS_BETWEEN_RUNS = 3;

export function recentlyPublished() {
  const state = loadState();
  if (!state.lastRunAt) return false;
  const hoursSince = (Date.now() - new Date(state.lastRunAt).getTime()) / 3_600_000;
  return hoursSince < MIN_HOURS_BETWEEN_RUNS;
}

// Some catalog entries carry a placeholder like "Voir prix" instead of an
// actual price (Amazon price temporarily unavailable when the article was
// written) — never read that out loud or show it, drop the product instead.
function hasRealPrice(product) {
  return /\d/.test(product.price || "");
}

// Loads one specific article by slug regardless of whether it was already
// used — for redoing a video after fixing the article's content (a bad
// product photo, a discontinued item, etc). Returns null if the slug
// doesn't exist or has no product with a real price.
export function loadArticleBySlug(slug) {
  const file = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const article = JSON.parse(fs.readFileSync(file, "utf8"));
  article.products = (article.products || []).filter(hasRealPrice);
  if (article.products.length === 0) return null;
  return { slug, article };
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
    article.products = (article.products || []).filter(hasRealPrice);
    // Many articles (the "ambiance" mood-board ones, buying guides, etc.)
    // carry no products / affiliate links at all — skip those, a video with
    // nothing to sell isn't worth publishing.
    if (article.products.length === 0) continue;
    return { slug, article };
  }

  // Every product-bearing article has been published at least once — per
  // the "3 videos/day, no matter what" standing rule, skipping the day is
  // no longer an acceptable outcome. Rotate back through already-published
  // topics instead, oldest-first (usedSlugs[0]). markUsed() always moves a
  // slug to the end of usedSlugs, so this naturally cycles the whole
  // catalog before any single topic repeats twice.
  for (const slug of state.usedSlugs) {
    const picked = loadArticleBySlug(slug);
    if (picked) return picked;
  }

  return null; // truly no article anywhere has a real-priced product
}

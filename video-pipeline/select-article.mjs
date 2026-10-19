import fs from "node:fs";
import path from "node:path";
import { ARTICLES_DIR, STATE_PATH } from "./config.mjs";

const REQUETES_PATH = path.join(path.dirname(STATE_PATH), "requetes.json");

export function loadState() {
  if (!fs.existsSync(STATE_PATH)) return { usedSlugs: [] };
  return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
}

export function saveState(state) {
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + "\n");
}

// Always moves the slug to the *end* of usedSlugs, even on a repeat — this
// is what makes the rotation fallback in selectNextArticleForType() work:
// the least-recently-published topic (of a given type) is always earliest
// in usedSlugs, so cycling back through the catalog never repeats a topic
// until every other one of that type has had its turn again.
export function markUsed(slug) {
  const state = loadState();
  state.usedSlugs = state.usedSlugs.filter((s) => s !== slug);
  state.usedSlugs.push(slug);
  state.lastRunAt = new Date().toISOString();
  saveState(state);
}

// The 5 intended daily slots (6h/9h30/13h/16h30/20h UTC) are 3h30 apart.
// cron-job.org's redundant trigger and GitHub's own native schedule can
// both fire for the same slot (near-simultaneously, or one delayed behind
// the other) — without a real time-based guard, each extra fire still
// produces a full extra video. 3h is short enough to never block a
// legitimate next slot, long enough to absorb any duplicate/delayed
// re-fire of the current one. Bypassed by FORCE_ARTICLE_SLUG, which is
// always a deliberate ask.
const MIN_HOURS_BETWEEN_RUNS = 3;

export function recentlyPublished() {
  const state = loadState();
  if (!state.lastRunAt) return false;
  const hoursSince = (Date.now() - new Date(state.lastRunAt).getTime()) / 3_600_000;
  return hoursSince < MIN_HOURS_BETWEEN_RUNS;
}

// --- Daily format mix (2 comparatif / 2 audible / 1 solo) ---------------
//
// "Comparatif" = the usual top-5 product roundup. "Audible" = a top-5
// books/audiobooks video (article.videoType: "audible" in its JSON) — none
// exist yet on this channel (déco book topics are deferred), so this type
// will fall back to comparatif until some are authored, same graceful
// degradation as any other channel with a thin type. "Solo" = a
// single-product spotlight, synthesized on the fly from one product picked
// out of the comparatif catalog (see buildSoloArticle below) instead of
// requiring dozens of hand-authored one-product articles.
// 2026-10-18 : tous les comparatifs sont publies -> la journee alterne des
// shorts "requete" (une vraie question deco, requetes.json) et des solos.
// Un comparatif neuf (nouvel article) reprend automatiquement sa place.
// "livre" = un Short qui feuillette un livre de la Bibliotheque du site
// (couverture + pages d'extrait, src/data/bibliotheque.json).
const FORMAT_SEQUENCE = ["requete", "livre", "comparatif", "solo", "livre"];

function todayKey() {
  return new Date().toISOString().slice(0, 10); // UTC date, matches cron's own clock
}

function getDailyCounts() {
  const state = loadState();
  if (!state.dailyCounts || state.dailyCounts.date !== todayKey()) {
    return { date: todayKey(), requete: 0, livre: 0, comparatif: 0, audible: 0, solo: 0 };
  }
  return state.dailyCounts;
}

// Which format slot today's run should fill, based on how many of each
// format have already gone out today (state.dailyCounts, reset at UTC
// midnight). Once the day's 5 slots are all filled (extra manual runs),
// keeps alternating comparatif/audible as a safe default rather than
// erroring.
export function nextFormatType() {
  const counts = getDailyCounts();
  const totalToday = (counts.requete || 0) + (counts.livre || 0) + (counts.comparatif || 0) + (counts.audible || 0) + (counts.solo || 0);
  if (totalToday < FORMAT_SEQUENCE.length) return FORMAT_SEQUENCE[totalToday];
  return totalToday % 2 === 0 ? "comparatif" : "audible";
}

// Call once a video of the given type has actually been uploaded — keeps
// the day's format mix accurate even when a fallback substituted a
// different type than originally requested (see run.mjs).
export function recordPublishedType(type) {
  const state = loadState();
  const counts = getDailyCounts();
  counts[type] = (counts[type] || 0) + 1;
  state.dailyCounts = counts;
  saveState(state);
}

// Some catalog entries carry a placeholder like "Voir prix" instead of an
// actual price (Amazon price temporarily unavailable when the article was
// written) — never read that out loud or show it, drop the product instead.
function hasRealPrice(product) {
  return /\d/.test(product.price || "");
}

function articleType(article) {
  return article.videoType || "comparatif";
}

function readArticle(file) {
  const article = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8"));
  article.products = (article.products || []).filter(hasRealPrice);
  return article;
}

// Loads one specific article by slug regardless of whether it was already
// used — for redoing a video after fixing the article's content (a bad
// product photo, a discontinued item, etc). Returns null if the slug
// doesn't exist or has no product with a real price.
export function loadArticleBySlug(slug) {
  const file = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  const article = readArticle(`${slug}.json`);
  if (article.products.length === 0) return null;
  return { slug, article };
}

// Picks the next UNUSED article of a given format type, alphabetical order.
// Returns null once every article of this type has already been published —
// never republishes an already-used topic as if it were new; run.mjs is
// responsible for trying another type or a solo spotlight instead of calling
// this again with the same type. Many articles (the "ambiance" mood-board
// ones, buying guides, etc.) carry no products/affiliate links at all —
// those are skipped, a video with nothing to sell isn't worth publishing.
// (Previously this rotated back through already-published topics of the
// same type as a "never skip a slot" fallback — that produced literal
// duplicate re-uploads on channels whose catalog is smaller than the daily
// slot count. Fixed 2026-09-12.)
export function selectNextArticleForType(type) {
  const state = loadState();
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    if (state.usedSlugs.includes(slug)) continue;
    const article = readArticle(file);
    if (articleType(article) !== type) continue;
    if (article.products.length === 0) continue;
    return { slug, article, actualType: type };
  }

  return null; // every article of this type has already been published
}

// "Solo" videos spotlight a single product instead of a top-5 — rather
// than requiring a whole separate catalog of one-product articles, pick
// one product out of the existing comparatif catalog and wrap it in a
// synthetic single-product article. state.soloIndex rotates deterministically
// through every (article, product) pair so the same product isn't spotlit
// every time.
// --- Anti-repetition helpers -------------------------------------------
const ASIN_RE = /\/dp\/([A-Z0-9]{10})/i;
function asinOf(product) {
  return product.affiliateUrl?.match(ASIN_RE)?.[1] || null;
}
// Source article (topic) of an already-published slug: "solo-<src>-<ASIN>",
// "req-..." (looked up in requetes.json) or a plain comparatif slug.
function sourceOfSlug(slug, reqMap) {
  if (slug.startsWith("solo-")) return slug.slice(5).replace(/-[A-Z0-9]{10}$/, "");
  if (slug.startsWith("req-")) return reqMap[slug] || slug;
  return slug;
}
const RECENT_TOPICS = 6; // never the same topic twice within the last 6 shorts

function recentSources(state) {
  const reqMap = Object.fromEntries(loadRequetes().map((r) => [r.slug, r.source]));
  return new Set(state.usedSlugs.slice(-RECENT_TOPICS).map((s) => sourceOfSlug(s, reqMap)));
}

// Product names already shown in a short (any format) — the same product can
// sit in two articles (e.g. a best-seller also in the candles roundup).
function shownNames(state) {
  const reqs = Object.fromEntries(loadRequetes().map((r) => [r.slug, r]));
  const names = new Set();
  for (const slug of state.usedSlugs) {
    if (slug.startsWith("req-") && reqs[slug]) names.add(reqs[slug].pick.toLowerCase());
  }
  return names;
}

export function buildSoloArticle() {
  const state = loadState();
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();

  const pool = [];
  for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    const article = readArticle(file);
    if (articleType(article) === "audible") continue; // solo spotlights a physical product
    article.products.forEach((product, rank) => pool.push({ sourceSlug: slug, sourceArticle: article, product, rank }));
  }
  if (pool.length === 0) return null;
  // Interleave topics: every article's #1, then every #2... so two solos in a
  // row never come from the same roundup.
  pool.sort((a, b) => a.rank - b.rank || a.sourceSlug.localeCompare(b.sourceSlug));

  const usedAsins = new Set(state.usedSlugs.filter((s) => s.startsWith("solo-")).map((s) => s.slice(-10)));
  const usedNames = new Set();
  const recent = recentSources(state);
  const fresh = pool.filter((p) => {
    const asin = asinOf(p.product);
    if (asin && usedAsins.has(asin)) return false;
    const key = p.product.name.toLowerCase();
    if (usedNames.has(key)) return false; // same product listed in two articles
    usedNames.add(key);
    return true;
  });
  if (fresh.length === 0) return null; // everything shown once: skip rather than repeat
  const pick = fresh.find((p) => !recent.has(p.sourceSlug)) || fresh[0];
  state.soloIndex = (state.soloIndex || 0) + 1;
  saveState(state);

  const article = {
    title: pick.product.name,
    slug: pick.sourceArticle.slug,
    category: pick.sourceArticle.category,
    excerpt: pick.sourceArticle.excerpt,
    hookSubject: pick.product.name,
    videoType: "solo",
    products: [pick.product],
  };
  return {
    slug: `solo-${pick.sourceSlug}-${asinOf(pick.product) || state.soloIndex}`,
    article,
    actualType: "solo",
  };
}

// --- "requete" shorts (one real deco question answered in ~30 s) ---------
export function loadRequetes() {
  if (!fs.existsSync(REQUETES_PATH)) return [];
  try {
    const list = JSON.parse(fs.readFileSync(REQUETES_PATH, "utf8").replace(/^﻿/, ""));
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function buildRequeteArticle(r) {
  const file = path.join(ARTICLES_DIR, `${r.source}.json`);
  if (!fs.existsSync(file)) return null;
  const source = readArticle(`${r.source}.json`);
  const pick = source.products.find((p) => p.name.toLowerCase().includes(r.pick.toLowerCase())) || source.products[0];
  if (!pick) return null;
  const article = {
    videoType: "requete",
    slug: source.slug || r.source,
    category: source.category,
    title: r.title,
    hook: r.hook,
    tips: r.tips,
    keywords: r.keywords || [],
    excerpt: [r.title, "", ...r.tips.map(([spoken]) => `✅ ${spoken}`)].join("\n"),
    products: [pick],
  };
  return { slug: r.slug, article, actualType: "requete" };
}

// Next unpublished requete whose topic was not covered in the last shorts.
export function selectNextRequete() {
  const state = loadState();
  const recent = recentSources(state);
  const fresh = loadRequetes().filter((r) => !state.usedSlugs.includes(r.slug));
  const r = fresh.find((x) => !recent.has(x.source)) || fresh[0];
  return r ? buildRequeteArticle(r) : null;
}

// --- "livre" shorts: flip through one book of the site's Bibliotheque ------
const BIBLIO_PATH = path.resolve(ARTICLES_DIR, "..", "..", "src", "data", "bibliotheque.json");
const BIBLIO_PUBLIC = path.resolve(ARTICLES_DIR, "..", "..", "public", "bibliotheque", "livres");

export function loadLivres() {
  if (!fs.existsSync(BIBLIO_PATH)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(BIBLIO_PATH, "utf8").replace(/^﻿/, ""));
    return Array.isArray(data.livres) ? data.livres : [];
  } catch {
    return [];
  }
}

export function buildLivreArticle(l) {
  const dir = path.join(BIBLIO_PUBLIC, l.slug);
  const cover = `/bibliotheque/livres/${l.slug}/couverture.jpg`;
  if (!fs.existsSync(path.join(dir, "couverture.jpg"))) return null;
  const pages = [];
  for (let i = 1; i <= 8; i++) {
    if (fs.existsSync(path.join(dir, `page-${i}.jpg`))) pages.push(`/bibliotheque/livres/${l.slug}/page-${i}.jpg`);
  }
  if (pages.length < 3) return null;
  const siteUrl = `https://marius-home.com/bibliotheque/${l.slug}`;
  const article = {
    videoType: "livre",
    slug: l.slug,
    category: "bibliotheque",
    title: l.titre,
    sousTitre: l.sousTitre || "",
    intro: l.intro || "",
    contenu: l.contenu || [],
    pageCount: l.pages,
    categorie: l.categorie,
    price: l.prix,
    cover,
    pages,
    siteUrl,
    etsyUrl: l.etsy || "",
    keywords: [l.titre.toLowerCase(), "livre a imprimer", "pdf a imprimer"],
    excerpt: `${l.titre} – ${l.sousTitre || ""}`,
    products: [{ name: l.titre, price: l.prix, image: cover, affiliateUrl: l.etsy || siteUrl }],
  };
  return { slug: `livre-${l.slug}`, article, actualType: "livre" };
}

// Next book never shown, alternating themes (coloriage, planners, guides...).
export function selectNextLivre() {
  const state = loadState();
  const fresh = loadLivres().filter((l) => !state.usedSlugs.includes(`livre-${l.slug}`));
  const lastLivre = [...state.usedSlugs].reverse().find((s) => s.startsWith("livre-"));
  const lastCat = lastLivre ? loadLivres().find((l) => `livre-${l.slug}` === lastLivre)?.categorie : null;
  const ordered = [...fresh.filter((l) => l.categorie !== lastCat), ...fresh];
  for (const l of ordered) {
    const picked = buildLivreArticle(l);
    if (picked) return picked;
  }
  return null;
}

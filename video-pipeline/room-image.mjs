import fs from "node:fs";
import path from "node:path";
import { PUBLIC_DIR, ROOT_DIR } from "./config.mjs";

const AMBIANCE_ROOMS_DIR = path.join(PUBLIC_DIR, "images", "ambiances");
// Extra room shots supplied directly by the user (their own renders/photos,
// not published on the site). Organize into style subfolders matching an
// article's `ambianceStyle` (bali/boheme/indien/industriel/japon/provencal)
// so a themed article gets a themed room instead of a random one — files
// left directly in this folder are treated as style-neutral "generic".
const CUSTOM_ROOMS_DIR = path.join(ROOT_DIR, "video-pipeline", "assets", "rooms");
const KNOWN_STYLES = ["bali", "boheme", "indien", "industriel", "japon", "provencal"];

function listImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .sort()
    .map((f) => path.join(dir, f));
}

// { bali: [...], boheme: [...], ..., generic: [...] }
function buildStylePools() {
  const pools = { generic: [] };
  for (const style of KNOWN_STYLES) pools[style] = [];

  // Public site images already encode style in the filename:
  // "ambiance-{style}-{chambre|salon|salle-de-bain}.png".
  if (fs.existsSync(AMBIANCE_ROOMS_DIR)) {
    for (const file of fs.readdirSync(AMBIANCE_ROOMS_DIR)) {
      const match = file.match(/^ambiance-([a-z]+)-(chambre|salon|salle-de-bain)\.(png|jpe?g)$/i);
      if (match && pools[match[1]]) {
        pools[match[1]].push(path.join(AMBIANCE_ROOMS_DIR, file));
      }
    }
  }

  // Custom images: subfolder name = style, root-level files = generic.
  for (const style of KNOWN_STYLES) {
    pools[style].push(...listImageFiles(path.join(CUSTOM_ROOMS_DIR, style)));
  }
  pools.generic.push(...listImageFiles(CUSTOM_ROOMS_DIR));

  return pools;
}

const STYLE_POOLS = buildStylePools();
const ALL_IMAGES = Object.values(STYLE_POOLS).flat();

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function pickFrom(pool, seed) {
  return pool[hashString(seed) % pool.length];
}

// Every video opens (and closes) on a fully styled room, even for articles
// whose own cover image is just a flat-lay of the products. When the article
// has a known ambiance style (article.ambianceStyle), it's matched to a room
// in that same style first; otherwise (or if that style has no images yet)
// it falls back to the full mixed pool. Deterministic per article slug so
// re-renders stay consistent. Returns an absolute path.
export function pickRoomImage(article) {
  const stylePool = article.ambianceStyle && STYLE_POOLS[article.ambianceStyle];
  const pool = stylePool && stylePool.length > 0 ? stylePool : ALL_IMAGES;
  return pickFrom(pool, article.slug);
}

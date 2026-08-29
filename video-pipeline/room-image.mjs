import fs from "node:fs";
import path from "node:path";
import { PUBLIC_DIR, ROOT_DIR } from "./config.mjs";

const AMBIANCE_ROOMS_DIR = path.join(PUBLIC_DIR, "images", "ambiances");
// Extra room shots supplied directly by the user (their own renders/photos,
// not published on the site) — drop files here to grow the pool.
const CUSTOM_ROOMS_DIR = path.join(ROOT_DIR, "video-pipeline", "assets", "rooms");

function listImages(dir, filter) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .filter((f) => (filter ? filter(f) : true))
    .sort()
    .map((f) => path.join(dir, f));
}

// Only the actual staged-interior photos (bedroom/living room/bathroom) —
// the bare style files (bali.png, boheme.png, ...) are landscape/mood shots
// used for category cards, not rooms, and would look out of place here.
const AMBIANCE_ROOM_IMAGES = listImages(AMBIANCE_ROOMS_DIR, (f) =>
  /^ambiance-.+-(chambre|salon|salle-de-bain)\.(png|jpe?g)$/i.test(f)
);
const CUSTOM_ROOM_IMAGES = listImages(CUSTOM_ROOMS_DIR);

const ROOM_IMAGES = [...AMBIANCE_ROOM_IMAGES, ...CUSTOM_ROOM_IMAGES];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Every video opens (and closes) on a fully styled room, even for articles
// whose own cover image is just a flat-lay of the products — deterministic
// per article slug so re-renders stay consistent. Returns an absolute path.
export function pickRoomImage(slug) {
  const index = hashString(slug) % ROOM_IMAGES.length;
  return ROOM_IMAGES[index];
}

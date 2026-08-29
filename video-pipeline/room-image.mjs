import fs from "node:fs";
import path from "node:path";
import { PUBLIC_DIR } from "./config.mjs";

const ROOMS_DIR = path.join(PUBLIC_DIR, "images", "ambiances");

// Only the actual staged-interior photos (bedroom/living room/bathroom) —
// the bare style files (bali.png, boheme.png, ...) are landscape/mood shots
// used for category cards, not rooms, and would look out of place here.
const ROOM_IMAGE_FILES = fs
  .readdirSync(ROOMS_DIR)
  .filter((f) => /^ambiance-.+-(chambre|salon|salle-de-bain)\.(png|jpe?g)$/i.test(f))
  .sort();

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Every video opens (and closes) on a fully styled room, even for articles
// whose own cover image is just a flat-lay of the products — deterministic
// per article slug so re-renders stay consistent.
export function pickRoomImage(slug) {
  const index = hashString(slug) % ROOM_IMAGE_FILES.length;
  return `/images/ambiances/${ROOM_IMAGE_FILES[index]}`;
}

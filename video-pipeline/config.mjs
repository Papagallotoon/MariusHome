import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, "..");
export const ARTICLES_DIR = path.join(ROOT_DIR, "content", "articles");
export const PUBLIC_DIR = path.join(ROOT_DIR, "public");
export const STATE_PATH = path.join(__dirname, "state.json");
export const TMP_DIR = path.join(__dirname, "tmp");
export const OUT_DIR = path.join(__dirname, "out");

export const SITE_DOMAIN = "https://marius-home.com";
export const SITE_BRAND_CAPTION = "marius-home.com";
export const CHIME_PATH = path.join(__dirname, "assets", "chime.mp3");
// Multilingual-generation neural voice — sounds noticeably warmer/more
// natural than the older single-locale neural voices (e.g. DeniseNeural).
export const TTS_VOICE = "fr-FR-VivienneMultilingualNeural";
export const TTS_PROSODY = { rate: "+6%", pitch: "+5%" };
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const FPS = 30;

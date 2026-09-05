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
// Fixed brand bumper shown at the very start of every video, identical
// every time — the one recognizable element that doesn't vary with the
// topic (unlike the room photo, which is per-article on purpose).
export const TITLE_CARD_PATH = path.join(__dirname, "assets", "title-card.png");
// Subtle warm/gold push applied to every image in every video, so the
// channel has a consistent visual signature even though the underlying
// room photos vary a lot from one ambiance to the next.
export const COLOR_GRADE = "eq=saturation=1.05:contrast=1.04,colorbalance=rm=0.05:gm=0.02:bm=-0.04";
// Multilingual-generation neural voice — sounds noticeably warmer/more
// natural than the older single-locale neural voices (e.g. DeniseNeural).
export const TTS_VOICE = "fr-FR-VivienneMultilingualNeural";
// A faster rate reads as rushed/robotic rather than "smiling" — a modest
// pitch lift carries the warmth instead, at a closer-to-natural pace.
export const TTS_PROSODY = { rate: "+2%", pitch: "+4%" };
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const FPS = 30;

// Intro/outro cover generated per-video with OpenAI instead of picking from
// the static room-photo pool (which had no reliable way to reject an
// obviously mismatched image — a leftover Japanese street photo kept
// getting picked for unrelated articles). Falls back to the room-photo pool
// automatically if the key is missing or the call fails.
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
export const OPENAI_IMAGE_MODEL = "gpt-image-1.5";

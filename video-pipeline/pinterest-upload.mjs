// Publishes a rendered short as a Pinterest video Pin whose link points to the
// matching article on the site (where the Amazon links are clickable). Needs
// PINTEREST_APP_ID / PINTEREST_APP_SECRET / PINTEREST_REFRESH_TOKEN — the
// refresh token comes from get-pinterest-token.mjs.
import fs from "node:fs";
import { SITE_DOMAIN } from "./config.mjs";

// Trial-access apps may only create sandbox Pins: set
// PINTEREST_API_BASE=https://api-sandbox.pinterest.com/v5 until Standard access.
const API = process.env.PINTEREST_API_BASE || "https://api.pinterest.com/v5";
const BOARD_NAME = process.env.PINTEREST_BOARD_NAME || "Idées déco Marius Concept";

async function pinterest(path, { token, method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Pinterest API ${method} ${path} failed (${res.status}): ${JSON.stringify(json)}`);
  return json;
}

async function getAccessToken() {
  const { PINTEREST_APP_ID, PINTEREST_APP_SECRET, PINTEREST_REFRESH_TOKEN } = process.env;
  if (!PINTEREST_APP_ID || !PINTEREST_APP_SECRET || !PINTEREST_REFRESH_TOKEN) {
    throw new Error(
      "Missing PINTEREST_APP_ID / PINTEREST_APP_SECRET / PINTEREST_REFRESH_TOKEN env vars. " +
        "Run `node video-pipeline/get-pinterest-token.mjs` once locally to obtain the refresh token."
    );
  }
  // The OAuth endpoint lives on the production host even for sandbox apps.
  const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${PINTEREST_APP_ID}:${PINTEREST_APP_SECRET}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: PINTEREST_REFRESH_TOKEN }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Pinterest token refresh failed (${res.status}): ${JSON.stringify(json)}`);
  if (json.refresh_token && json.refresh_token !== PINTEREST_REFRESH_TOKEN) {
    console.warn("Pinterest returned a new refresh token — update the PINTEREST_REFRESH_TOKEN secret with get-pinterest-token.mjs.");
  }
  return json.access_token;
}

async function getBoardId(token) {
  let bookmark;
  do {
    const page = await pinterest(`/boards?page_size=100${bookmark ? `&bookmark=${bookmark}` : ""}`, { token });
    const found = page.items?.find((b) => b.name === BOARD_NAME);
    if (found) return found.id;
    bookmark = page.bookmark;
  } while (bookmark);
  const created = await pinterest("/boards", {
    token,
    method: "POST",
    body: { name: BOARD_NAME, description: "Sélections déco, tendances et bons plans maison par Marius Concept.", privacy: "PUBLIC" },
  });
  return created.id;
}

function articleUrl(article) {
  const url = new URL(`${SITE_DOMAIN}/${article.category}/${article.slug}`);
  url.searchParams.set("utm_source", "pinterest");
  url.searchParams.set("utm_medium", "social");
  return url.toString();
}

export function buildPinText(article) {
  const products = (article.products || []).slice(0, 5).map((p) => `• ${p.name} — ${p.price}`);
  const description = [
    article.metaDescription || article.excerpt || "",
    products.length ? `\n${products.join("\n")}` : "",
    "\nComparatif complet et liens des produits sur marius-home.com",
    "\n#deco #decoration #interieur #maison #tendance",
  ]
    .join("\n")
    .slice(0, 800);
  return { title: article.title.slice(0, 100), description, altText: `Vidéo : ${article.title}`.slice(0, 500) };
}

async function uploadVideoMedia(token, videoPath) {
  const media = await pinterest("/media", { token, method: "POST", body: { media_type: "video" } });
  const form = new FormData();
  for (const [key, value] of Object.entries(media.upload_parameters)) form.append(key, value);
  form.append("file", new Blob([fs.readFileSync(videoPath)], { type: "video/mp4" }), "video.mp4");
  const up = await fetch(media.upload_url, { method: "POST", body: form });
  if (!up.ok) throw new Error(`Pinterest video upload failed (${up.status}): ${await up.text()}`);

  const deadline = Date.now() + 5 * 60_000;
  while (Date.now() < deadline) {
    const { status } = await pinterest(`/media/${media.media_id}`, { token });
    if (status === "succeeded") return media.media_id;
    if (status === "failed") throw new Error("Pinterest video processing failed");
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`Pinterest media ${media.media_id} still processing after 5 minutes`);
}

export async function uploadToPinterest({ videoPath, article }) {
  const token = await getAccessToken();
  const boardId = await getBoardId(token);
  const mediaId = await uploadVideoMedia(token, videoPath);
  const { title, description, altText } = buildPinText(article);

  const cover = article.products?.[0]?.image;
  const mediaSource = { source_type: "video_id", media_id: mediaId };
  if (cover?.startsWith("/")) mediaSource.cover_image_url = `${SITE_DOMAIN}${cover}`;
  else mediaSource.cover_image_key_frame_time = 1;

  const pin = await pinterest("/pins", {
    token,
    method: "POST",
    body: { board_id: boardId, title, description, alt_text: altText, link: articleUrl(article), media_source: mediaSource },
  });
  return { pinId: pin.id, link: articleUrl(article) };
}

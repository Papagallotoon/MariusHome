import fs from "node:fs";
import { google } from "googleapis";
import { SITE_DOMAIN } from "./config.mjs";

function getAuthedClient() {
  const { YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN } = process.env;
  if (!YT_CLIENT_ID || !YT_CLIENT_SECRET || !YT_REFRESH_TOKEN) {
    throw new Error(
      "Missing YT_CLIENT_ID / YT_CLIENT_SECRET / YT_REFRESH_TOKEN env vars. " +
        "Run `node video-pipeline/get-youtube-token.mjs` once locally to obtain them."
    );
  }
  const oauth2Client = new google.auth.OAuth2(YT_CLIENT_ID, YT_CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: YT_REFRESH_TOKEN });
  return oauth2Client;
}

function buildDescription(article) {
  const articleUrl = `${SITE_DOMAIN}/articles/${article.slug}`;
  const links = article.products
    .slice(0, 5) // matches the products actually featured in the video (see build-script.mjs)
    .map((p, i) => `${i + 1}. ${p.name} — ${p.price}\n${p.affiliateUrl}`)
    .join("\n\n");

  return [
    article.metaDescription || article.excerpt,
    "",
    `Article complet : ${articleUrl}`,
    "",
    "Liens des produits (liens affiliés Amazon) :",
    links,
    "",
    "Les prix sont ceux constatés au moment de la publication de cette vidéo et peuvent avoir changé depuis.",
    "",
    "#deco #decoration #shorts",
  ].join("\n");
}

// Uploads the rendered short. privacyStatus defaults to "unlisted" so the
// first few runs can be checked in YouTube Studio before going public —
// pass YT_PRIVACY=public (env) once you trust the pipeline.
export async function uploadVideo({ videoPath, article }) {
  const auth = getAuthedClient();
  const youtube = google.youtube({ version: "v3", auth });

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: `${article.title} #Shorts`.slice(0, 100),
        description: buildDescription(article),
        tags: ["decoration", "deco", "maison", "shorts"],
        categoryId: "26", // Howto & Style
      },
      status: {
        privacyStatus: process.env.YT_PRIVACY || "unlisted",
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: fs.createReadStream(videoPath),
    },
  });

  return res.data;
}

// One-time local helper: gets the Pinterest refresh token the pipeline needs.
// The redirect lands on marius-home.com/pinterest-callback, which displays the
// code — paste it back here to finish the exchange.
import crypto from "node:crypto";
import readline from "node:readline/promises";

const REDIRECT_URI = "https://marius-home.com/pinterest-callback";
const SCOPES = "boards:read,boards:write,pins:read,pins:write,user_accounts:read";

// Keys pasted from the portal often carry stray spaces or quotes.
const clean = (v) => (v || "").trim().replace(/^["']|["']$/g, "");
const appId = clean(process.env.PINTEREST_APP_ID);
const appSecret = clean(process.env.PINTEREST_APP_SECRET);

if (!appId || !appSecret) {
  console.error(
    "Définissez PINTEREST_APP_ID et PINTEREST_APP_SECRET (depuis developers.pinterest.com), puis relancez.\n" +
      "Exemple (PowerShell) :\n" +
      '  $env:PINTEREST_APP_ID="..."; $env:PINTEREST_APP_SECRET="..."; node video-pipeline/get-pinterest-token.mjs'
  );
  process.exit(1);
}

const basicAuth = `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`;

// Check the app secret before sending the user through the OAuth consent:
// a wrong secret only surfaces at the code exchange, as "Authentication failed".
const probe = await fetch("https://api.pinterest.com/v5/oauth/token", {
  method: "POST",
  headers: { Authorization: basicAuth, "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "client_credentials", scope: "boards:read" }),
});
const probeJson = await probe.json().catch(() => ({}));
if (/authentication failed/i.test(probeJson.message || "")) {
  console.error(
    `La clé secrète est refusée par Pinterest (App ID ${appId}, clé de ${appSecret.length} caractères).\n` +
      "Sur la page de l'app, cliquez sur l'icône 👁 de « Clé secrète de l'application », copiez la vraie valeur (pas les tirets) et relancez."
  );
  process.exitCode = 1;
} else {
  await authorize();
}

async function authorize() {
const authUrl =
  "https://www.pinterest.com/oauth/?" +
  new URLSearchParams({
    client_id: appId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    state: crypto.randomBytes(16).toString("hex"),
  });

console.log(`App ID utilisé : ${appId}`);
console.log("\nOuvrez ce lien, connectez-vous avec le compte Pinterest Marius Concept et autorisez l'application :\n");
console.log(authUrl);
console.log("\nLa page d'arrivée affiche un code — copiez-le.\n");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const code = decodeURIComponent((await rl.question("Collez le code ici : ")).trim());
rl.close();

const res = await fetch("https://api.pinterest.com/v5/oauth/token", {
  method: "POST",
  headers: {
    Authorization: basicAuth,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI }),
});
const json = await res.json();

// process.exitCode instead of process.exit(): exiting right after closing
// readline crashes Node on Windows (UV_HANDLE_CLOSING assertion).
if (!res.ok) {
  console.error("Échec de l'échange (le code expire vite — relancez rapidement) :", json);
  process.exitCode = 1;
  return;
}

console.log(`\nSuccès ! Scopes accordés : ${json.scope}`);
console.log("Ajoutez ceci comme secret GitHub PINTEREST_REFRESH_TOKEN (repo MariusHome) :\n");
console.log(json.refresh_token);
console.log(`\n(valable ~${Math.round((json.refresh_token_expires_in || 0) / 86400)} jours)`);
}

// Turns an article JSON (already written for the website) into a spoken
// script for the video. Purely template-based: no LLM call, no external
// dependency, nothing that can fail or cost money.
import { pickRoomImage } from "./room-image.mjs";

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

// The TTS voice reads "cm"/"mm"/"kg" abbreviations awkwardly, and the user
// doesn't want dimensions read out loud anyway — strip them from anything
// destined for narration. Captions (on-screen text) keep the original,
// unstripped wording.
// Strip the whole parenthetical group when it carries a measurement (e.g.
// "(68/51/41cm Hauteur)") so no orphan words like "Hauteur" are left behind,
// then mop up any remaining bare dimension token outside parentheses.
const PAREN_WITH_DIMENSION = /\([^()]*\d[^()]*(?:cm|mm|kg|cl|ml)[^()]*\)/gi;
const DIMENSION_TOKEN = /[ØøΦ]?\d[\d.,/x×\s]*\s?(cm|mm|kg|cl|ml)\b\.?/gi;

function stripDimensionsForSpeech(text) {
  return clean(
    text
      .replace(PAREN_WITH_DIMENSION, "")
      .replace(DIMENSION_TOKEN, "")
      .replace(/\(\s*\)/g, "")
      .replace(/\s+([,.:;])/g, "$1")
      .replace(/,\s*,/g, ",")
  );
}

function isDimensionHeavy(text) {
  DIMENSION_TOKEN.lastIndex = 0;
  return DIMENSION_TOKEN.test(text);
}

// Picks a "strong point" to read aloud that isn't just a measurement —
// falls back to no "plus" clause at all rather than reading a stripped,
// half-empty sentence.
function pickSpokenPro(pros = []) {
  return pros.find((p) => !isDimensionHeavy(p)) || null;
}

// Warm, conversational rank intros instead of a flat "Numéro N." recitation
// — capped list matches the 5-product cap below.
const RANK_INTROS = [
  "Premier coup de cœur",
  "En deuxième place",
  "Numéro trois",
  "On continue avec le numéro quatre",
  "Et pour finir, notre dernier choix",
];

export function buildScript(article) {
  const lines = [];
  // Always open (and close) on a fully styled room — the article's own
  // cover is often just a flat-lay of the products, not a "pièce".
  const roomImage = pickRoomImage(article);

  lines.push({
    id: "intro",
    spoken: clean(`${stripDimensionsForSpeech(article.title)} ! ${stripDimensionsForSpeech(article.excerpt)}`),
    caption: article.title,
    image: roomImage,
  });

  // Cap at 5 products: a couple of articles carry 10, which would make the
  // short run well past the ~60s Shorts limit.
  const products = article.products.slice(0, 5);

  products.forEach((product, i) => {
    const rank = i + 1;
    const spokenPro = pickSpokenPro(product.pros);
    const proSentence = spokenPro ? ` On l'adore pour : ${stripDimensionsForSpeech(spokenPro)}.` : "";
    lines.push({
      id: `product-${i}`,
      spoken: clean(
        `${RANK_INTROS[i]} : ${stripDimensionsForSpeech(product.name)}, à ${product.price}.${proSentence}`
      ),
      caption: `${rank}. ${product.name}\n${product.price}`,
      image: product.image,
      product,
    });
  });

  lines.push({
    id: "outro",
    spoken:
      "Alors, lequel est ton coup de cœur ? Tout est disponible sur Amazon, liens juste en dessous. " +
      "Petite précision : les prix peuvent avoir changé depuis la publication de cette vidéo. " +
      "Abonne-toi pour ne rater aucune sélection !",
    caption: "Liens en description",
    image: roomImage,
  });

  return lines;
}

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
const PAREN_WITH_DIMENSION = /\([^()]*\d[^()]*(?:cm|mm|kg|cl|ml|m)[^()]*\)/gi;
// "D45cm" / "Ø45cm" are common French notations for a diameter, immediately
// followed by digits with no space — both stripped as a unit.
const DIMENSION_TOKEN = /(?:[ØøΦ]|D(?=\d))?\s?\d[\d.,/x×\s]*\s?(cm|mm|kg|cl|ml|m)\b\.?/gi;

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

// A plain \b treats accented letters (é, à...) as non-word characters, so
// e.g. `\bcandle\b` styled boundaries can misfire around accented French
// words next to them — these lookaround-based boundaries only stop at an
// actual non-letter (see the identical fix on securite-sas, where this
// caused a real "Caméraéra" duplication bug).
const NOT_LETTER_BEFORE = "(?<![A-Za-zÀ-ÿ])";
const NOT_LETTER_AFTER = "(?![A-Za-zÀ-ÿ])";
function wordFix(word, replacement) {
  return [new RegExp(`${NOT_LETTER_BEFORE}${word}${NOT_LETTER_AFTER}`, "gi"), replacement];
}

// Real/marketplace brand names that read badly or risk tripping the
// multilingual voice into switching language mid-sentence — this catalog
// is mostly French listings already, so the exposure here is much smaller
// than on securite-sas, but not zero.
const BRAND_STRIP = [
  "VEVOR", "ComSaf", "Umezawa", "Yankee Candle", "Boltze", "Atmosphera",
  "Artpin", "Duvetnova", "EFELA",
];

function stripBrandNames(text) {
  let result = text;
  for (const brand of BRAND_STRIP) {
    result = result.replace(new RegExp(`${NOT_LETTER_BEFORE}${brand}${NOT_LETTER_AFTER}`, "gi"), "");
  }
  return clean(result);
}

// A handful of product names carry an English scent/feature name (candle
// jars, a "smart" connected garland) rather than a brand — translate the
// recurring ones instead of leaving them in English. This is what caused
// "la langue qui change" reported by the user — see
// [[three-videos-per-day-policy]].
const PRONUNCIATION_FIXES = [
  wordFix("Vanilla Cupcake", "Vanille Cupcake"),
  wordFix("Twinkly Strings", "Guirlande Scintillante"),
  wordFix("Smart WiFi", "Connectée WiFi"),
  wordFix("Cotton Ball Lights", ""), // redundant, "Coton" already said in French
  wordFix("Block Print", "Artisanal"),
  wordFix("Canvas", ""), // redundant, "Toile" already said in French
];

function fixPronunciation(text) {
  let result = text;
  for (const [pattern, replacement] of PRONUNCIATION_FIXES) {
    result = result.replace(pattern, replacement);
  }
  // A fix can empty out a whole word, leaving a dangling " - " separator
  // behind — strip it rather than reading it aloud.
  return clean(result.replace(/^[\s-–]+|[\s-–]+$/g, "").replace(/\s+[-–]\s+/g, " "));
}

const MAX_SPOKEN_NAME_WORDS = 8;

// Product names are written for an Amazon listing, not for being read aloud:
// invented/foreign brand names (ALL-CAPS gibberish, "- tectake" suffixes)
// are exactly the words a TTS voice mangles worst. Strip what we can
// recognize and cap the length — captions keep the full original name.
function simplifyNameForSpeech(name) {
  let cleaned = stripBrandNames(fixPronunciation(name))
    .replace(/\s*[-–]\s*[A-Za-z][\w'.]*$/, "") // trailing "- BrandName" suffix
    .replace(/^(?:[A-Z]{2,}[A-Z0-9]*\s+)+/, ""); // leading ALL-CAPS brand word(s)

  const TRAILING_STOPWORDS = new Set(["à", "de", "du", "des", "en", "et", "avec", "la", "le", "les", "un", "une"]);
  let words = cleaned.trim().split(/\s+/);
  if (words.length > MAX_SPOKEN_NAME_WORDS) {
    words = words.slice(0, MAX_SPOKEN_NAME_WORDS);
    // Don't leave a dangling connector word at the cut point.
    while (words.length > 1 && TRAILING_STOPWORDS.has(words[words.length - 1].toLowerCase())) {
      words.pop();
    }
    cleaned = words.join(" ");
  }
  return cleaned.trim() || name; // never end up with an empty name
}

// Picks a "strong point" to read aloud that isn't just a measurement —
// falls back to no "plus" clause at all rather than reading a stripped,
// half-empty sentence.
function pickSpokenPro(pros = []) {
  const pro = pros.find((p) => !isDimensionHeavy(p));
  return pro ? fixPronunciation(pro) : null;
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
  // The article's own cover is often just a flat-lay of the products, not a
  // "pièce" — pick a themed room photo from the static pool instead.
  const intro = pickRoomImage(article);
  const outro = intro;

  lines.push({
    id: "intro",
    spoken: clean(`${stripDimensionsForSpeech(article.title)} ! ${stripDimensionsForSpeech(article.excerpt)}`),
    caption: article.title,
    image: intro,
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
        `${RANK_INTROS[i]} : ${simplifyNameForSpeech(stripDimensionsForSpeech(product.name))}, à ${product.price}.${proSentence}`
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
    image: outro,
  });

  return lines;
}

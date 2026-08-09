import type { MetadataRoute } from "next";
import { siteConfig } from "../../config/site";

// Requis par next build avec output: "export" : sans ça, cette route est
// traitée comme dynamique et le build échoue en export statique.
export const dynamic = "force-static";

// Politique de crawl explicite (mise à jour 2026-08-09), trois familles :
//
// 1) Moteurs d'indexation classiques (Googlebot, Bingbot) — autorisés,
//    ce sont eux qui font apparaître le site dans les résultats de recherche.
// 2) Crawlers d'assistants IA "à la demande" qui citent la source et
//    renvoient un lien (Claude-User, Claude-SearchBot, OAI-SearchBot,
//    ChatGPT-User, PerplexityBot) — autorisés, c'est du trafic de
//    référencement, pas de l'entraînement.
// 3) Crawlers de collecte pour entraînement de modèles, sans citation ni
//    lien retour (GPTBot, ClaudeBot, CCBot, Google-Extended,
//    Applebot-Extended, Bytespider) — bloqués. Choix éditorial de Marius
//    Dumas (identique à son autre site).
//
// Bloquer Google-Extended n'affecte PAS l'indexation dans Google Search
// classique, qui passe uniquement par Googlebot (règle 1) : Google-Extended
// ne sert qu'à l'entraînement de modèles (Gemini, etc.), c'est un opt-out
// distinct et sans effet sur le SEO.
export default function robots(): MetadataRoute.Robots {
  const allowedBots = [
    "Googlebot",
    "Bingbot",
    "Claude-User",
    "Claude-SearchBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
  ];

  const blockedBots = [
    "GPTBot",
    "ClaudeBot",
    "CCBot",
    "Google-Extended",
    "Applebot-Extended",
    "Bytespider",
  ];

  return {
    rules: [
      ...allowedBots.map((userAgent) => ({ userAgent, allow: "/" })),
      ...blockedBots.map((userAgent) => ({ userAgent, disallow: "/" })),
      { userAgent: "*", allow: "/" },
    ],
    sitemap: `${siteConfig.domain}/sitemap.xml`,
  };
}

import type { MetadataRoute } from "next";
import { siteConfig } from "../../config/site";

// Requis par next build avec output: "export" : sans ça, cette route est
// traitée comme dynamique et le build échoue en export statique.
export const dynamic = "force-static";
import { getAllCategories } from "@/lib/categories";
import { getAllArticles } from "@/lib/articles";
import { getAllAmbiances } from "@/lib/ambiances";

// Généré depuis content/ à chaque build (export statique) : remplace
// l'ancien public/sitemap.xml qui listait 18 URLs à la main et n'était
// jamais mis à jour automatiquement quand un article était ajouté.
export default function sitemap(): MetadataRoute.Sitemap {
  const domain = siteConfig.domain;

  const staticPages: MetadataRoute.Sitemap = [
    { url: domain, changeFrequency: "weekly", priority: 1.0 },
    { url: `${domain}/a-propos`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${domain}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${domain}/mentions-legales`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${domain}/politique-confidentialite`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${domain}/ambiances`, changeFrequency: "weekly", priority: 0.7 },
  ];

  const categoryPages: MetadataRoute.Sitemap = getAllCategories().map((c) => ({
    url: `${domain}/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const articles = getAllArticles();

  // Les articles "ambiance-{style}-{pièce}" (ambianceStyle + ambianceRoom
  // renseignés) sont accessibles à la fois via /{category}/{slug} et via
  // /ambiances/{style}/{pièce} : c'est un contenu dupliqué à deux URLs déjà
  // présent dans le dépôt (routing existant, pas introduit ici). On ne
  // référence dans le sitemap que l'URL canonique /ambiances/{style}/
  // {pièce} pour ne pas soumettre de doublons à l'indexation - voir le
  // récapitulatif final pour la recommandation de correction à la source.
  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => !(a.ambianceStyle && a.ambianceRoom))
    .map((a) => ({
      url: `${domain}/${a.category}/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "monthly",
      priority: 0.9,
    }));

  const ambiances = getAllAmbiances();

  const ambianceStylePages: MetadataRoute.Sitemap = ambiances.map((a) => ({
    url: `${domain}/ambiances/${a.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const ambianceRoomPages: MetadataRoute.Sitemap = ambiances.flatMap((a) =>
    a.rooms.map((r) => {
      const article = articles.find((art) => art.ambianceStyle === a.slug && art.ambianceRoom === r.slug);
      return {
        url: `${domain}/ambiances/${a.slug}/${r.slug}`,
        lastModified: article ? new Date(article.date) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.9,
      };
    })
  );

  return [...staticPages, ...categoryPages, ...articlePages, ...ambianceStylePages, ...ambianceRoomPages];
}

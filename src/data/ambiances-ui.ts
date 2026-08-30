/**
 * Données d'ambiance côté UI (client-safe : aucun accès fichier).
 * Aligné sur content/ambiances.json — les articles vivent sous
 * /ambiances-styles/<articleSlug> (catégorie "Ambiances & Styles").
 */

export const AMBIANCE_CATEGORY = "ambiances-styles";

export type Ambiance = {
  name: string;
  slug: string;
  adjM: string;
  adjF: string;
  color: string;
  kicker: string;
  image: string;
  description: string;
};

export const ambiances: Ambiance[] = [
  {
    name: "Japon",
    slug: "japon",
    adjM: "japonais",
    adjF: "japonaise",
    color: "#8B7355",
    kicker: "Minimalisme zen",
    image: "/images/ambiances/japon.png",
    description:
      "Bois clair, papier, pierre : un intérieur épuré où chaque objet a sa raison d'être. L'art de vivre japonais appliqué à un appartement européen.",
  },
  {
    name: "Bohème",
    slug: "boheme",
    adjM: "bohème",
    adjF: "bohème",
    color: "#C2785C",
    kicker: "Esprit libre",
    image: "/images/ambiances/boheme.png",
    description:
      "Rotin, macramé, terre cuite et couleurs chaudes. Un intérieur bohème chic qui garde du caractère sans jamais tomber dans l'accumulation.",
  },
  {
    name: "Bali",
    slug: "bali",
    adjM: "balinais",
    adjF: "balinaise",
    color: "#5B8C5A",
    kicker: "Jungle tropicale",
    image: "/images/ambiances/bali.png",
    description:
      "Bois exotiques, végétation dense et lumière tamisée. L'ambiance resort balinais, transposée dans un salon ou une salle de bain.",
  },
  {
    name: "Provençal",
    slug: "provencal",
    adjM: "provençal",
    adjF: "provençale",
    color: "#9B7EB4",
    kicker: "Lumière du Sud",
    image: "/images/ambiances/provencal.png",
    description:
      "Lin lavé, pierre naturelle et lavande. L'élégance rustique de la Provence, avec des matières qui vieillissent bien.",
  },
  {
    name: "Industriel",
    slug: "industriel",
    adjM: "industriel",
    adjF: "industrielle",
    color: "#6B6B6B",
    kicker: "Esprit loft",
    image: "/images/ambiances/industriel.png",
    description:
      "Métal brut, brique apparente et verre. L'esthétique atelier, adoucie par le bois et les textiles pour rester habitable.",
  },
  {
    name: "Indienne",
    slug: "indien",
    adjM: "indien",
    adjF: "indienne",
    color: "#C4532E",
    kicker: "Couleurs vibrantes",
    image: "/images/ambiances/indien.png",
    description:
      "Motifs ornementaux, laiton et richesse textile. L'opulence indienne dosée pour un intérieur contemporain.",
  },
];

/** Les cinq lectures d'une ambiance, telles qu'affichées dans le méga-menu. */
export function readings(a: Ambiance) {
  return [
    { num: "01", title: `Le salon ${a.adjM}`, tag: "Pièce", href: `/${AMBIANCE_CATEGORY}/ambiance-${a.slug}-salon` },
    { num: "02", title: `La chambre ${a.adjF}`, tag: "Pièce", href: `/${AMBIANCE_CATEGORY}/ambiance-${a.slug}-chambre` },
    { num: "03", title: `La salle de bain ${a.adjF}`, tag: "Pièce", href: `/${AMBIANCE_CATEGORY}/ambiance-${a.slug}-salle-de-bain` },
    { num: "04", title: `Guide du style ${a.adjM}`, tag: "Guide", href: `/${AMBIANCE_CATEGORY}` },
    { num: "05", title: `Les pièges à éviter en déco ${a.adjF}`, tag: "Conseil", href: `/guides-inspirations` },
  ];
}

/** Familles d'objets déco (content/categories.json, images vérifiées). */
export const objectFamilies = [
  { name: "Bougies & parfums", slug: "bougies-parfums", image: "/images/categories/bougies-parfums.png", count: "14 sélections" },
  { name: "Coussins & textiles", slug: "coussins-textiles", image: "/images/categories/coussins-textiles.png", count: "11 sélections" },
  { name: "Luminaires", slug: "luminaires-eclairage", image: "/images/categories/luminaires-eclairage.jpg", count: "9 sélections" },
  { name: "Art mural & cadres", slug: "art-mural-cadres", image: "/images/categories/art-mural-cadres.jpg", count: "8 sélections" },
  { name: "Vases & plantes", slug: "vases-plantes-deco", image: "/images/categories/vases-plantes-deco.png", count: "12 sélections" },
];

export const siteConfig = {
  siteName: "Marius Dumas Home",
  siteTagline: "Conseil en décoration d'intérieur",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://marius-home.com",
  description:
    "Par Marius Dumas, décorateur d'intérieur. Six ambiances, une méthode : sélections d'objets déco testées, comparées et mises à jour chaque semaine.",
  logo: { path: "/images/logo.png", width: 140, height: 40, useTextFallback: true },
  // Palette refonte 2026 — vert éditorial / terre cuite / doré sable
  colors: {
    primary: "#3D4A36",
    primaryDark: "#23281F",
    primaryLight: "#EDEAE1",
    accent: "#C9A87C",
    accentDark: "#A98C5F",
    accentLight: "#F2EDE3",
    gold: "#C9A87C",
    goldLight: "#E0CDAC",
    goldDark: "#A98C5F",
    secondary: "#8C8378",
    secondaryLight: "#F2EDE3",
    background: "#F7F4EE",
    surface: "#FFFDF9",
    text: "#23281F",
    textMuted: "#6E7266",
    border: "#E3DED3",
    footerBg: "#1E2419",
    footerText: "#A8AC9F",
    vivid: "#A64B2A",
    vividDark: "#8E3E22",
    vividLight: "#F1E3DA",
  },
  amazon: { tag: "secure012de-21", marketplace: "fr" },
  seo: { titleSeparator: " | ", defaultAuthor: "Marius Dumas" },
  social: { twitter: "", pinterest: "", facebook: "" },
  homepage: {
    hero: {
      backgroundImage: "/images/hero-bg.png",
      backgroundOverlayOpacity: 0.7,
      title: "Créez un intérieur",
      titleAccent: "qui vous ressemble",
      subtitle:
        "Six ambiances, une méthode. Marius Dumas compose des intérieurs naturels — et sélectionne, pièce par pièce, les objets qui les font exister.",
      ctaPrimary: { label: "Découvrir les ambiances", href: "#univers" },
      ctaSecondary: { label: "Dernières sélections", href: "#selections" },
    },
    features: {
      items: [
        {
          title: "Une ambiance d'abord",
          description:
            "On part du style de vie, pas du catalogue. La cohérence avant l'achat.",
        },
        {
          title: "Sélections testées",
          description:
            "Matières vues en vrai, comparées à trois alternatives, prix relevés chaque semaine.",
        },
        {
          title: "Transparence totale",
          description:
            "Liens affiliés signalés. Aucun produit recommandé pour sa seule commission.",
        },
      ],
    },
    categoriesSection: {
      title: "Choisissez l'univers de votre maison",
      subtitle:
        "Chaque ambiance réunit cinq lectures : le salon, la chambre, la salle de bain, le guide du style, et notre comparatif des cinq meilleurs produits.",
    },
    articlesSection: {
      title: "Dernières sélections",
      subtitle: "Nos guides d'achat les plus récents, mis à jour régulièrement.",
      count: 4,
    },
    cta: {
      title: "Besoin d'un regard sur votre intérieur ?",
      subtitle:
        "Racontez-moi votre pièce en trois lignes. Je vous réponds avec une direction d'ambiance et une première sélection d'objets.",
      buttonLabel: "Écrire à Marius",
    },
  },
};
export type SiteConfig = typeof siteConfig;

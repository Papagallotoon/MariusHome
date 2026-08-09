export const siteConfig = {
  siteName: "Marius Dumas Home",
  siteTagline: "Inspirations & Bons Plans",
  // URL canonique unique du site, réutilisée par le sitemap, le JSON-LD et
  // llms.txt. Lue depuis une variable d'env (utile pour un déploiement de
  // preview Cloudflare Pages sur un sous-domaine *.pages.dev) avec repli
  // sur le domaine de production.
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://marius-home.com",
  description:
    "Par Marius Dumas, décorateur d'intérieur. Comparatifs, tendances et sélections d'objets de décoration pour créer un intérieur qui vous ressemble.",
  logo: { path: "/images/logo.png", width: 140, height: 40, useTextFallback: true },
  colors: {
    primary: "#4a5e4f",
    primaryDark: "#2d3b31",
    primaryLight: "#eef2ef",
    accent: "#C5A572",
    accentDark: "#A68B55",
    accentLight: "#f5efe4",
    gold: "#C5A572",
    goldLight: "#ddd0b5",
    goldDark: "#A68B55",
    secondary: "#8b7e9b",
    secondaryLight: "#f3f0f7",
    background: "#faf9f7",
    surface: "#ffffff",
    text: "#1a1714",
    textMuted: "#8c8580",
    border: "#e8e4df",
    footerBg: "#1a1714",
    footerText: "#b8b0a8",
    vivid: "#C1502E",
    vividDark: "#9c3f22",
    vividLight: "#f4e1d8",
  },
  amazon: { tag: "architectu071-21", marketplace: "fr" },
  seo: { titleSeparator: " | ", defaultAuthor: "Marius Dumas" },
  social: { twitter: "", pinterest: "", facebook: "" },
  homepage: {
    hero: {
      backgroundImage: "",
      backgroundOverlayOpacity: 0.7,
      title: "Créez un intérieur",
      titleAccent: "qui vous ressemble",
      subtitle:
        "Sélections tendances, comparatifs honnêtes et bons plans déco. Trouvez les plus beaux objets pour votre intérieur au meilleur prix.",
      ctaPrimary: { label: "Voir les catégories", href: "#categories" },
      ctaSecondary: { label: "Dernières sélections", href: "#articles" },
    },
    features: {
      items: [
        {
          title: "Sélections soignées",
          description:
            "Chaque produit est choisi pour son design, sa qualité et son rapport qualité-prix.",
        },
        {
          title: "Tendances 2026",
          description:
            "Nos recommandations suivent les dernières tendances déco : Pinterest, Instagram et salons.",
        },
        {
          title: "Meilleurs prix Amazon",
          description:
            "Liens directs vers les meilleures offres Amazon pour chaque objet déco recommandé.",
        },
      ],
    },
    categoriesSection: {
      title: "Nos univers déco",
      subtitle:
        "Explorez nos sélections par univers pour trouver l'inspiration et les objets parfaits pour votre intérieur.",
    },
    articlesSection: {
      title: "Dernières sélections",
      subtitle:
        "Nos guides d'achat les plus récents, mis à jour régulièrement.",
      count: 6,
    },
    cta: {
      title: "Besoin d'inspiration ?",
      subtitle:
        "Parcourez nos sélections déco pour trouver les objets tendance qui transformeront votre intérieur.",
      buttonLabel: "Explorer les univers déco",
    },
  },
};
export type SiteConfig = typeof siteConfig;

import { siteConfig } from "../../config/site";
import type { Product } from "@/types";

const domain = siteConfig.domain;
export const organizationId = `${domain}/#organization`;
export const websiteId = `${domain}/#website`;

// Socle global : une seule fois par page (voir layout.tsx), @id stables
// pour que WebPage/BreadcrumbList puissent y faire référence sans dupliquer
// les données. Pas de "logo" ni de "sameAs" : public/images/logo.png
// n'existe pas dans le dépôt et siteConfig.social est vide (aucun réseau
// social renseigné) - les inclure serait inventer des ressources.
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.siteName,
    url: domain,
    description: siteConfig.description,
    email: "Marius@viedelivres.fr",
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.siteName,
    url: domain,
    inLanguage: "fr-FR",
    publisher: { "@id": organizationId },
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

// WebPage + BreadcrumbList combinés en @graph pour une page de contenu.
// breadcrumbItems reflète la hiérarchie réelle de navigation (cf. les <nav>
// fil d'Ariane déjà affichés sur chaque page.tsx), pas une hiérarchie
// inventée séparément.
export function getPageJsonLd({
  url,
  name,
  description,
  breadcrumbItems,
}: {
  url: string;
  name: string;
  description?: string;
  breadcrumbItems: BreadcrumbItem[];
}) {
  const webPageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebPage",
      "@id": webPageId,
      url,
      name,
      ...(description ? { description } : {}),
      isPartOf: { "@id": websiteId },
      ...(breadcrumbItems.length > 0 ? { breadcrumb: { "@id": breadcrumbId } } : {}),
    },
  ];

  if (breadcrumbItems.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: breadcrumbItems.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

// Pages de comparatif/sélection : ItemList, PAS Product/Offer.
// Google réserve le balisage Product aux pages qui vendent réellement le
// produit ; ici les produits sont vendus ailleurs (Amazon), la page ne fait
// que comparer. Chaque item pointe vers son ancre sur CETTE page (contenu
// dont on est l'auteur), pas vers un prix Amazon non stable qu'on ne
// contrôle pas. Aucun prix/note n'est répété ici : ils sont déjà affichés
// en HTML aux visiteurs, mais on ne les fige pas dans un balisage typé
// comme faisant foi pour les moteurs.
export function getItemListJsonLd({
  url,
  name,
  products,
}: {
  url: string;
  name: string;
  products: Product[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${url}#produit-${i + 1}`,
    })),
  };
}

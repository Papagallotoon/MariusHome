import data from "@/data/bibliotheque.json";

export type Livre = {
  slug: string;
  ratio: number;
  titre: string;
  sousTitre: string;
  prix: string;
  pages: number;
  extrait: number;
  categorie: string;
  intro: string;
  contenu: string[];
  gumroad: string;
  etsy: string;
};

export const BOUTIQUE = data.boutique as { etsy: string; gumroad: string };
export const CATEGORIES = data.categories as Record<string, string>;
export const LIVRES = data.livres as Livre[];

export function getLivre(slug: string): Livre | undefined {
  return LIVRES.find((l) => l.slug === slug);
}

export const imgLivre = (slug: string, fichier: string) => `/bibliotheque/livres/${slug}/${fichier}`;

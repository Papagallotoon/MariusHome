import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "../../../../config/site";
import { BOUTIQUE, LIVRES, getLivre } from "@/lib/bibliotheque";
import Liseuse from "@/components/bibliotheque/Liseuse";

export const dynamicParams = false;

export function generateStaticParams() {
  return LIVRES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const l = getLivre(slug);
  if (!l) return {};
  const url = `${siteConfig.domain}/bibliotheque/${l.slug}`;
  return {
    title: `${l.titre} – feuilleter l'extrait`,
    description: `${l.sousTitre}. ${l.intro}`.slice(0, 158),
    alternates: { canonical: url },
    openGraph: { title: l.titre, description: l.intro, url, images: [`/bibliotheque/livres/${l.slug}/couverture.jpg`] },
  };
}

export default async function LivrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const livre = getLivre(slug);
  if (!livre) notFound();
  return <Liseuse livre={livre} boutique={BOUTIQUE} />;
}

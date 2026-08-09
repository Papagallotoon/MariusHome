import type { Metadata } from "next";
import { siteConfig } from "../../../config/site";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

const pageDescription = `En savoir plus sur ${siteConfig.siteName}, votre guide déco de confiance.`;

export const metadata: Metadata = {
  title: "À propos",
  description: pageDescription,
};

export default function AboutPage() {
  const pageUrl = `${siteConfig.domain}/a-propos`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: `À propos de ${siteConfig.siteName}`,
          description: pageDescription,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: "À propos", url: pageUrl },
          ],
        })}
      />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${siteConfig.colors.primaryDark}, ${siteConfig.colors.primary})` }}
      >
        <div
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(60px)" }}
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">À propos</span>
          </nav>
          <span className="kicker kicker-light mb-4">L&apos;équipe éditoriale</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif">À propos de {siteConfig.siteName}</h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose-content">
          <h2>Qui suis-je ?</h2>
          <p>
            Je m&apos;appelle <strong>Marius Dumas</strong>, décorateur d&apos;intérieur passionné depuis plus de 8 ans.
            Après des études en design d&apos;espace à Lyon et plusieurs années passées à aménager des appartements,
            des maisons et des espaces professionnels, j&apos;ai décidé de partager mon expertise au plus grand nombre.
          </p>
          <p>
            Mon quotidien ? Chiner les meilleures pièces déco, tester des dizaines de produits et comparer
            ce qui se fait de mieux sur le marché. Que ce soit dans les salons professionnels comme Maison &amp; Objet,
            sur Pinterest ou directement chez mes clients, j&apos;ai l&apos;oeil pour repérer les objets qui font la différence
            dans un intérieur.
          </p>

          <h2>Pourquoi {siteConfig.siteName} ?</h2>
          <p>
            J&apos;ai créé {siteConfig.siteName} après un constat simple : mes clients et mes proches me posaient
            toujours les mêmes questions &mdash; &laquo;&nbsp;Quel vase choisir ?&nbsp;&raquo;, &laquo;&nbsp;C&apos;est quoi
            la meilleure bougie parfumée ?&nbsp;&raquo;, &laquo;&nbsp;Comment décorer sans se ruiner ?&nbsp;&raquo;.
            Plutôt que de répéter les mêmes conseils, j&apos;ai décidé de créer des comparatifs détaillés,
            honnêtes et régulièrement mis à jour pour aider tout le monde à trouver les bons produits.
          </p>

          <h2>Comment je travaille</h2>
          <p>
            Chaque produit présenté dans mes sélections est analysé selon des critères que j&apos;utilise
            au quotidien en tant que décorateur : le design, la qualité des matériaux, le rapport qualité-prix,
            les tendances actuelles et les retours d&apos;acheteurs vérifiés. Je ne recommande que ce que
            je conseillerais à mes propres clients.
          </p>

          <h2>Transparence et financement</h2>
          <p>
            {siteConfig.siteName} est un site totalement indépendant. Pour financer mon travail de recherche
            et de rédaction, j&apos;utilise des liens d&apos;affiliation vers Amazon. Si vous achetez un produit
            en suivant un de mes liens, je reçois une petite commission, sans aucun surcoût pour vous.
          </p>
          <p>
            <strong>Important :</strong> cette affiliation n&apos;influence jamais mes recommandations.
            Je recommande uniquement les produits que je juge les plus beaux et les plus qualitatifs
            dans leur catégorie. Ma crédibilité est mon atout le plus précieux.
          </p>

          <h2>Mention légale Amazon</h2>
          <p>
            En tant que Partenaire Amazon, {siteConfig.siteName} réalise un bénéfice sur les achats
            remplissant les conditions requises. Les prix affichés sur ce site sont donnés
            à titre indicatif et peuvent varier. Le prix en vigueur est celui affiché sur Amazon.fr
            au moment de l&apos;achat.
          </p>

          <h2>Me contacter</h2>
          <p>
            Une question, une suggestion ou un partenariat ? Écrivez-moi à{" "}
            <a href="mailto:Marius@viedelivres.fr" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>
              Marius@viedelivres.fr
            </a>
          </p>
        </div>

        <div className="mt-12 text-center pt-8 border-t border-site-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide editorial-link"
            style={{ color: siteConfig.colors.vivid }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </>
  );
}

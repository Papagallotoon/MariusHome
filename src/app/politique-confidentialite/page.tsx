import type { Metadata } from "next";
import { siteConfig } from "../../../config/site";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

const pageDescription = `Politique de confidentialité et protection des données du site ${siteConfig.siteName}.`;

export const metadata: Metadata = {
  title: "Politique de Confidentialité",
  description: pageDescription,
};

export default function PolitiqueConfidentialitePage() {
  const pageUrl = `${siteConfig.domain}/politique-confidentialite`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: "Politique de Confidentialité",
          description: pageDescription,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: "Politique de Confidentialité", url: pageUrl },
          ],
        })}
      />
      <section
        className="py-12 md:py-16"
        style={{ background: `linear-gradient(135deg, ${siteConfig.colors.primaryDark}, ${siteConfig.colors.primary})` }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Politique de Confidentialité</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Politique de Confidentialité</h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose-content">
          <h2>1. Introduction</h2>
          <p>
            La présente politique de confidentialité décrit comment {siteConfig.siteName} ({siteConfig.domain})
            collecte, utilise et protège les données personnelles des visiteurs de son site web,
            conformément au Règlement Général sur la Protection des Données (RGPD).
          </p>

          <h2>2. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données est l&apos;éditeur du site {siteConfig.siteName}.
          </p>
          <ul>
            <li><strong>Email de contact :</strong> Marius@viedelivres.fr</li>
          </ul>

          <h2>3. Données collectées</h2>
          <p>
            Le site {siteConfig.siteName} est un site statique. Nous collectons un minimum
            de données personnelles :
          </p>
          <ul>
            <li>
              <strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées,
              date et heure de visite (via les cookies d&apos;analyse si activés).
            </li>
            <li>
              <strong>Cookies tiers :</strong> Amazon peut déposer des cookies lorsque vous cliquez
              sur un lien d&apos;affiliation, conformément à leur propre politique de confidentialité.
            </li>
          </ul>

          <h2>4. Utilisation des cookies</h2>
          <p>Notre site peut utiliser les types de cookies suivants :</p>
          <ul>
            <li>
              <strong>Cookies essentiels :</strong> nécessaires au fonctionnement du site (aucune
              donnée personnelle collectée).
            </li>
            <li>
              <strong>Cookies d&apos;affiliation Amazon :</strong> lorsque vous cliquez sur un lien
              Amazon, un cookie est déposé pour identifier notre site comme source du trafic.
              Ce cookie est géré par Amazon selon sa propre politique de confidentialité.
            </li>
            <li>
              <strong>Cookies publicitaires (Google AdSense) :</strong> notre site utilise Google
              AdSense pour afficher des annonces publicitaires. Google et ses partenaires peuvent
              utiliser des cookies pour diffuser des annonces basées sur vos visites antérieures
              sur ce site ou sur d&apos;autres sites. Vous pouvez désactiver la publicité personnalisée
              en consultant les{" "}
              <a href="https://www.google.com/settings/ads" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>
                Paramètres des annonces Google
              </a>.
            </li>
            <li>
              <strong>Cookies d&apos;analyse (Google Analytics) :</strong> nous utilisons Google Analytics
              pour comprendre comment les visiteurs utilisent le site (pages les plus visitées, durée
              de visite, etc.). Ces données sont anonymisées. Vous pouvez en savoir plus sur la façon
              dont Google utilise vos données en consultant la{" "}
              <a href="https://policies.google.com/privacy" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>
                Politique de confidentialité de Google
              </a>.
            </li>
          </ul>

          <h2>5. Partage des données</h2>
          <p>
            Nous ne vendons, n&apos;échangeons et ne transférons pas vos données personnelles
            à des tiers, sauf dans les cas suivants :
          </p>
          <ul>
            <li>Obligation légale (demande des autorités compétentes).</li>
            <li>Prestataires techniques (hébergeur) qui traitent les données pour notre compte.</li>
          </ul>

          <h2>6. Durée de conservation</h2>
          <p>
            Les données de navigation collectées via les cookies d&apos;analyse sont conservées
            pour une durée maximale de 13 mois, conformément aux recommandations de la CNIL.
          </p>

          <h2>7. Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul>
            <li><strong>Droit d&apos;accès :</strong> obtenir la confirmation que des données vous concernant sont traitées.</li>
            <li><strong>Droit de rectification :</strong> demander la correction de données inexactes.</li>
            <li><strong>Droit à l&apos;effacement :</strong> demander la suppression de vos données.</li>
            <li><strong>Droit d&apos;opposition :</strong> vous opposer au traitement de vos données.</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré.</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à :{" "}
            <a href="mailto:Marius@viedelivres.fr" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>
              Marius@viedelivres.fr
            </a>
          </p>

          <h2>8. Sécurité</h2>
          <p>
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriées
            pour protéger vos données contre l&apos;accès non autorisé, la modification, la divulgation
            ou la destruction. Le site utilise le protocole HTTPS pour sécuriser les échanges.
          </p>

          <h2>9. Liens vers des sites tiers</h2>
          <p>
            Notre site contient des liens vers des sites tiers (notamment Amazon.fr). Nous ne sommes
            pas responsables des pratiques de confidentialité de ces sites. Nous vous invitons à
            consulter leurs politiques de confidentialité respectives.
          </p>

          <h2>10. Modifications</h2>
          <p>
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
            Toute modification sera publiée sur cette page avec la date de mise à jour.
          </p>

          <h2>11. Contact</h2>
          <p>
            Pour toute question relative à cette politique de confidentialité, vous pouvez nous
            contacter à :{" "}
            <a href="mailto:Marius@viedelivres.fr" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>
              Marius@viedelivres.fr
            </a>
          </p>
          <p>
            Vous pouvez également adresser une réclamation à la CNIL :{" "}
            <a href="https://www.cnil.fr" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>
              www.cnil.fr
            </a>
          </p>

          <p className="text-sm text-text-muted mt-8">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
            style={{ color: siteConfig.colors.primary }}
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

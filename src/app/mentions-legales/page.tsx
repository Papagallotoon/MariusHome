import type { Metadata } from "next";
import { siteConfig } from "../../../config/site";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

const pageDescription = `Mentions légales du site ${siteConfig.siteName}.`;

export const metadata: Metadata = {
  title: "Mentions Légales",
  description: pageDescription,
};

export default function MentionsLegalesPage() {
  const pageUrl = `${siteConfig.domain}/mentions-legales`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: "Mentions Légales",
          description: pageDescription,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: "Mentions Légales", url: pageUrl },
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
            <span className="text-white">Mentions Légales</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Mentions Légales</h1>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose-content">
          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>{siteConfig.siteName}</strong> accessible à l&apos;adresse{" "}
            <strong>{siteConfig.domain}</strong> est édité par :
          </p>
          <ul>
            <li><strong>Nom :</strong> Marius Dumas</li>
            <li><strong>Statut :</strong> Particulier / Auto-entrepreneur</li>
            <li><strong>Email :</strong> <a href="mailto:Marius@viedelivres.fr" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>Marius@viedelivres.fr</a></li>
            <li><strong>Directeur de la publication :</strong> Marius Dumas</li>
          </ul>

          <h2>2. Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul>
            <li><strong>Hébergeur :</strong> Cloudflare, Inc.</li>
            <li><strong>Adresse :</strong> 101 Townsend Street, San Francisco, CA 94107, États-Unis</li>
            <li><strong>Site web :</strong> <a href="https://www.cloudflare.com" className="font-medium underline" style={{ color: siteConfig.colors.primary }}>www.cloudflare.com</a></li>
          </ul>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L&apos;ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, etc.) est protégé
            par le droit d&apos;auteur et le droit de la propriété intellectuelle. Toute reproduction,
            représentation, modification, publication ou adaptation de tout ou partie des éléments
            du site est interdite sans autorisation écrite préalable.
          </p>

          <h2>4. Liens d&apos;affiliation</h2>
          <p>
            {siteConfig.siteName} participe au Programme Partenaires d&apos;Amazon EU, un programme
            d&apos;affiliation conçu pour permettre à des sites de percevoir une rémunération grâce
            à la création de liens vers Amazon.fr.
          </p>
          <p>
            Lorsque vous cliquez sur un lien vers un produit Amazon présent sur notre site et que
            vous effectuez un achat, nous percevons une commission sur cette vente. Cela n&apos;engendre
            aucun surcoût pour vous. Ces commissions nous permettent de financer le fonctionnement
            du site et la création de nouveaux contenus.
          </p>

          <h2>5. Responsabilité</h2>
          <p>
            Les informations fournies sur {siteConfig.siteName} le sont à titre indicatif et ne
            sauraient engager la responsabilité de l&apos;éditeur. Les prix mentionnés sont indicatifs
            et peuvent varier. Le prix en vigueur est celui affiché sur le site marchand au moment
            de l&apos;achat.
          </p>
          <p>
            L&apos;éditeur ne peut être tenu responsable des dommages directs ou indirects résultant
            de l&apos;utilisation du site ou de l&apos;impossibilité d&apos;y accéder.
          </p>

          <h2>6. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens vers d&apos;autres sites internet. L&apos;éditeur n&apos;exerce
            aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu
            ou leurs pratiques en matière de protection des données personnelles.
          </p>

          <h2>7. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige,
            les tribunaux français seront seuls compétents.
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

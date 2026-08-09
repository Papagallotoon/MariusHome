import type { Metadata } from "next";
import Link from "next/link";
import { getAllAmbiances } from "@/lib/ambiances";
import { siteConfig } from "../../../config/site";
import AmbianceCard from "@/components/AmbianceCard";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

const pageDescription =
  "Explorez nos 6 ambiances déco : Japon, Bohème, Bali, Provençal, Industriel et Indien. Chaque style décliné en Salon, Salle de bain et Chambre avec nos sélections de produits.";

export const metadata: Metadata = {
  title: `Nos Ambiances Déco | ${siteConfig.siteName}`,
  description: pageDescription,
  openGraph: {
    title: `Nos Ambiances Déco | ${siteConfig.siteName}`,
    description: "Explorez nos 6 ambiances déco : Japon, Bohème, Bali, Provençal, Industriel et Indien.",
    url: `${siteConfig.domain}/ambiances`,
    type: "website",
  },
};

export default function AmbiancesHubPage() {
  const ambiances = getAllAmbiances();

  const pageUrl = `${siteConfig.domain}/ambiances`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: "Nos Ambiances Déco",
          description: pageDescription,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: "Ambiances", url: pageUrl },
          ],
        })}
      />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${siteConfig.colors.primaryDark}, ${siteConfig.colors.primary})` }}
      >
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(70px)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">Ambiances</span>
          </nav>
          <span className="kicker kicker-light mb-4">Styles &amp; ambiances</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif max-w-2xl">Nos Ambiances Déco</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">
            Explorez nos univers déco soigneusement sélectionnés. Chaque ambiance est déclinée en 3 pièces avec nos meilleures recommandations produits.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-site-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {ambiances.map((ambiance) => (
              <AmbianceCard key={ambiance.slug} ambiance={ambiance} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

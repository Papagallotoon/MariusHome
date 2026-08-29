import Link from "next/link";
import { siteConfig } from "../../config/site";

const categories = [
  { name: "Guides & Inspirations", slug: "guides-inspirations" },
  { name: "Bougies & Parfums", slug: "bougies-parfums" },
  { name: "Coussins & Textiles", slug: "coussins-textiles" },
  { name: "Luminaires & Éclairage", slug: "luminaires-eclairage" },
  { name: "Art Mural & Cadres", slug: "art-mural-cadres" },
  { name: "Vases & Plantes", slug: "vases-plantes-deco" },
  { name: "Best-Sellers", slug: "best-sellers" },
  { name: "Ambiances & Styles", slug: "ambiances" },
];

export default function Footer() {
  return (
    <footer style={{ background: siteConfig.colors.footerBg, color: siteConfig.colors.footerText, borderTop: `3px solid ${siteConfig.colors.vivid}` }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 font-serif">{siteConfig.siteName}</h3>
            <span className="rule-vivid block mb-3 sm:mb-4" />
            <p className="text-[13px] sm:text-sm leading-relaxed" style={{ color: siteConfig.colors.footerText }}>
              {siteConfig.description}
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-[11px] uppercase tracking-[0.16em] mb-3 sm:mb-4">Catégories</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="text-[13px] sm:text-sm hover:text-white transition-colors editorial-link" style={{ color: siteConfig.colors.footerText }}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-[11px] uppercase tracking-[0.16em] mb-3 sm:mb-4">Informations</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li>
                <Link href="/a-propos" className="text-[13px] sm:text-sm hover:text-white transition-colors editorial-link" style={{ color: siteConfig.colors.footerText }}>
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-[13px] sm:text-sm hover:text-white transition-colors editorial-link" style={{ color: siteConfig.colors.footerText }}>
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-[13px] sm:text-sm hover:text-white transition-colors editorial-link" style={{ color: siteConfig.colors.footerText }}>
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[13px] sm:text-sm hover:text-white transition-colors editorial-link" style={{ color: siteConfig.colors.footerText }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-white font-semibold text-[11px] uppercase tracking-[0.16em] mb-3 sm:mb-4">Contact</h4>
            <p className="text-[13px] sm:text-sm" style={{ color: siteConfig.colors.footerText }}>
              <a
                href="mailto:Marius@viedelivres.fr"
                className="hover:text-white transition-colors editorial-link"
              >
                Marius@viedelivres.fr
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
          <p className="text-[11px] sm:text-xs text-center leading-relaxed" style={{ color: siteConfig.colors.footerText }}>
            En tant que Partenaire Amazon, ce site réalise un bénéfice sur les achats remplissant les conditions requises.
            Les prix affichés sont indicatifs et peuvent varier.
          </p>
          <p className="text-[11px] sm:text-xs text-center mt-2 opacity-60">
            &copy; {new Date().getFullYear()} {siteConfig.siteName}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

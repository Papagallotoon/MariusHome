import Link from "next/link";
import { siteConfig } from "../../config/site";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-6xl font-black" style={{ color: siteConfig.colors.primary }}>404</p>
        <h1 className="mt-4 text-2xl font-bold text-site-text">Page introuvable</h1>
        <p className="mt-2 text-text-muted">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 affiliate-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

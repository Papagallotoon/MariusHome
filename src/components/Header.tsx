"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { siteConfig } from "../../config/site";
import { AmbianceMegaMenuDesktop, AmbianceMobileSection } from "./AmbianceMegaMenu";

const categories = [
  { name: "Guides & Inspirations", slug: "guides-inspirations" },
  { name: "Bougies & Parfums", slug: "bougies-parfums" },
  { name: "Coussins & Textiles", slug: "coussins-textiles" },
  { name: "Luminaires & Éclairage", slug: "luminaires-eclairage" },
  { name: "Art Mural & Cadres", slug: "art-mural-cadres" },
  { name: "Vases & Plantes", slug: "vases-plantes-deco" },
  { name: "Best-Sellers", slug: "best-sellers" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = useCallback(() => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setMegaOpen(true);
  }, []);

  const closeMega = useCallback(() => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 150);
  }, []);

  return (
    <header style={{ background: siteConfig.colors.primaryDark, borderBottom: `2px solid ${siteConfig.colors.vivid}` }} className="sticky top-0 z-50 shadow-lg">
      {/* Row 1: Logo + utility links + hamburger */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Logo size={36} />
          </Link>
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/a-propos"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 hover:text-white transition-colors"
            >
              À propos
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link
              href="/contact"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 hover:text-white transition-colors"
            >
              Contact
            </Link>
          </div>
          <button
            className="md:hidden p-2.5 -mr-1 text-white/80 hover:text-white active:bg-white/10 rounded-lg transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Row 2: Category nav — editorial uppercase links (desktop) */}
      <nav className="hidden md:block border-t border-white/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 lg:gap-6 py-2.5 flex-wrap">
            {/* Ambiances dropdown button */}
            <div
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                className="text-[11px] lg:text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/85 hover:text-white transition-all inline-flex items-center gap-1"
                onClick={() => setMegaOpen(!megaOpen)}
              >
                Ambiances
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={siteConfig.colors.gold}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className={`transition-transform ${megaOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <span className="w-1 h-1 rounded-full bg-white/15" />
            {categories.map((c, i) => (
              <div key={c.slug} className="flex items-center gap-4 lg:gap-6">
                <Link
                  href={`/${c.slug}`}
                  className="text-[11px] lg:text-[11.5px] font-semibold uppercase tracking-[0.12em] text-white/85 hover:text-white transition-all whitespace-nowrap editorial-link"
                >
                  {c.name}
                </Link>
                {i < categories.length - 1 && <span className="w-1 h-1 rounded-full bg-white/15" />}
              </div>
            ))}
          </div>
        </div>
        {/* Mega menu dropdown */}
        {megaOpen && (
          <div
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <AmbianceMegaMenuDesktop onClose={() => setMegaOpen(false)} />
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/10 animate-slide-down max-h-[80vh] overflow-y-auto overscroll-contain">
          <div className="px-3 py-2 space-y-0.5">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-white/90 hover:text-white active:bg-white/15 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: siteConfig.colors.vivid }} />
                {c.name}
              </Link>
            ))}
            <AmbianceMobileSection onClose={() => setOpen(false)} />
            <div className="border-t border-white/10 mt-2 pt-2 flex gap-2">
              <Link
                href="/a-propos"
                className="flex-1 text-center px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white active:bg-white/15 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                À propos
              </Link>
              <Link
                href="/contact"
                className="flex-1 text-center px-3 py-2.5 text-sm font-medium text-white/50 hover:text-white active:bg-white/15 hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

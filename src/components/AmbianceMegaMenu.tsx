"use client";
import { useState } from "react";
import Link from "next/link";

interface MegaMenuAmbiance {
  name: string;
  slug: string;
  color: string;
  rooms: { name: string; slug: string }[];
}

const ambiances: MegaMenuAmbiance[] = [
  { name: "Japon", slug: "japon", color: "#8B7355", rooms: [{ name: "Salon", slug: "salon" }, { name: "Salle de bain", slug: "salle-de-bain" }, { name: "Chambre", slug: "chambre" }] },
  { name: "Bohème", slug: "boheme", color: "#C2785C", rooms: [{ name: "Salon", slug: "salon" }, { name: "Salle de bain", slug: "salle-de-bain" }, { name: "Chambre", slug: "chambre" }] },
  { name: "Bali", slug: "bali", color: "#5B8C5A", rooms: [{ name: "Salon", slug: "salon" }, { name: "Salle de bain", slug: "salle-de-bain" }, { name: "Chambre", slug: "chambre" }] },
  { name: "Provençal", slug: "provencal", color: "#9B7EB4", rooms: [{ name: "Salon", slug: "salon" }, { name: "Salle de bain", slug: "salle-de-bain" }, { name: "Chambre", slug: "chambre" }] },
  { name: "Industriel", slug: "industriel", color: "#6B6B6B", rooms: [{ name: "Salon", slug: "salon" }, { name: "Salle de bain", slug: "salle-de-bain" }, { name: "Chambre", slug: "chambre" }] },
  { name: "Indien", slug: "indien", color: "#C4532E", rooms: [{ name: "Salon", slug: "salon" }, { name: "Salle de bain", slug: "salle-de-bain" }, { name: "Chambre", slug: "chambre" }] },
];

export function AmbianceMegaMenuDesktop({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute left-0 right-0 top-full z-50 bg-white shadow-2xl border-t border-gray-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
          {ambiances.map((a) => (
            <div key={a.slug}>
              <Link
                href={`/ambiances/${a.slug}`}
                className="flex items-center gap-2 mb-3 group"
                onClick={onClose}
              >
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: a.color }}
                />
                <span className="font-bold text-sm text-gray-800 group-hover:text-gray-600 transition-colors">
                  {a.name}
                </span>
              </Link>
              <div className="space-y-1.5">
                {a.rooms.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/ambiances/${a.slug}/${r.slug}`}
                    className="block text-xs text-gray-500 hover:text-gray-800 transition-colors pl-5"
                    onClick={onClose}
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <Link
            href="/ambiances"
            className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-vivid-dark hover:text-vivid transition-colors"
            onClick={onClose}
          >
            Toutes les ambiances
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AmbianceMobileSection({ onClose }: { onClose: () => void }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <div className="border-t border-white/10 mt-1 pt-1">
      <div className="px-3 py-1.5 text-xs font-semibold text-white/40 uppercase tracking-wider">
        Ambiances
      </div>
      {ambiances.map((a) => (
        <div key={a.slug}>
          <button
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-md"
            onClick={() => setOpenSlug(openSlug === a.slug ? null : a.slug)}
          >
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: a.color }} />
              {a.name}
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className={`transition-transform ${openSlug === a.slug ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {openSlug === a.slug && (
            <div className="pl-8 pb-1 space-y-0.5">
              {a.rooms.map((r) => (
                <Link
                  key={r.slug}
                  href={`/ambiances/${a.slug}/${r.slug}`}
                  className="block px-3 py-1.5 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-md"
                  onClick={onClose}
                >
                  {r.name}
                </Link>
              ))}
              <Link
                href={`/ambiances/${a.slug}`}
                className="block px-3 py-1.5 text-xs font-semibold text-white/40 hover:text-white hover:bg-white/10 rounded-md"
                onClick={onClose}
              >
                Voir tout &rarr;
              </Link>
            </div>
          )}
        </div>
      ))}
      <Link
        href="/ambiances"
        className="block px-3 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 rounded-md"
        onClick={onClose}
      >
        Toutes les ambiances &rarr;
      </Link>
    </div>
  );
}

"use client";
import { useState } from "react";
import type { Product } from "@/types";
import Rating from "./Rating";
import AffiliateButton from "./AffiliateButton";
import PlaceholderImage from "./PlaceholderImage";

const badgeClasses: Record<string, string> = {
  "Meilleur Choix": "badge-best",
  "Meilleur Rapport": "badge-value",
  "Choix Premium": "badge-premium",
  "Choix Éco": "badge-eco",
  "Choix Classique": "badge-value",
  "Choix Robuste": "badge-best",
  "Choix Anti": "badge-eco",
  "Meilleur Gros": "badge-premium",
  "Meilleur UL": "badge-value",
  "Premium Accessible": "badge-premium",
};

function getBadgeClass(badge: string): string {
  for (const [key, cls] of Object.entries(badgeClasses)) {
    if (badge.includes(key)) return cls;
  }
  return "badge-best";
}

export default function ProductCard({ product, rank }: { product: Product; rank: number }) {
  const [imgError, setImgError] = useState(false);
  const hasValidImage = product.image && !product.image.includes("placeholder") && !imgError;

  return (
    <div className="rounded-xl border border-site-border bg-surface shadow-sm overflow-hidden">
      {/* Mobile: stacked layout / Desktop: side-by-side */}
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative md:w-64 flex-shrink-0">
          <div className="h-52 sm:h-56 md:h-full min-h-[200px]">
            {hasValidImage ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-contain bg-white p-3" onError={() => setImgError(true)} />
            ) : (
              <PlaceholderImage type="product" label={product.name} className="w-full h-full" />
            )}
          </div>
          <span className="absolute top-3 left-3 w-8 h-8 md:w-9 md:h-9 rounded-full bg-vivid text-white flex items-center justify-center text-xs md:text-sm font-black shadow-md font-serif">
            {rank}
          </span>
        </div>

        <div className="flex-1 p-4 sm:p-5 md:p-6">
          {/* Badge + Price row */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`${getBadgeClass(product.badge)} text-[11px] sm:text-xs font-bold text-white px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap`}>
              {product.badge}
            </span>
            <span className="text-sm font-bold text-accent ml-auto">{product.price}</span>
          </div>

          <h3 className="text-base sm:text-lg md:text-xl font-bold text-site-text mb-1.5 leading-snug font-serif">{product.name}</h3>

          <Rating value={product.rating} />

          <p className="mt-2 text-[13px] sm:text-sm text-text-muted leading-relaxed line-clamp-3 md:line-clamp-none">{product.description}</p>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 sm:mt-4">
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-green-700 mb-1.5">Avantages</h4>
              <ul className="space-y-1">
                {product.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[13px] sm:text-sm text-site-text">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-red-700 mb-1.5">Inconvénients</h4>
              <ul className="space-y-1">
                {product.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[13px] sm:text-sm text-site-text">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <AffiliateButton asin={product.amazonAsin} affiliateUrl={product.affiliateUrl} />
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Category } from "@/types";
import PlaceholderImage from "./PlaceholderImage";

export default function CategoryCard({
  category,
  variant = "grid",
}: {
  category: Category;
  variant?: "grid" | "feature";
}) {
  const hasImage = category.image && !category.image.includes("placeholder");
  const isFeature = variant === "feature";
  // "Ambiances & Styles" est piloté par son propre système (content/ambiances.json)
  // et vit sur /ambiances, pas sur /ambiances-styles (qui n'a pas de contenu).
  const href = category.slug === "ambiances-styles" ? "/ambiances" : `/${category.slug}`;

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden border border-site-border bg-surface luxury-card ${
        isFeature ? "rounded-sm h-full" : "rounded-xl hover:-translate-y-1 shadow-sm"
      }`}
    >
      <div className={`relative overflow-hidden ${isFeature ? "h-full min-h-64 sm:min-h-80 lg:min-h-[26rem]" : "h-32 sm:h-40 lg:h-44"}`}>
        {hasImage ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage
            type={category.slug}
            className="w-full h-full"
            bgColor={`${category.color}22`}
          />
        )}
        <div
          className={`absolute inset-0 flex items-end ${isFeature ? "p-5 sm:p-8 lg:p-10" : "p-3 sm:p-4 lg:p-5"}`}
          style={{ background: `linear-gradient(to top, ${category.color}ee 0%, ${category.color}44 60%, transparent 100%)` }}
        >
          <div>
            {isFeature && <span className="kicker kicker-light mb-2 sm:mb-3">Univers déco</span>}
            <h3 className={`font-bold text-white font-serif leading-snug ${isFeature ? "text-2xl sm:text-3xl lg:text-4xl" : "text-base sm:text-lg lg:text-xl"}`}>
              {category.name}
            </h3>
            <p className={`text-white/80 ${isFeature ? "mt-2 text-sm sm:text-base max-w-md" : "mt-0.5 sm:mt-1 text-[11px] sm:text-xs lg:text-sm line-clamp-2"}`}>
              {category.description}
            </p>
            {isFeature && (
              <span className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-white text-xs sm:text-sm font-semibold uppercase tracking-[0.12em]">
                Découvrir la sélection
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

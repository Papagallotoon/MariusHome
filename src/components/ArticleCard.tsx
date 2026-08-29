import Link from "next/link";
import type { Article } from "@/types";
import PlaceholderImage from "./PlaceholderImage";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function ArticleCard({
  article,
  variant = "grid",
  index,
}: {
  article: Article;
  variant?: "grid" | "feature" | "row";
  index?: number;
}) {
  const hasImage = article.image && !article.image.includes("placeholder");

  if (variant === "feature") {
    return (
      <Link
        href={`/${article.category}/${article.slug}`}
        className="group grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-sm border border-site-border bg-surface luxury-card"
      >
        <div className="relative h-56 sm:h-72 lg:h-full overflow-hidden order-1">
          {hasImage ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage type={article.category} label={article.title} className="w-full h-full" />
          )}
        </div>
        <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10 order-2">
          <span className="kicker mb-3">{article.category.replace(/-/g, " ")}</span>
          <h3 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-site-text group-hover:text-primary transition-colors font-serif leading-snug">
            {article.title}
          </h3>
          <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed line-clamp-3">{article.excerpt}</p>
          <div className="mt-5 flex items-center gap-4 text-[11px] sm:text-xs text-text-muted uppercase tracking-wide">
            <span>{formatDate(article.date)}</span>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-vivid">
            Lire le comparatif
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "row") {
    return (
      <Link
        href={`/${article.category}/${article.slug}`}
        className="group flex items-center gap-4 sm:gap-6 py-4 sm:py-5 border-b border-site-border last:border-b-0"
      >
        {typeof index === "number" && (
          <span className="mag-index text-2xl sm:text-3xl flex-shrink-0 w-8 sm:w-10">
            {String(index).padStart(2, "0")}
          </span>
        )}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-sm">
          {hasImage ? (
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage type={article.category} className="w-full h-full" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-vivid">
            {article.category.replace(/-/g, " ")}
          </span>
          <h3 className="mt-0.5 text-sm sm:text-base font-bold text-site-text group-hover:text-primary transition-colors line-clamp-2 font-serif leading-snug">
            {article.title}
          </h3>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="hidden sm:block flex-shrink-0 text-text-muted transition-transform group-hover:translate-x-1">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      className="group block overflow-hidden rounded-xl border border-site-border bg-surface shadow-sm luxury-card hover:-translate-y-1"
    >
      {hasImage ? (
        <div className="relative h-40 sm:h-44 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <PlaceholderImage
          type={article.category}
          label={article.title}
          className="h-40 sm:h-44"
        />
      )}
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-vivid">
            {article.category.replace(/-/g, " ")}
          </span>
          <span className="text-[11px] sm:text-xs text-text-muted">
            {formatDate(article.date)}
          </span>
        </div>
        <h3 className="text-[15px] sm:text-lg font-bold text-site-text group-hover:text-primary transition-colors line-clamp-2 font-serif leading-snug">
          {article.title}
        </h3>
        <p className="mt-1.5 text-[13px] sm:text-sm text-text-muted line-clamp-2">{article.excerpt}</p>
        <div className="mt-3 flex items-center gap-1 text-[13px] sm:text-sm font-medium text-primary">
          Lire le comparatif
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-hover:translate-x-1">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

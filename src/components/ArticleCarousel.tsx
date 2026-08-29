"use client";

import { useRef } from "react";
import type { Article } from "@/types";
import ArticleCard from "./ArticleCard";

export default function ArticleCarousel({ articles }: { articles: Article[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("[data-carousel-item]") as HTMLElement | null;
    const amount = card ? card.offsetWidth + 20 : 320;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {articles.map((article) => (
          <div
            key={article.slug}
            data-carousel-item
            className="snap-start flex-shrink-0 w-[78%] xs:w-[65%] sm:w-[46%] lg:w-[31%]"
          >
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      {/* Nav arrows */}
      <div className="flex items-center justify-end gap-2 mt-5 sm:mt-6">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Article précédent"
          className="w-10 h-10 rounded-full border border-site-border bg-surface flex items-center justify-center text-site-text hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Article suivant"
          className="w-10 h-10 rounded-full border border-site-border bg-surface flex items-center justify-center text-site-text hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

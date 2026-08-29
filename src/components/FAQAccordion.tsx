"use client";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-sm border border-site-border bg-surface overflow-hidden transition-colors"
            style={isOpen ? { borderLeft: "3px solid var(--site-vivid)" } : undefined}
          >
            <button
              className="w-full flex items-center justify-between px-4 py-4 sm:p-4 text-left font-semibold text-site-text hover:bg-gray-50 transition-colors font-serif"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{item.question}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isOpen ? "var(--site-vivid)" : "currentColor"}
                strokeWidth="2"
                strokeLinecap="round"
                className={`flex-shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 text-base sm:text-sm text-text-muted leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

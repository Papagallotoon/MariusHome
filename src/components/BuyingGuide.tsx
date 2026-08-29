export default function BuyingGuide({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-sm border border-site-border bg-primary-light/30 p-4 sm:p-6 md:p-8" style={{ borderTop: "2px solid var(--site-vivid)" }}>
      <span className="kicker mb-3">Guide d&apos;achat</span>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-vivid flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-site-text font-serif">{title}</h2>
      </div>
      <div className="prose-content text-site-text" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

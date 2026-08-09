import { getAffiliateUrl } from "@/lib/affiliate";

export default function AffiliateButton({
  asin,
  affiliateUrl,
  label = "Voir le prix sur Amazon",
}: {
  asin?: string;
  affiliateUrl?: string;
  label?: string;
}) {
  const href = affiliateUrl || (asin ? getAffiliateUrl(asin) : "#");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="affiliate-btn"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
        <path d="M.045 18.02c.071-.116.36-.315.821-.6 3.296-2.041 6.916-3.332 10.627-3.745a1 1 0 0 1 .206 1.988c-3.472.387-6.87 1.6-9.976 3.528-.07.043-.105.065-.136.083a.5.5 0 0 1-.542-.254zM21.758 16.042c-.57 1.612-2.088 2.737-3.742 2.859-.41.03-.82-.024-1.21-.16a25.7 25.7 0 0 0-3.536-.87 1 1 0 0 1 .334-1.972c1.27.215 2.53.51 3.768.888.22.075.458.102.692.082.874-.065 1.637-.66 1.913-1.443.182-.516.09-1.07-.237-1.485-.326-.414-.834-.66-1.366-.66h-.124a1 1 0 0 1 0-2h.124c1.076 0 2.098.499 2.742 1.317.644.819.84 1.907.442 2.944z" />
        <path d="M13.467 6.964c.04.696-.36 1.345-.98 1.635-2.28 1.065-4.51 2.484-6.4 4.156a1 1 0 0 1-1.328-1.496c2.016-1.787 4.385-3.3 6.809-4.432a.95.95 0 0 1 .399-.093c.538 0 .98.39 1.035.926l.005.054.004.05.002.028.001.013v.009l-.001-.008.003.038.005.062.002.027.001.013v.018z" />
      </svg>
      <span className="truncate">{label}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </a>
  );
}

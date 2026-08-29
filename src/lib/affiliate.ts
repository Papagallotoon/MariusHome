import { siteConfig } from "../../config/site";
const domains: Record<string, string> = { fr: "www.amazon.fr", com: "www.amazon.com", de: "www.amazon.de", es: "www.amazon.es", it: "www.amazon.it", "co.uk": "www.amazon.co.uk" };
export function getAffiliateUrl(asin: string): string {
  const d = domains[siteConfig.amazon.marketplace] || "www.amazon.fr";
  return `https://${d}/dp/${asin}?tag=${siteConfig.amazon.tag}`;
}
export function getAmazonSearchUrl(query: string): string {
  const d = domains[siteConfig.amazon.marketplace] || "www.amazon.fr";
  return `https://${d}/s?k=${encodeURIComponent(query)}&tag=${siteConfig.amazon.tag}`;
}

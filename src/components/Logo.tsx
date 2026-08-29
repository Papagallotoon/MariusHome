import { siteConfig } from "../../config/site";

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="23" fill={siteConfig.colors.primary} stroke={siteConfig.colors.accent} strokeWidth="2"/>
        {/* House shape */}
        <path d="M24 12L12 22V36H20V28H28V36H36V22L24 12Z" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Leaf decoration */}
        <path d="M24 18C24 18 28 20 28 24C28 28 24 30 24 30C24 30 20 28 20 24C20 20 24 18 24 18Z" fill={siteConfig.colors.accent} opacity="0.7"/>
        <path d="M24 18V30" stroke="#fff" strokeWidth="1" opacity="0.6"/>
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-white font-serif tracking-tight">{siteConfig.siteName}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: siteConfig.colors.gold }}>{siteConfig.siteTagline}</span>
      </div>
    </div>
  );
}

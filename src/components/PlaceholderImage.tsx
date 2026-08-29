import { siteConfig } from "../../config/site";

const icons: Record<string, string> = {
  "bougies-parfums":
    "M12 4V2 M12 4C10 4 9 5 9 7V10H15V7C15 5 14 4 12 4Z M9 10H15V20H9V10Z M8 20H16 M11 7V4 M13 7V5",
  "coussins-textiles":
    "M4 8C4 6 6 4 12 4C18 4 20 6 20 8V16C20 18 18 20 12 20C6 20 4 18 4 16V8Z M4 12H20 M8 4V20 M16 4V20",
  "luminaires-eclairage":
    "M12 2V4 M12 20V22 M4 12H2 M22 12H20 M6.34 6.34L4.93 4.93 M17.66 6.34L19.07 4.93 M12 8A4 4 0 1 0 12 16A4 4 0 1 0 12 8Z M10 16H14V19H10V16Z",
  "art-mural-cadres":
    "M3 3H21V21H3V3Z M3 3L21 21 M21 3L3 21 M6 3V21 M18 3V21 M3 6H21 M3 18H21",
  "vases-plantes-deco":
    "M9 22V16C9 14 7 12 7 10C7 6 9 4 12 4C15 4 17 6 17 10C17 12 15 14 15 16V22 M9 22H15 M12 4V2 M10 6C10 6 8 8 10 10 M14 6C14 6 16 8 14 10",
  "best-sellers":
    "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z",
  product:
    "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96 12 12.01l8.73-5.05 M12 22.08V12",
  japon:
    "M12 2C12 2 8 6 8 10C8 14 12 22 12 22C12 22 16 14 16 10C16 6 12 2 12 2Z M12 8A2 2 0 1 0 12 12A2 2 0 1 0 12 8Z M4 20H20",
  boheme:
    "M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z M6 20C8 18 10 19 12 18C14 19 16 18 18 20",
  bali:
    "M12 2V6 M12 6C8 6 4 10 4 14C4 18 8 22 12 22C16 22 20 18 20 14C20 10 16 6 12 6Z M8 10C8 10 10 12 12 12C14 12 16 10 16 10 M6 16H18",
  provencal:
    "M12 2C8 2 5 5 5 9C5 14 12 22 12 22C12 22 19 14 19 9C19 5 16 2 12 2Z M9 9H15 M12 6V12 M7 17L17 17",
  industriel:
    "M4 4H20V20H4V4Z M4 4L20 20 M9 4V20 M15 4V20 M4 9H20 M4 15H20",
  indien:
    "M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z M12 7A5 5 0 1 0 12 17A5 5 0 1 0 12 7Z",
};

export default function PlaceholderImage({
  type = "product",
  label,
  className = "",
  bgColor,
}: {
  type?: string;
  label?: string;
  className?: string;
  bgColor?: string;
}) {
  const iconPath = icons[type] || icons.product;
  const bg = bgColor || siteConfig.colors.primaryLight;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      style={{ background: bg }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke={siteConfig.colors.primary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.4}
      >
        <path d={iconPath} />
      </svg>
      {label && (
        <span className="text-xs font-medium text-center px-2 opacity-40" style={{ color: siteConfig.colors.primary }}>
          {label}
        </span>
      )}
    </div>
  );
}

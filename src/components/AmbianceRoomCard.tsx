import Link from "next/link";

const roomIcons: Record<string, string> = {
  salon: "M3 12L5 6H19L21 12V18H3V12Z M3 12H21 M7 18V20 M17 18V20",
  "salle-de-bain": "M4 12V7C4 5.9 4.9 5 6 5H18C19.1 5 20 5.9 20 7V12 M2 12H22V16C22 18.2 20.2 20 18 20H6C3.8 20 2 18.2 2 16V12Z M12 5V3",
  chambre: "M3 18V10L12 4L21 10V18 M3 18H21 M7 18V13H17V18 M7 13C7 11 9.5 9 12 9C14.5 9 17 11 17 13",
};

export default function AmbianceRoomCard({
  room,
  ambianceSlug,
  ambianceColor,
  ambianceAccent,
  articleTitle,
}: {
  room: { name: string; slug: string; articleSlug: string };
  ambianceSlug: string;
  ambianceColor: string;
  ambianceAccent: string;
  articleTitle?: string;
}) {
  return (
    <Link
      href={`/ambiances/${ambianceSlug}/${room.slug}`}
      className="group block rounded-xl overflow-hidden border border-site-border bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="h-32 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ambianceColor}20, ${ambianceAccent}30)` }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke={ambianceColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-50 group-hover:opacity-80 transition-opacity"
        >
          <path d={roomIcons[room.slug] || roomIcons.salon} />
        </svg>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-site-text mb-1 font-serif">{room.name}</h3>
        {articleTitle && (
          <p className="text-sm text-text-muted line-clamp-2">{articleTitle}</p>
        )}
        <span
          className="inline-flex items-center gap-1 mt-2 text-xs font-semibold group-hover:gap-2 transition-all"
          style={{ color: ambianceColor }}
        >
          Découvrir
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

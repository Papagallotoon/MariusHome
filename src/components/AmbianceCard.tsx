import Link from "next/link";
import Image from "next/image";
import type { Ambiance } from "@/types";
import PlaceholderImage from "./PlaceholderImage";

export default function AmbianceCard({ ambiance }: { ambiance: Ambiance }) {
  return (
    <Link
      href={`/ambiances/${ambiance.slug}`}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 md:h-56">
        {ambiance.image ? (
          <Image
            src={ambiance.image}
            alt={ambiance.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <PlaceholderImage
            type={ambiance.icon}
            label={ambiance.name}
            className="w-full h-full"
            bgColor={`${ambiance.color}22`}
          />
        )}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${ambiance.color}ee 0%, ${ambiance.color}44 50%, transparent 100%)` }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="kicker kicker-light mb-1.5">Ambiance</span>
          <h3 className="text-xl font-bold text-white mb-1 font-serif">{ambiance.name}</h3>
          <p className="text-sm text-white/80 line-clamp-2">{ambiance.description}</p>
        </div>
      </div>
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: ambiance.color }}>
        <div className="flex gap-2">
          {ambiance.rooms.map((room) => (
            <span key={room.slug} className="text-xs text-white/70 bg-white/15 px-2 py-0.5 rounded-full">
              {room.name}
            </span>
          ))}
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

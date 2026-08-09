import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllAmbiances, getAmbianceBySlug, getAmbianceArticle } from "@/lib/ambiances";
import { siteConfig } from "../../../../config/site";
import AmbianceRoomCard from "@/components/AmbianceRoomCard";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return getAllAmbiances().map((a) => ({ style: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ style: string }> }): Promise<Metadata> {
  const { style } = await params;
  const ambiance = getAmbianceBySlug(style);
  if (!ambiance) return {};
  return {
    title: `${ambiance.name} | ${siteConfig.siteName}`,
    description: ambiance.description,
    openGraph: {
      title: `${ambiance.name} | ${siteConfig.siteName}`,
      description: ambiance.description,
      url: `${siteConfig.domain}/ambiances/${style}`,
      type: "website",
    },
  };
}

export default async function AmbianceStylePage({ params }: { params: Promise<{ style: string }> }) {
  const { style } = await params;
  const ambiance = getAmbianceBySlug(style);
  if (!ambiance) notFound();

  const pageUrl = `${siteConfig.domain}/ambiances/${style}`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: ambiance.name,
          description: ambiance.description,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: "Ambiances", url: `${siteConfig.domain}/ambiances` },
            { name: ambiance.name, url: pageUrl },
          ],
        })}
      />
      <section
        className="py-16 md:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${ambiance.color}, ${ambiance.colorAccent})` }}
      >
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-20 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(70px)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/ambiances" className="hover:text-white transition-colors">Ambiances</Link>
            <span>/</span>
            <span className="text-white">{ambiance.name}</span>
          </nav>
          <span className="kicker kicker-light mb-4">Ambiance déco</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white font-serif">{ambiance.name}</h1>
          <p className="mt-4 text-lg text-white/80 max-w-2xl">{ambiance.description}</p>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-site-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="kicker mb-3">3 pièces</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-site-text mb-8 font-serif">Choisissez votre pièce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ambiance.rooms.map((room) => {
              const article = getAmbianceArticle(ambiance.slug, room.slug);
              return (
                <AmbianceRoomCard
                  key={room.slug}
                  room={room}
                  ambianceSlug={ambiance.slug}
                  ambianceColor={ambiance.color}
                  ambianceAccent={ambiance.colorAccent}
                  articleTitle={article?.title}
                />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

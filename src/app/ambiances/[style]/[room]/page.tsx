import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllAmbiances, getAmbianceBySlug, getAmbianceArticle } from "@/lib/ambiances";
import { siteConfig } from "../../../../../config/site";
import ProductCard from "@/components/ProductCard";
import BuyingGuide from "@/components/BuyingGuide";
import FAQAccordion from "@/components/FAQAccordion";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd, getItemListJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  const params: { style: string; room: string }[] = [];
  getAllAmbiances().forEach((a) => {
    a.rooms.forEach((r) => {
      params.push({ style: a.slug, room: r.slug });
    });
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ style: string; room: string }> }): Promise<Metadata> {
  const { style, room } = await params;
  const article = getAmbianceArticle(style, room);
  if (!article) return {};
  return {
    title: article.title,
    description: article.metaDescription,
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `${siteConfig.domain}/ambiances/${style}/${room}`,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: article.image ? [{ url: article.image, width: 1200, height: 630, alt: article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription,
      images: article.image ? [article.image] : [],
    },
  };
}

export default async function AmbianceArticlePage({ params }: { params: Promise<{ style: string; room: string }> }) {
  const { style, room } = await params;
  const ambiance = getAmbianceBySlug(style);
  if (!ambiance) notFound();

  const article = getAmbianceArticle(style, room);
  if (!article) notFound();

  const roomData = ambiance.rooms.find((r) => r.slug === room);
  const roomName = roomData?.name || room;

  const hasProducts = article.products && article.products.length > 0;
  const hasContent = !!article.content;
  const hasBuyingGuide = !!article.buyingGuide;
  const hasFaq = article.faq && article.faq.length > 0;
  const pageUrl = `${siteConfig.domain}/ambiances/${style}/${room}`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: article.title,
          description: article.metaDescription,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: "Ambiances", url: `${siteConfig.domain}/ambiances` },
            { name: ambiance.name, url: `${siteConfig.domain}/ambiances/${style}` },
            { name: article.title, url: pageUrl },
          ],
        })}
      />
      {hasProducts && (
        <JsonLd
          data={getItemListJsonLd({ url: pageUrl, name: article.title, products: article.products! })}
        />
      )}
      <section
        className="py-12 md:py-16 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${ambiance.color}, ${ambiance.colorAccent})` }}
      >
        <div
          className="absolute -left-16 -top-16 w-56 h-56 rounded-full opacity-20 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(60px)" }}
        />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">
          <nav className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/ambiances" className="hover:text-white transition-colors">Ambiances</Link>
            <span>/</span>
            <Link href={`/ambiances/${style}`} className="hover:text-white transition-colors">{ambiance.name}</Link>
            <span>/</span>
            <span className="text-white">{roomName}</span>
          </nav>
          <span className="kicker kicker-light kicker-center mb-3 sm:mb-4">{ambiance.name} &middot; {roomName}</span>
          <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-serif">{article.title}</h1>
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/60">
            <span>Par {article.author}</span>
            <span className="text-white/30">&#183;</span>
            <span>
              Mis à jour le{" "}
              {new Date(article.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="text-white/30">&#183;</span>
            {hasProducts ? (
              <span>{article.products!.length} produits comparés</span>
            ) : (
              <span>Guide & Inspiration</span>
            )}
          </div>
        </div>
      </section>

      {article.image && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-10">
          <div className="relative h-[160px] sm:h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <div className="mb-10 p-5 rounded-sm border border-site-border bg-surface" style={{ borderTop: `2px solid ${siteConfig.colors.vivid}` }}>
          <span className="kicker mb-3">Sommaire</span>
          <nav className="space-y-2">
            {hasProducts && (
              <>
                <a href="#comparatif" className="block text-sm text-text-muted hover:text-primary transition-colors">
                  1. Comparatif des produits
                </a>
                {article.products!.map((p, i) => (
                  <a
                    key={i}
                    href={`#produit-${i + 1}`}
                    className="block text-sm text-text-muted hover:text-primary transition-colors pl-4"
                  >
                    #{i + 1} {p.name}
                  </a>
                ))}
              </>
            )}
            {hasContent && (
              <a href="#contenu" className="block text-sm text-text-muted hover:text-primary transition-colors">
                {hasProducts ? "2." : "1."} Lire l&apos;article
              </a>
            )}
            {hasBuyingGuide && (
              <a href="#guide" className="block text-sm text-text-muted hover:text-primary transition-colors">
                {hasProducts ? (hasContent ? "3." : "2.") : (hasContent ? "2." : "1.")} {article.buyingGuide!.title}
              </a>
            )}
            {hasFaq && (
              <a href="#faq" className="block text-sm text-text-muted hover:text-primary transition-colors">
                {(() => {
                  let n = 1;
                  if (hasProducts) n++;
                  if (hasContent) n++;
                  if (hasBuyingGuide) n++;
                  return n;
                })()} . Questions fréquentes
              </a>
            )}
          </nav>
        </div>

        {/* Intro */}
        <div className="mb-16 space-y-5">
          {article.intro.split('\n\n').map((paragraph, i) =>
            i === 0 ? (
              <p key={i} className="pull-quote">{paragraph}</p>
            ) : (
              <p key={i} className="text-lg leading-relaxed text-site-text">{paragraph}</p>
            )
          )}
        </div>

        {/* Quick Comparison Table */}
        {hasProducts && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-vivid" />
              <h2 id="comparatif" className="text-xl sm:text-2xl font-bold text-site-text font-serif">Tableau comparatif</h2>
            </div>
            {/* Mobile: card layout */}
            <div className="sm:hidden space-y-3">
              {article.products!.map((p, i) => (
                <a key={i} href={`#produit-${i + 1}`} className="block p-4 rounded-lg border border-site-border bg-surface hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ background: ambiance.color }}>{i + 1}</span>
                    <span className="text-xs font-semibold text-text-muted">{p.badge}</span>
                  </div>
                  <h3 className="font-medium text-site-text text-sm">{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-text-muted">{p.rating}/5</span>
                    <span className="text-sm font-semibold" style={{ color: ambiance.color }}>{p.price}</span>
                  </div>
                </a>
              ))}
            </div>
            {/* Desktop: table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm border border-site-border rounded-lg overflow-hidden">
                <thead>
                  <tr style={{ background: ambiance.color }}>
                    <th className="text-left p-3 text-white">#</th>
                    <th className="text-left p-3 text-white">Produit</th>
                    <th className="text-left p-3 text-white">Note</th>
                    <th className="text-left p-3 text-white">Prix</th>
                    <th className="text-left p-3 text-white">Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {article.products!.map((p, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-gray-50"}>
                      <td className="p-3 font-bold">{i + 1}</td>
                      <td className="p-3 font-medium">
                        <a href={`#produit-${i + 1}`} className="hover:text-primary transition-colors">{p.name}</a>
                      </td>
                      <td className="p-3">{p.rating}/5</td>
                      <td className="p-3 font-semibold" style={{ color: ambiance.color }}>{p.price}</td>
                      <td className="p-3">
                        <span className="text-xs font-semibold">{p.badge}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Cards */}
        {hasProducts && (
          <div className="space-y-8 mb-16">
            {article.products!.map((product, i) => (
              <div key={i} id={`produit-${i + 1}`}>
                <ProductCard product={product} rank={i + 1} />
              </div>
            ))}
          </div>
        )}

        {/* Editorial Content */}
        {hasContent && (
          <div id="contenu" className="mb-16">
            <div
              className="prose prose-lg max-w-none text-site-text
                prose-headings:text-site-text prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:mb-4
                prose-ul:my-4 prose-ul:space-y-2
                prose-ol:my-4 prose-ol:space-y-2
                prose-li:leading-relaxed
                prose-strong:text-site-text
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-text-muted"
              dangerouslySetInnerHTML={{ __html: article.content! }}
            />
          </div>
        )}

        {/* Buying Guide */}
        {hasBuyingGuide && (
          <div id="guide" className="mb-16">
            <BuyingGuide title={article.buyingGuide!.title} content={article.buyingGuide!.content} />
          </div>
        )}

        {/* FAQ */}
        {hasFaq && (
          <div id="faq" className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="rule-vivid" />
              <h2 className="text-2xl font-bold text-site-text font-serif">Questions fréquentes</h2>
            </div>
            <FAQAccordion items={article.faq!} />
          </div>
        )}

        {/* Back link */}
        <div className="text-center pt-8 border-t border-site-border">
          <Link
            href={`/ambiances/${style}`}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide editorial-link"
            style={{ color: ambiance.color }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour à {ambiance.name}
          </Link>
        </div>
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getCategoryBySlug } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/articles";
import { siteConfig } from "../../../config/site";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description,
    openGraph: {
      title: `${cat.name} | ${siteConfig.siteName}`,
      description: cat.description,
      url: `${siteConfig.domain}/${category}`,
      type: "website",
      images: [
        {
          url: cat.image,
          width: 1200,
          height: 630,
          alt: cat.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.name} | ${siteConfig.siteName}`,
      description: cat.description,
      images: [cat.image],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const articles = getArticlesByCategory(categorySlug);
  const [featureArticle, ...restArticles] = articles;
  const pageUrl = `${siteConfig.domain}/${categorySlug}`;

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: pageUrl,
          name: category.name,
          description: category.description,
          breadcrumbItems: [
            { name: "Accueil", url: siteConfig.domain },
            { name: category.name, url: pageUrl },
          ],
        })}
      />
      {/* Header */}
      <section
        className="py-12 sm:py-16 md:py-24 relative overflow-hidden"
        style={
          category.image
            ? {
                backgroundImage: `linear-gradient(135deg, ${category.color}e6, ${category.color}b3), url(${category.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: `linear-gradient(135deg, ${category.color}, ${category.color}cc)` }
        }
      >
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-25 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(70px)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-white/60 mb-4 sm:mb-6">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <span className="kicker kicker-light mb-3 sm:mb-4">Univers déco</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight font-serif max-w-2xl">{category.name}</h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-base md:text-lg text-white/80 max-w-2xl">{category.description}</p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-10 sm:py-16 bg-site-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6 sm:mb-10">
                <span className="kicker">
                  {articles.length} sélection{articles.length > 1 ? "s" : ""} disponible{articles.length > 1 ? "s" : ""}
                </span>
              </div>
              {featureArticle && (
                <div className="mb-8 sm:mb-10">
                  <ArticleCard article={featureArticle} variant="feature" />
                </div>
              )}
              {restArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {restArticles.map((article) => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-10 sm:py-12">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-text-muted mb-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold text-site-text">Aucune sélection pour le moment</h3>
              <p className="mt-2 text-sm text-text-muted">Nos guides pour cette catégorie arrivent bientôt !</p>
              <Link
                href="/"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                style={{ color: siteConfig.colors.primary }}
              >
                Retour à l&apos;accueil
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

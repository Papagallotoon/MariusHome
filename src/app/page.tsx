import { getAllCategories } from "@/lib/categories";
import { getAllArticles } from "@/lib/articles";
import { getHomepageData } from "@/lib/homepage";
import { siteConfig } from "../../config/site";
import CategoryCard from "@/components/CategoryCard";
import ArticleCarousel from "@/components/ArticleCarousel";
import TeamSection from "@/components/TeamSection";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

export default function Home() {
  const categories = getAllCategories();
  const homepage = getHomepageData();
  const articles = getAllArticles().slice(0, homepage.articlesSection.count);

  const [featureCategory, ...restCategories] = categories;

  const heroStyle: React.CSSProperties = homepage.hero.backgroundImage
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(45,59,49,${homepage.hero.backgroundOverlayOpacity}), rgba(74,94,79,${homepage.hero.backgroundOverlayOpacity})), url(${homepage.hero.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: `linear-gradient(135deg, ${siteConfig.colors.primaryDark}, ${siteConfig.colors.primary})`,
      };

  return (
    <>
      <JsonLd
        data={getPageJsonLd({
          url: siteConfig.domain,
          name: `${siteConfig.siteName} - ${siteConfig.siteTagline}`,
          description: siteConfig.description,
          breadcrumbItems: [],
        })}
      />
      {/* Hero — asymmetric editorial layout */}
      <section className="relative py-12 sm:py-20 md:py-28 lg:py-32 overflow-hidden" style={heroStyle}>
        <div
          className="absolute -right-24 -top-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(60px)" }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <span className="kicker kicker-light mb-4 sm:mb-6">{siteConfig.siteTagline}</span>
            <h1 className="text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] font-serif">
              {homepage.hero.title}
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${siteConfig.colors.gold}, ${siteConfig.colors.goldLight}, ${siteConfig.colors.gold})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {homepage.hero.titleAccent}
              </span>
            </h1>
            <p className="mt-5 sm:mt-7 text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-xl leading-relaxed">
              {homepage.hero.subtitle}
            </p>
            <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <a
                href={homepage.hero.ctaPrimary.href}
                className="w-full sm:w-auto justify-center vivid-btn"
              >
                {homepage.hero.ctaPrimary.label}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </a>
              <a
                href={homepage.hero.ctaSecondary.href}
                className="inline-flex items-center gap-2 text-white text-sm sm:text-base font-semibold uppercase tracking-wide editorial-link"
              >
                {homepage.hero.ctaSecondary.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features — inline editorial strip with numbered marks */}
      <section className="py-10 sm:py-14 bg-surface border-b border-site-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 divide-y divide-site-border md:grid-cols-3 md:divide-y-0 md:divide-x">
            {homepage.features.items.map((feature, i) => (
              <div key={i} className="flex items-start gap-4 sm:gap-5 py-5 md:py-0 md:px-6 lg:px-8 first:pt-0 md:first:pl-0 last:pb-0">
                <span className="mag-index text-4xl sm:text-5xl flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-site-text font-serif">{feature.title}</h3>
                  <p className="text-[13px] sm:text-sm text-text-muted mt-1 sm:mt-1.5 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — feature tile + editorial list */}
      <section id="categories" className="py-12 sm:py-20 bg-site-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-3">
            <div>
              <span className="kicker mb-3">Sélection déco</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-site-text font-serif">
                {homepage.categoriesSection.title}
              </h2>
            </div>
            <p className="text-sm sm:text-base text-text-muted max-w-sm">
              {homepage.categoriesSection.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {featureCategory && <CategoryCard key={featureCategory.slug} category={featureCategory} variant="feature" />}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {restCategories.map((cat) => (
                <CategoryCard key={cat.slug} category={cat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles — feature + list */}
      {articles.length > 0 && (
        <section
          id="articles"
          className="py-12 sm:py-20 bg-surface border-t border-site-border"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12 gap-3">
              <div>
                <span className="kicker mb-3">À la une</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-site-text font-serif">
                  {homepage.articlesSection.title}
                </h2>
              </div>
              <p className="text-sm sm:text-base text-text-muted max-w-sm">
                {homepage.articlesSection.subtitle}
              </p>
            </div>
            <ArticleCarousel articles={articles} />
          </div>
        </section>
      )}

      {/* Team */}
      <TeamSection />

      {/* CTA */}
      <section className="py-14 sm:py-20 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${siteConfig.colors.primaryDark}, ${siteConfig.colors.primary})` }}>
        <div
          className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: siteConfig.colors.vivid, filter: "blur(60px)" }}
        />
        <div className="mx-auto max-w-3xl px-4 text-center relative">
          <span className="kicker kicker-light kicker-center mb-4">{siteConfig.siteName}</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
            {homepage.cta.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto">{homepage.cta.subtitle}</p>
          <a
            href="#categories"
            className="mt-6 sm:mt-8 inline-flex items-center gap-2 vivid-btn"
          >
            {homepage.cta.buttonLabel}
          </a>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { siteConfig } from "../../config/site";
import { ambiances, objectFamilies, AMBIANCE_CATEGORY } from "@/data/ambiances-ui";
import Reveal from "@/components/Reveal";
import Serre from "@/components/Serre";
import JsonLd from "@/components/JsonLd";
import { getPageJsonLd } from "@/lib/jsonld";

const paper = "#F7F4EE";
const ink = "#23281F";
const gold = "#C9A87C";
const muted = "#6E7266";

const featured = {
  href: `/${AMBIANCE_CATEGORY}/ambiance-boheme-salon`,
  image: "/images/articles/ambiance-boheme-salon.png",
  kicker: "Ambiance bohème · Salon",
  title: "Les 5 meilleurs objets déco pour un salon bohème chaleureux",
  excerpt:
    "Macramé, rotin, terre cuite : le trio qui réchauffe une pièce sans l'encombrer. Notre comparatif détaillé, avec les prix relevés cette semaine.",
  meta: "Mis à jour le 28 août · 8 min",
};

const latest = [
  { href: `/${AMBIANCE_CATEGORY}/ambiance-japon-chambre`, image: "/images/articles/ambiance-japon-chambre.png", kicker: "Ambiance Japon · Chambre", title: "Une chambre japonaise en 6 objets", meta: "26 août · 7 min" },
  { href: `/${AMBIANCE_CATEGORY}/ambiance-bali-salle-de-bain`, image: "/images/ambiances/ambiance-bali-salle-de-bain.png", kicker: "Ambiance Bali · Salle de bain", title: "Salle de bain balinaise : le bois qui résiste", meta: "22 août · 6 min" },
  { href: `/${AMBIANCE_CATEGORY}/ambiance-provencal-salon`, image: "/images/ambiances/ambiance-provencal-salon.png", kicker: "Ambiance Provençal · Salon", title: "Lin, pierre et lumière : le salon du Sud", meta: "19 août · 9 min" },
  { href: `/${AMBIANCE_CATEGORY}/ambiance-industriel-salon`, image: "/images/articles/ambiance-industriel-salon.png", kicker: "Ambiance Industriel · Salon", title: "Loft habitable : adoucir le métal brut", meta: "14 août · 8 min" },
];

export default function Home() {
  const { hero, features, categoriesSection, articlesSection, cta } = siteConfig.homepage;

  return (
    <>
      <Reveal />
      <JsonLd
        data={getPageJsonLd({
          url: siteConfig.domain,
          name: `${siteConfig.siteName} - ${siteConfig.siteTagline}`,
          description: siteConfig.description,
          breadcrumbItems: [],
        })}
      />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "clamp(560px, 90vh, 760px)", background: "#1B211A" }}
      >
        <img
          src={hero.backgroundImage}
          alt="Vallée boisée au crépuscule"
          className="md-anim-kenburns"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span
          className="md-anim-haze"
          style={{
            position: "absolute",
            left: "-10%",
            right: "-10%",
            bottom: "26%",
            height: "clamp(90px, 18vh, 170px)",
            background: "linear-gradient(to top, rgba(228,238,236,0.5), rgba(228,238,236,0))",
            filter: "blur(14px)",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(24,30,22,0.95) 0%, rgba(24,30,22,0.70) 40%, rgba(24,30,22,0.22) 100%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="relative w-full mx-auto max-w-7xl"
          style={{ padding: "clamp(64px, 14vw, 96px) clamp(20px, 5.2vw, 40px) clamp(44px, 9vw, 96px)" }}
        >
          <span className="md-kicker md-kicker-light md-anim-rise" style={{ marginBottom: "clamp(18px, 4vw, 30px)", animationDelay: "0.05s" }}>
            {siteConfig.siteTagline}
          </span>
          <h1
            className="md-anim-rise"
            style={{ margin: 0, fontSize: "clamp(42px, 11vw, 78px)", lineHeight: 1.03, letterSpacing: "-0.015em", color: paper, maxWidth: "16ch", animationDelay: "0.16s" }}
          >
            {hero.title} <em style={{ fontStyle: "italic", color: gold }}>{hero.titleAccent}</em>
          </h1>
          <p
            className="md-anim-rise"
            style={{ margin: "clamp(20px, 5vw, 32px) 0 0", fontSize: "clamp(15.5px, 4vw, 16.5px)", lineHeight: 1.75, color: "rgba(247,244,238,0.78)", maxWidth: "46ch", animationDelay: "0.3s" }}
          >
            {hero.subtitle}
          </p>
          <div
            className="flex flex-wrap items-center md-anim-rise"
            style={{ gap: "14px 26px", marginTop: "clamp(28px, 6vw, 44px)", animationDelay: "0.44s" }}
          >
            <Link href={hero.ctaPrimary.href} className="md-btn">
              {hero.ctaPrimary.label}
              <span style={{ width: 6, height: 6, borderTop: "1.4px solid #FFFDF9", borderRight: "1.4px solid #FFFDF9", transform: "rotate(45deg)" }} />
            </Link>
            <Link
              href={hero.ctaSecondary.href}
              className="inline-flex items-center uppercase"
              style={{ minHeight: 48, fontSize: 11.5, fontWeight: 500, letterSpacing: "0.2em", color: "rgba(247,244,238,0.82)", borderBottom: "1px solid rgba(201,168,124,0.5)" }}
            >
              {hero.ctaSecondary.label}
            </Link>
          </div>
          <span
            style={{ display: "block", position: "relative", width: 1, height: 46, margin: "clamp(26px, 6vw, 40px) 0 0", overflow: "hidden", background: "rgba(247,244,238,0.16)" }}
          >
            <span style={{ position: "absolute", left: 0, width: 1, height: 22, background: gold, animation: "mdScrollHint 2.6s ease-in-out infinite" }} />
          </span>
        </div>
      </section>

      {/* ── LA MÉTHODE EN TROIS POINTS ───────────────────────── */}
      <section style={{ background: "#FFFDF9", borderBottom: "1px solid rgba(35,40,31,0.09)" }}>
        <div
          className="mx-auto max-w-7xl grid"
          style={{
            padding: "clamp(38px, 8vw, 54px) clamp(20px, 5.2vw, 40px)",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
            gap: "clamp(26px, 6vw, 32px) 0",
          }}
        >
          {features.items.map((f, i) => (
            <div key={f.title} data-reveal className="flex items-start" style={{ padding: "0 clamp(0px, 2.6vw, 44px)", gap: 18 }}>
              <span className="font-serif" style={{ fontStyle: "italic", fontSize: 40, fontWeight: 300, color: gold, lineHeight: 0.8 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 500, color: ink }}>{f.title}</h3>
                <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: muted, maxWidth: "36ch" }}>{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LES SIX AMBIANCES ────────────────────────────────── */}
      <section id="univers" data-drop style={{ background: paper }}>
        <div className="mx-auto max-w-7xl" style={{ padding: "clamp(60px, 12vw, 110px) clamp(20px, 5.2vw, 40px)" }}>
          <div
            className="grid items-end"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: "clamp(20px, 5vw, 60px)", marginBottom: "clamp(34px, 7vw, 58px)" }}
          >
            <div data-reveal>
              <span className="md-kicker" style={{ marginBottom: 18 }}>Les six ambiances</span>
              <h2 style={{ margin: 0, fontSize: "clamp(34px, 8.6vw, 56px)", lineHeight: 1.08, letterSpacing: "-0.01em", color: ink, maxWidth: "20ch" }}>
                {categoriesSection.title}
              </h2>
            </div>
            <p data-reveal style={{ margin: 0, fontSize: "clamp(14.5px, 3.8vw, 15px)", lineHeight: 1.8, color: muted, maxWidth: "40ch" }}>
              {categoriesSection.subtitle}
            </p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(290px, 100%), 1fr))", gap: "clamp(16px, 4vw, 28px)" }}>
            {ambiances.map((a) => (
              <Link
                key={a.slug}
                href={`/${AMBIANCE_CATEGORY}/ambiance-${a.slug}-salon`}
                data-reveal
                className="block relative overflow-hidden md-zoom-host"
                style={{ background: ink }}
              >
                <img
                  src={a.image}
                  alt={a.name}
                  className="md-zoom"
                  style={{ width: "100%", height: "clamp(300px, 78vw, 380px)", objectFit: "cover", display: "block", filter: "saturate(0.95)" }}
                />
                <span
                  style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(24,30,22,0.86) 0%, rgba(24,30,22,0.12) 58%, rgba(24,30,22,0.05) 100%)", pointerEvents: "none" }}
                />
                <span
                  className="absolute flex flex-col"
                  style={{ left: "clamp(18px, 5vw, 26px)", right: "clamp(18px, 5vw, 26px)", bottom: "clamp(18px, 5vw, 24px)", gap: 9, pointerEvents: "none" }}
                >
                  <span className="flex items-center" style={{ gap: 10 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: a.color }} />
                    <span className="uppercase" style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.26em", color: "rgba(247,244,238,0.72)" }}>{a.kicker}</span>
                  </span>
                  <span className="font-serif" style={{ fontSize: "clamp(30px, 8vw, 34px)", fontWeight: 500, color: "#FFFDF9", lineHeight: 1.05 }}>{a.name}</span>
                  <span style={{ fontSize: 12, letterSpacing: "0.04em", color: "rgba(247,244,238,0.64)" }}>Salon · Chambre · Salle de bain · Top 5</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── OBJETS DÉCO PAR FAMILLE ──────────────────────────── */}
      <section id="univers-objets" style={{ background: "#FFFDF9", borderTop: "1px solid rgba(35,40,31,0.09)" }}>
        <div className="mx-auto max-w-7xl" style={{ padding: "clamp(56px, 11vw, 100px) clamp(20px, 5.2vw, 40px)" }}>
          <div className="flex flex-wrap items-end justify-between" style={{ gap: "16px 40px", marginBottom: "clamp(28px, 6vw, 50px)" }}>
            <h2 data-reveal style={{ margin: 0, fontSize: "clamp(30px, 7.4vw, 44px)", color: ink }}>Objets déco, par famille</h2>
            <Link href="/best-sellers" className="md-link-quiet">Tout parcourir &rarr;</Link>
          </div>
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))", gap: "clamp(14px, 3.6vw, 22px)" }}>
            {objectFamilies.map((c) => (
              <Link key={c.slug} href={`/${c.slug}`} data-reveal className="flex flex-col md-zoom-host" style={{ gap: 12 }}>
                <span className="block overflow-hidden" style={{ background: "#EDE7DC" }}>
                  <img src={c.image} alt={c.name} className="md-zoom" style={{ width: "100%", height: "clamp(170px, 42vw, 210px)", objectFit: "cover", display: "block" }} />
                </span>
                <span className="flex flex-col" style={{ gap: 5 }}>
                  <span className="font-serif" style={{ fontSize: 19, fontWeight: 500, color: ink, lineHeight: 1.25 }}>{c.name}</span>
                  <span className="uppercase" style={{ fontSize: 10.5, letterSpacing: "0.16em", color: "#A9A29A" }}>{c.count}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DERNIÈRES SÉLECTIONS ─────────────────────────────── */}
      <section id="selections" data-drop style={{ background: paper }}>
        <div className="mx-auto max-w-7xl" style={{ padding: "clamp(60px, 12vw, 110px) clamp(20px, 5.2vw, 40px)" }}>
          <span className="md-kicker" style={{ marginBottom: 18 }}>À la une</span>
          <h2 style={{ margin: "0 0 clamp(30px, 7vw, 54px)", fontSize: "clamp(32px, 8vw, 52px)", color: ink }}>{articlesSection.title}</h2>

          <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(360px, 100%), 1fr))", gap: "clamp(34px, 7vw, 56px)" }}>
            <Link href={featured.href} data-reveal className="flex flex-col md-zoom-host" style={{ gap: 18 }}>
              <span className="block overflow-hidden">
                <img src={featured.image} alt={featured.title} className="md-zoom md-anim-drift" style={{ width: "100%", height: "clamp(300px, 82vw, 420px)", objectFit: "cover", display: "block" }} />
              </span>
              <span className="flex flex-col" style={{ gap: 12 }}>
                <span className="uppercase" style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.26em", color: "#A64B2A" }}>{featured.kicker}</span>
                <span className="font-serif" style={{ fontSize: "clamp(30px, 7.6vw, 38px)", fontWeight: 400, lineHeight: 1.12, color: ink, maxWidth: "22ch" }}>{featured.title}</span>
                <span style={{ fontSize: "clamp(14.5px, 3.8vw, 15px)", lineHeight: 1.8, color: muted, maxWidth: "52ch" }}>{featured.excerpt}</span>
                <span className="uppercase" style={{ fontSize: 10.5, letterSpacing: "0.16em", color: "#A9A29A" }}>{featured.meta}</span>
              </span>
            </Link>

            <div className="flex flex-col">
              {latest.slice(0, articlesSection.count).map((a) => (
                <Link key={a.href} href={a.href} data-reveal className="flex md-zoom-host" style={{ gap: "clamp(14px, 4vw, 24px)", padding: "clamp(18px, 4.5vw, 26px) 0", borderTop: "1px solid rgba(35,40,31,0.12)" }}>
                  <span className="block overflow-hidden flex-shrink-0" style={{ width: "clamp(96px, 27vw, 118px)", height: "clamp(78px, 21vw, 90px)", background: "#EDE7DC" }}>
                    <img src={a.image} alt={a.title} className="md-zoom" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  </span>
                  <span className="flex flex-col" style={{ gap: 6 }}>
                    <span className="uppercase" style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.22em", color: "#A64B2A" }}>{a.kicker}</span>
                    <span className="font-serif" style={{ fontSize: "clamp(19px, 5vw, 22px)", fontWeight: 500, lineHeight: 1.22, color: ink }}>{a.title}</span>
                    <span className="uppercase" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#A9A29A" }}>{a.meta}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LA MÉTHODE / SIGNATURE ───────────────────────────── */}
      <section id="conseil" data-drop style={{ background: "#2C3328" }}>
        <div
          className="mx-auto max-w-7xl grid items-center"
          style={{ padding: "clamp(56px, 11vw, 104px) clamp(20px, 5.2vw, 40px)", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: "clamp(32px, 5vw, 80px)" }}
        >
          <div data-reveal className="relative overflow-hidden">
            <img src="/images/ambiances/japon.png" alt="Intérieur japonais épuré" className="md-anim-drift" style={{ width: "100%", height: "clamp(280px, 72vw, 480px)", objectFit: "cover", display: "block" }} />
          </div>
          <div data-reveal>
            <span className="md-kicker md-kicker-light" style={{ marginBottom: "clamp(18px, 4vw, 30px)" }}>La méthode</span>
            <p className="font-serif" style={{ margin: 0, fontSize: "clamp(27px, 6.6vw, 40px)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.32, color: paper, maxWidth: "26ch" }}>
              &laquo; Une pièce juste, c&rsquo;est trois matières, deux couleurs, et beaucoup de lumière. &raquo;
            </p>
            <p style={{ margin: "clamp(22px, 5vw, 34px) 0 0", fontSize: "clamp(15px, 3.9vw, 15.5px)", lineHeight: 1.85, color: "rgba(247,244,238,0.72)", maxWidth: "52ch" }}>
              Je travaille l&rsquo;intérieur comme un paysage : on choisit d&rsquo;abord l&rsquo;ambiance, ensuite les matières, et seulement à la fin les objets. C&rsquo;est ce qui évite les achats regrettés &mdash; et ce qui rend une maison durablement agréable.
            </p>
            <p style={{ margin: "20px 0 0", fontSize: "clamp(15px, 3.9vw, 15.5px)", lineHeight: 1.85, color: "rgba(247,244,238,0.72)", maxWidth: "52ch" }}>
              Chaque sélection publiée ici suit cette règle : testée en situation, comparée à trois alternatives, et jamais recommandée pour son prix seul.
            </p>
            <div className="flex flex-wrap items-center" style={{ gap: "10px 16px", marginTop: "clamp(28px, 6vw, 40px)", paddingTop: 24, borderTop: "1px solid rgba(247,244,238,0.16)" }}>
              <span className="font-serif" style={{ fontSize: 21, fontWeight: 500, letterSpacing: "0.05em", color: paper }}>Marius Dumas</span>
              <span className="uppercase" style={{ fontSize: 10.5, letterSpacing: "0.2em", color: "rgba(201,168,124,0.9)" }}>Décorateur d&rsquo;intérieur</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" data-drop style={{ background: paper }}>
        <div data-reveal className="mx-auto text-center" style={{ maxWidth: 820, padding: "clamp(64px, 13vw, 118px) clamp(20px, 5.2vw, 40px)" }}>
          <h2 style={{ margin: 0, fontSize: "clamp(32px, 8vw, 54px)", lineHeight: 1.1, color: ink }}>{cta.title}</h2>
          <p style={{ margin: "clamp(20px, 5vw, 26px) auto 0", fontSize: "clamp(15.5px, 4vw, 16px)", lineHeight: 1.8, color: muted, maxWidth: "48ch" }}>{cta.subtitle}</p>
          <Link href="/contact" className="md-btn md-btn-ink" style={{ marginTop: "clamp(28px, 7vw, 42px)", minHeight: 56, padding: "0 32px" }}>
            {cta.buttonLabel}
            <span style={{ width: 6, height: 6, borderTop: "1.4px solid currentColor", borderRight: "1.4px solid currentColor", transform: "rotate(45deg)" }} />
          </Link>
        </div>
      </section>

      {/* ── LA SERRE (client) ────────────────────────────────── */}
      <Serre />
    </>
  );
}

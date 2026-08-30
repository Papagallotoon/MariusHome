"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { ambiances, readings, AMBIANCE_CATEGORY } from "@/data/ambiances-ui";

const ink = "#23281F";
const paper = "#F7F4EE";
const terracotta = "#A64B2A";

const navLinks = [
  { label: "Objets déco", href: "/#univers-objets" },
  { label: "Sélections", href: "/#selections" },
  { label: "Conseil", href: "/#conseil" },
];

export default function Header() {
  const [drawer, setDrawer] = useState(false);
  const [mega, setMega] = useState(false);
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setMega(true);
  }, []);
  const closeMega = useCallback(() => {
    timer.current = setTimeout(() => setMega(false), 150);
  }, []);

  const amb = ambiances[active];

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(247,244,238,0.95)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(35,40,31,0.10)",
      }}
    >
      <div
        className="mx-auto max-w-7xl flex items-center justify-between gap-4"
        style={{ padding: "0 clamp(18px, 5vw, 40px)", height: "clamp(62px, 12vw, 82px)" }}
      >
        <Link href="/" className="flex flex-col flex-shrink-0" style={{ gap: 3 }}>
          <span
            className="font-serif whitespace-nowrap"
            style={{ fontSize: "clamp(19px, 5vw, 25px)", fontWeight: 500, letterSpacing: "0.13em", color: ink, lineHeight: 1 }}
          >
            MARIUS DUMAS
          </span>
          <span
            className="whitespace-nowrap uppercase"
            style={{ fontSize: "clamp(8px, 2.2vw, 9.5px)", fontWeight: 500, letterSpacing: "0.28em", color: "#8C8378" }}
          >
            Architecte d&rsquo;ambiance
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
          <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
            <button
              type="button"
              onClick={() => setMega((v) => !v)}
              className="flex items-center gap-2 uppercase"
              style={{ background: "none", border: 0, padding: 0, cursor: "pointer", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", color: ink }}
            >
              Ambiances
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRight: `1.4px solid ${terracotta}`,
                  borderBottom: `1.4px solid ${terracotta}`,
                  transform: "rotate(45deg)",
                  marginBottom: 3,
                }}
              />
            </button>
          </div>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="uppercase whitespace-nowrap"
              style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", color: "#5C6154" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#serre"
            className="uppercase whitespace-nowrap"
            style={{ display: "inline-flex", alignItems: "center", padding: "12px 18px", background: ink, color: paper, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em" }}
          >
            Ma serre
          </Link>
        </nav>

        {/* Burger */}
        <button
          type="button"
          className="md:hidden flex flex-col justify-center flex-shrink-0"
          onClick={() => setDrawer((v) => !v)}
          aria-label="Menu"
          style={{ gap: 5, width: 46, height: 46, padding: "0 10px", marginRight: -10, background: "none", border: 0, cursor: "pointer" }}
        >
          <span style={{ display: "block", height: 1.5, background: ink }} />
          <span style={{ display: "block", height: 1.5, background: ink }} />
          <span style={{ display: "block", height: 1.5, background: terracotta, width: "60%" }} />
        </button>
      </div>

      {/* Méga-menu desktop */}
      {mega && (
        <div
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          className="hidden md:block absolute left-0 right-0 md-anim-rise"
          style={{ top: "100%", background: "#FFFDF9", borderTop: "1px solid rgba(35,40,31,0.10)", boxShadow: "0 30px 60px -30px rgba(35,40,31,0.28)" }}
        >
          <div
            className="mx-auto max-w-7xl grid"
            style={{ padding: "38px 40px 30px", gridTemplateColumns: "minmax(230px, 300px) 1fr", gap: 48 }}
          >
            <div className="flex flex-col">
              <span className="uppercase" style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.3em", color: terracotta, marginBottom: 18 }}>
                Six univers
              </span>
              {ambiances.map((a, i) => (
                <button
                  key={a.slug}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="flex items-center w-full text-left font-serif"
                  style={{
                    gap: 14,
                    background: i === active ? "#F2EDE3" : "transparent",
                    border: 0,
                    borderBottom: "1px solid rgba(35,40,31,0.07)",
                    padding: "13px 14px",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: a.color }} />
                  <span style={{ fontSize: 20, fontWeight: 500, color: ink }}>{a.name}</span>
                  <span className="ml-auto font-sans" style={{ fontSize: 10, letterSpacing: "0.16em", color: "#A9A29A" }}>5</span>
                </button>
              ))}
              <Link href={`/${AMBIANCE_CATEGORY}`} className="uppercase" style={{ marginTop: 20, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.2em", color: terracotta }}>
                Toutes les ambiances &rarr;
              </Link>
            </div>

            <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
              <Link href={`/${AMBIANCE_CATEGORY}/ambiance-${amb.slug}-salon`} className="block relative overflow-hidden">
                <img src={amb.image} alt={amb.name} style={{ width: "100%", height: 292, objectFit: "cover", display: "block", filter: "saturate(0.94)" }} />
                <span
                  className="absolute left-0 bottom-0 w-full font-serif"
                  style={{ padding: "16px 20px", background: "linear-gradient(to top, rgba(24,30,22,0.82), rgba(24,30,22,0))", color: paper, fontSize: 27, fontWeight: 500 }}
                >
                  {amb.name}
                </span>
              </Link>
              <div>
                <p style={{ margin: "0 0 22px", fontSize: 14.5, lineHeight: 1.75, color: "#5C6154", maxWidth: "46ch" }}>{amb.description}</p>
                <div className="flex flex-col">
                  {readings(amb).map((r) => (
                    <Link
                      key={r.num}
                      href={r.href}
                      className="flex items-baseline"
                      style={{ gap: 12, padding: "10px 0", borderTop: "1px solid rgba(35,40,31,0.08)", fontSize: 14, color: ink }}
                    >
                      <span style={{ fontSize: 10, letterSpacing: "0.14em", color: "#C0B9AF", minWidth: 18 }}>{r.num}</span>
                      <span style={{ flex: 1 }}>{r.title}</span>
                      <span className="uppercase" style={{ fontSize: 9.5, letterSpacing: "0.18em", color: "#A9A29A" }}>{r.tag}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/${AMBIANCE_CATEGORY}/ambiance-${amb.slug}-salon`}
                  className="flex items-center"
                  style={{ gap: 14, marginTop: 20, padding: "15px 18px", background: "#F2EDE3", borderLeft: `2px solid ${terracotta}` }}
                >
                  <span className="font-serif" style={{ fontSize: 30, color: terracotta, lineHeight: 1 }}>5</span>
                  <span className="flex flex-col" style={{ gap: 3 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: ink }}>
                      Les 5 meilleurs produits &mdash; ambiance {amb.adjF}
                    </span>
                    <span style={{ fontSize: 11, letterSpacing: "0.05em", color: "#8C8378" }}>Comparatif + liens Amazon vérifiés</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tiroir mobile */}
      {drawer && (
        <div
          className="md:hidden absolute left-0 right-0 md-anim-slidedown"
          style={{
            top: "100%",
            maxHeight: "calc(100vh - 62px)",
            overflowY: "auto",
            background: "#FFFDF9",
            borderTop: "1px solid rgba(35,40,31,0.10)",
            boxShadow: "0 30px 60px -28px rgba(35,40,31,0.32)",
          }}
        >
          <div style={{ padding: "22px clamp(18px, 5vw, 28px) 30px" }}>
            <span className="block uppercase" style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.3em", color: terracotta, marginBottom: 12 }}>
              Six ambiances
            </span>
            <div className="flex flex-col">
              {ambiances.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${AMBIANCE_CATEGORY}/ambiance-${a.slug}-salon`}
                  onClick={() => setDrawer(false)}
                  className="flex items-center"
                  style={{ gap: 14, minHeight: 54, padding: "8px 2px", borderBottom: "1px solid rgba(35,40,31,0.08)" }}
                >
                  <span style={{ width: 9, height: 9, borderRadius: "50%", flexShrink: 0, background: a.color }} />
                  <span className="font-serif" style={{ fontSize: 22, fontWeight: 500, color: ink }}>{a.name}</span>
                  <span className="ml-auto uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: "#A9A29A" }}>5 lectures</span>
                </Link>
              ))}
            </div>
            <div className="flex flex-col" style={{ marginTop: 20, gap: 2 }}>
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setDrawer(false)}
                  className="flex items-center uppercase"
                  style={{ minHeight: 50, fontSize: 12, fontWeight: 500, letterSpacing: "0.18em", color: "#5C6154", borderBottom: "1px solid rgba(35,40,31,0.06)" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/#serre"
                onClick={() => setDrawer(false)}
                className="flex items-center justify-center uppercase"
                style={{ minHeight: 54, marginTop: 14, background: ink, color: paper, fontSize: 11.5, fontWeight: 500, letterSpacing: "0.2em" }}
              >
                Ma serre
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

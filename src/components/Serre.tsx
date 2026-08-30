"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   LA SERRE — plante tropicale qui pousse pendant la visite.
   Tout est local (localStorage), aucune donnée envoyée.
   Console de test : window.serre.avance(10) / .soif() / .reset()
   ───────────────────────────────────────────────────────────── */

const paper = "#F7F4EE";
const gold = "#C9A87C";
const terracotta = "#A64B2A";
const water = "#7FA7B8";

const SEEDS = [
  { name: "Hibiscus", bloom: "#E0563F", bloom2: "#A62E2A", leaf: "#7DA35C", shape: "round" },
  { name: "Plumeria", bloom: "#F6D98A", bloom2: "#E7A86B", leaf: "#6F9A62", shape: "long" },
  { name: "Oiseau de paradis", bloom: "#E8901F", bloom2: "#B4491B", leaf: "#5C8A5A", shape: "long" },
  { name: "Orchidée Vanda", bloom: "#B47FC4", bloom2: "#7C4E96", leaf: "#6C9163", shape: "narrow" },
  { name: "Frangipanier blanc", bloom: "#F3EAD6", bloom2: "#D9C79C", leaf: "#74A06A", shape: "long" },
  { name: "Héliconia", bloom: "#D6413F", bloom2: "#8E2530", leaf: "#4F8352", shape: "round" },
] as const;

const POTS = [
  { label: "Terre cuite", color: "#B4674A" },
  { label: "Grès sable", color: "#CBB79A" },
  { label: "Vert olive", color: "#6E7A54" },
  { label: "Anthracite", color: "#3A3F3A" },
];

const STAGES = [
  { label: "Graine plantée", at: 0 },
  { label: "Germination", at: 25 },
  { label: "Jeune pousse", at: 75 },
  { label: "Feuillage", at: 180 },
  { label: "Bourgeon", at: 360 },
  { label: "Pleine floraison", at: 660 },
];

const KEY = "md-serre-v1";
const THIRST_LIMIT = 100;
const DROPS_MAX = 3;

type State = {
  seedIdx: number;
  potIdx: number;
  plantName: string;
  seconds: number;
  bonus: number;
  thirst: number;
  planted: boolean;
  drops: number;
};

const INITIAL: State = { seedIdx: 0, potIdx: 0, plantName: "", seconds: 0, bonus: 0, thirst: 0, planted: false, drops: 1 };

export default function Serre() {
  const [s, setS] = useState<State>(INITIAL);
  const [mobile, setMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(s);
  stateRef.current = s;

  const persist = useCallback((next: State) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const update = useCallback(
    (fn: (prev: State) => Partial<State> | null) => {
      setS((prev) => {
        const patch = fn(prev);
        if (!patch) return prev;
        const next = { ...prev, ...patch };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  /* Chargement + horloge + gouttes + API console */
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 900);
    onResize();
    window.addEventListener("resize", onResize);

    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) setS({ ...INITIAL, ...saved, thirst: 0, drops: 1 });
    } catch {}
    setHydrated(true);

    const dropIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          dropIo.unobserve(e.target);
          update((p) => ({ drops: Math.min(DROPS_MAX, p.drops + 1) }));
        });
      },
      { threshold: 0.35 }
    );
    const scanDrops = () => document.querySelectorAll("[data-drop]").forEach((el) => dropIo.observe(el));
    const dropTimer = setTimeout(scanDrops, 800);

    const tick = setInterval(() => {
      if (document.hidden) return;
      update((p) => {
        if (!p.planted) return null;
        if (p.thirst >= THIRST_LIMIT) return null;
        return { thirst: p.thirst + 1, seconds: p.seconds + 1 };
      });
    }, 1000);

    (window as unknown as { serre: unknown }).serre = {
      etat: () => stateRef.current,
      avance: (min = 5) => update((p) => ({ bonus: p.bonus + min * 60 })),
      soif: () => update(() => ({ thirst: THIRST_LIMIT })),
      arrose: () => update(() => ({ thirst: 0 })),
      gouttes: (n: number) => update(() => ({ drops: n })),
      reset: () => {
        try {
          localStorage.removeItem(KEY);
        } catch {}
        setS(INITIAL);
      },
    };

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(dropTimer);
      clearInterval(tick);
      dropIo.disconnect();
    };
  }, [update]);

  const blocked = hydrated && (!s.planted || s.thirst >= THIRST_LIMIT);

  useEffect(() => {
    document.body.style.overflow = blocked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [blocked]);

  /* Croissance */
  const seed = SEEDS[s.seedIdx] ?? SEEDS[0];
  const pot = POTS[s.potIdx] ?? POTS[0];
  const total = s.seconds + s.bonus;
  let stage = 0;
  STAGES.forEach((st, i) => {
    if (total >= st.at) stage = i;
  });
  const ratio = Math.min(1, total / STAGES[STAGES.length - 1].at);
  const stemPx = Math.round(18 + ratio * (mobile ? 210 : 260));
  const leafCount = [0, 1, 2, 4, 6, 8][stage];

  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    const t = (i + 1) / (leafCount + 1);
    const size = 26 + (1 - t) * 34;
    const tilt = 20 + Math.floor(i / 2) * 7;
    return {
      bottom: Math.round(stemPx * (0.14 + t * 0.78)),
      w: Math.round(size * (seed.shape === "long" ? 1.7 : seed.shape === "narrow" ? 1.9 : 1.25)),
      h: Math.round(size * (seed.shape === "narrow" ? 0.34 : 0.6)),
      side,
      rot: side > 0 ? -tilt : tilt,
      radius:
        seed.shape === "round"
          ? side > 0
            ? "60% 40% 60% 40%"
            : "40% 60% 40% 60%"
          : side > 0
          ? "80% 20% 80% 20%"
          : "20% 80% 20% 80%",
    };
  });

  const mins = Math.floor(total / 60);
  const secs = total % 60;
  const displayName = s.plantName || `Votre ${seed.name.toLowerCase()}`;
  const canWater = s.drops > 0 && s.thirst >= THIRST_LIMIT * 0.35;

  const plantVisual = (
    <div className="relative flex flex-col items-center justify-end" style={{ height: "clamp(250px, 60vw, 340px)" }}>
      <span className="flex flex-col items-center justify-end md-anim-sway" style={{ height: "100%" }}>
        {stage >= 4 && (
          <span
            style={{
              display: "block",
              width: stage >= 5 ? (mobile ? 62 : 78) : mobile ? 26 : 32,
              height: stage >= 5 ? (mobile ? 62 : 78) : mobile ? 26 : 32,
              marginBottom: -6,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              background: `radial-gradient(circle at 40% 35%, #FBEFD6, ${seed.bloom} 62%, ${seed.bloom2})`,
              boxShadow: `0 0 26px -6px ${seed.bloom}`,
              animation: "mdBloomIn 1.2s cubic-bezier(0.2,1.2,0.3,1) both",
              zIndex: 2,
            }}
          />
        )}
        <span
          className="relative block"
          style={{
            width: 5,
            height: stemPx,
            background: "linear-gradient(to top, #3E5A38, #6E9155)",
            borderRadius: 3,
            transition: "height 1.4s cubic-bezier(0.22,0.7,0.2,1)",
          }}
        >
          {leaves.map((lf, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: lf.side > 0 ? "calc(50% + 2px)" : "auto",
                right: lf.side > 0 ? "auto" : "calc(50% + 2px)",
                bottom: lf.bottom,
                width: lf.w,
                height: lf.h,
                transformOrigin: lf.side > 0 ? "0 50%" : "100% 50%",
                transform: `rotate(${lf.rot}deg)`,
                borderRadius: lf.radius,
                background: `linear-gradient(${lf.side > 0 ? "to right" : "to left"}, #4C6B41, ${seed.leaf})`,
                animation: "mdLeafIn 0.9s ease-out both",
              }}
            />
          ))}
        </span>
      </span>
      <span
        style={{
          display: "block",
          width: "clamp(90px, 24vw, 120px)",
          height: "clamp(56px, 15vw, 74px)",
          borderRadius: "4px 4px 40% 40%",
          background: `linear-gradient(to bottom, ${pot.color}, rgba(0,0,0,0.35))`,
          boxShadow: "inset 0 6px 0 rgba(0,0,0,0.22)",
        }}
      />
    </div>
  );

  const seedPicker = (min = 52) => (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 46%), 1fr))", gap: 8 }}>
      {SEEDS.map((sp, i) => (
        <button
          key={sp.name}
          type="button"
          onClick={() => update(() => ({ seedIdx: i }))}
          className="flex items-center text-left"
          style={{
            gap: 10,
            minHeight: min,
            padding: "0 14px",
            cursor: "pointer",
            background: i === s.seedIdx ? "rgba(201,168,124,0.16)" : "rgba(247,244,238,0.04)",
            border: `1px solid ${i === s.seedIdx ? "rgba(201,168,124,0.75)" : "rgba(247,244,238,0.14)"}`,
            color: paper,
            fontSize: 13.5,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: sp.bloom }} />
          {sp.name}
        </button>
      ))}
    </div>
  );

  const nameField = (h = 54) => (
    <input
      type="text"
      value={s.plantName}
      onChange={(e) => update(() => ({ plantName: e.target.value }))}
      placeholder="Ex. Joséphine"
      maxLength={22}
      style={{
        width: "100%",
        minHeight: h,
        padding: "0 16px",
        background: "rgba(247,244,238,0.06)",
        border: "1px solid rgba(247,244,238,0.18)",
        color: paper,
        fontSize: 16,
      }}
    />
  );

  const potPicker = (size = 48) => (
    <div className="flex flex-wrap" style={{ gap: 10 }}>
      {POTS.map((p, i) => (
        <button
          key={p.label}
          type="button"
          onClick={() => update(() => ({ potIdx: i }))}
          aria-label={p.label}
          style={{
            width: size,
            height: size,
            borderRadius: "4px 4px 40% 40%",
            cursor: "pointer",
            background: p.color,
            border: `2px solid ${i === s.potIdx ? gold : "rgba(247,244,238,0.16)"}`,
          }}
        />
      ))}
    </div>
  );

  const stepLabel = (t: string) => (
    <span className="block uppercase" style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.26em", color: "rgba(201,168,124,0.9)", marginBottom: 12 }}>
      {t}
    </span>
  );

  return (
    <>
      <section id="serre" style={{ background: "#1F2A21", borderTop: "1px solid rgba(247,244,238,0.10)" }}>
        <div className="mx-auto max-w-7xl" style={{ padding: "clamp(56px, 11vw, 100px) clamp(20px, 5.2vw, 40px)" }}>
          <span className="md-kicker md-kicker-light" style={{ marginBottom: 18 }}>La serre</span>
          <h2 style={{ margin: 0, fontSize: "clamp(32px, 8vw, 50px)", lineHeight: 1.08, color: paper, maxWidth: "22ch" }}>
            Plantez une graine tropicale &mdash; elle pousse pendant votre visite
          </h2>
          <p style={{ margin: "16px 0 clamp(28px, 6vw, 44px)", fontSize: "clamp(14.5px, 3.8vw, 15.5px)", lineHeight: 1.8, color: "rgba(247,244,238,0.68)", maxWidth: "52ch" }}>
            Choisissez une espèce, donnez-lui un nom. Elle grandit à chaque minute passée ici, et vous retrouve à votre prochaine visite.
          </p>

          <div className="grid items-start" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "clamp(24px, 5vw, 48px)" }}>
            <div
              className="relative flex flex-col justify-end overflow-hidden"
              style={{
                minHeight: "clamp(340px, 78vw, 460px)",
                padding: 22,
                background: "linear-gradient(to bottom, rgba(247,244,238,0.06), rgba(247,244,238,0.02))",
                border: "1px solid rgba(247,244,238,0.12)",
              }}
            >
              <span
                className="md-anim-mist"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "8%",
                  width: "clamp(150px, 40vw, 220px)",
                  height: "clamp(150px, 40vw, 220px)",
                  marginLeft: "calc(clamp(150px, 40vw, 220px) / -2)",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at center, rgba(201,168,124,0.22), rgba(201,168,124,0) 70%)",
                  pointerEvents: "none",
                }}
              />
              {plantVisual}
              <div className="relative flex flex-col text-center" style={{ gap: 8, marginTop: 20 }}>
                <span className="font-serif" style={{ fontSize: "clamp(24px, 6vw, 30px)", fontWeight: 500, color: paper }}>{displayName}</span>
                <span className="uppercase" style={{ fontSize: 10, letterSpacing: "0.24em", color: "rgba(201,168,124,0.9)" }}>
                  {STAGES[stage].label} &middot; {seed.name}
                </span>
                <span style={{ display: "block", height: 2, marginTop: 8, background: "rgba(247,244,238,0.14)" }}>
                  <span style={{ display: "block", height: 2, width: `${Math.round(ratio * 100)}%`, background: gold, transition: "width 1s linear" }} />
                </span>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(247,244,238,0.5)" }}>
                  {mins} min {secs < 10 ? `0${secs}` : secs} s sur le site
                </span>
              </div>
            </div>

            <div className="flex flex-col" style={{ gap: 22 }}>
              <div>
                {stepLabel("1 · La graine")}
                {seedPicker()}
              </div>
              <div>
                {stepLabel("2 · Son nom")}
                {nameField()}
              </div>
              <div>
                {stepLabel("3 · Le pot")}
                {potPicker()}
              </div>

              <div
                className="flex items-center justify-between"
                style={{ gap: 12, padding: "14px 16px", background: "rgba(127,167,184,0.10)", border: "1px solid rgba(127,167,184,0.28)" }}
              >
                <span className="uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.24em", color: "rgba(247,244,238,0.6)" }}>Arrosoir</span>
                <span className="font-serif" style={{ fontSize: 22, color: water }}>{s.drops} / {DROPS_MAX}</span>
              </div>

              <div className="flex flex-wrap" style={{ gap: 12, paddingTop: 8 }}>
                <button
                  type="button"
                  onClick={() => update((p) => (p.drops < 1 || p.thirst < THIRST_LIMIT * 0.35 ? null : { bonus: p.bonus + 120, thirst: 0, drops: p.drops - 1 }))}
                  className="uppercase"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 54,
                    padding: "0 24px",
                    background: canWater ? terracotta : "rgba(247,244,238,0.08)",
                    border: 0,
                    color: canWater ? "#FFFDF9" : "rgba(247,244,238,0.4)",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    cursor: "pointer",
                  }}
                >
                  Arroser (+2 min)
                </button>
                <button
                  type="button"
                  onClick={() => update(() => ({ seconds: 0, bonus: 0, thirst: 0, plantName: "", drops: 1 }))}
                  className="uppercase"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 54,
                    padding: "0 20px",
                    background: "none",
                    border: "1px solid rgba(247,244,238,0.22)",
                    color: "rgba(247,244,238,0.7)",
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.2em",
                    cursor: "pointer",
                  }}
                >
                  Nouvelle graine
                </button>
              </div>

              <div className="flex flex-col" style={{ gap: 8 }}>
                <span className="flex items-baseline justify-between uppercase" style={{ gap: 12, fontSize: 10, letterSpacing: "0.22em", color: "rgba(247,244,238,0.55)" }}>
                  <span>Hydratation</span>
                  <span>{s.thirst > THIRST_LIMIT * 0.6 ? "Elle commence à fatiguer" : "Bien arrosée"}</span>
                </span>
                <span style={{ display: "block", height: 2, background: "rgba(247,244,238,0.14)" }}>
                  <span style={{ display: "block", height: 2, width: `${Math.round(Math.min(1, s.thirst / THIRST_LIMIT) * 100)}%`, background: water, transition: "width 1s linear" }} />
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: "rgba(247,244,238,0.55)", maxWidth: "40ch" }}>
                {s.drops < 1
                  ? "Arrosoir vide — descendez explorer une section pour récupérer de l'eau."
                  : s.thirst < THIRST_LIMIT * 0.35
                  ? "Elle n'a pas soif pour l'instant."
                  : "Un arrosage = 1 goutte d'eau."}
              </p>
              <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: "rgba(247,244,238,0.42)", maxWidth: "40ch" }}>
                Votre plante est gardée sur votre appareil uniquement &mdash; aucune donnée envoyée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Porte d'entrée : plantation obligatoire */}
      {hydrated && !s.planted && (
        <div style={{ position: "fixed", inset: 0, zIndex: 220, overflowY: "auto", background: "#1B2419" }}>
          <div
            className="flex flex-col items-center justify-center text-center md-anim-rise"
            style={{ minHeight: "100%", gap: "clamp(20px, 4vw, 30px)", padding: "clamp(30px, 8vw, 64px) clamp(20px, 6vw, 40px)" }}
          >
            <span className="uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.3em", color: gold }}>Avant d&rsquo;entrer</span>
            <h2 style={{ margin: 0, fontSize: "clamp(30px, 8.4vw, 54px)", lineHeight: 1.1, color: paper, maxWidth: "22ch" }}>
              Plantez votre graine tropicale
            </h2>
            <p style={{ margin: 0, fontSize: "clamp(14.5px, 3.8vw, 16px)", lineHeight: 1.75, color: "rgba(247,244,238,0.66)", maxWidth: "42ch" }}>
              Elle grandira tout au long de votre visite. Explorez le site pour remplir l&rsquo;arrosoir et la garder en vie.
            </p>
            <div className="flex flex-col text-left w-full" style={{ gap: 26, maxWidth: 520, marginTop: 8 }}>
              <div>
                {stepLabel("1 · L'espèce")}
                {seedPicker(54)}
              </div>
              <div>
                {stepLabel("2 · Son nom")}
                {nameField(56)}
              </div>
              <div>
                {stepLabel("3 · Le pot")}
                {potPicker(52)}
              </div>
            </div>
            <button
              type="button"
              onClick={() => update(() => ({ planted: true, thirst: 0, drops: 1 }))}
              className="uppercase"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                minHeight: 60,
                marginTop: 6,
                padding: "0 34px",
                background: terracotta,
                border: 0,
                color: "#FFFDF9",
                fontSize: 11.5,
                fontWeight: 500,
                letterSpacing: "0.2em",
                cursor: "pointer",
              }}
            >
              Planter et entrer
              <span style={{ width: 6, height: 6, borderTop: "1.4px solid #FFFDF9", borderRight: "1.4px solid #FFFDF9", transform: "rotate(45deg)" }} />
            </button>
          </div>
        </div>
      )}

      {/* Mur de pause : la plante a soif */}
      {hydrated && s.planted && s.thirst >= THIRST_LIMIT && (
        <div
          className="flex flex-col items-center justify-center text-center md-anim-rise"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            gap: "clamp(18px, 4vw, 26px)",
            padding: "clamp(28px, 8vw, 60px)",
            background: "rgba(19,26,20,0.92)",
            backdropFilter: "blur(10px)",
          }}
        >
          <span className="flex flex-col items-center md-anim-sway">
            <span style={{ display: "block", width: 46, height: 18, borderRadius: "80% 20% 80% 20%", background: "linear-gradient(to right, #4C6B41, #6E8A55)", transform: "rotate(24deg)" }} />
            <span style={{ display: "block", width: 4, height: 46, marginTop: -4, background: "linear-gradient(to top, #3E5A38, #6E9155)", borderRadius: 3, transform: "rotate(6deg)" }} />
          </span>
          <span className="uppercase" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.3em", color: water }}>La serre en pause</span>
          <h2 style={{ margin: 0, fontSize: "clamp(30px, 8vw, 52px)", lineHeight: 1.12, color: paper, maxWidth: "24ch" }}>
            Arrosez {s.plantName || `votre ${seed.name.toLowerCase()}`} &mdash; elle commence à fatiguer
          </h2>
          <p style={{ margin: 0, fontSize: "clamp(14.5px, 3.8vw, 16px)", lineHeight: 1.75, color: "rgba(247,244,238,0.66)", maxWidth: "42ch" }}>
            {s.drops > 0
              ? "Votre visite est suspendue le temps de lui donner un peu d'eau. Sa croissance reprend juste après."
              : "L'arrosoir est vide. Parcourez une nouvelle section du site pour récupérer une goutte, puis revenez l'arroser."}
          </p>
          <span className="uppercase" style={{ fontSize: 10, letterSpacing: "0.24em", color: water }}>Arrosoir {s.drops} / {DROPS_MAX}</span>
          {s.drops > 0 ? (
            <button
              type="button"
              onClick={() => update((p) => ({ thirst: 0, bonus: p.bonus + 120, drops: p.drops - 1 }))}
              className="uppercase"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 58, padding: "0 30px", background: terracotta, border: 0, color: "#FFFDF9", fontSize: 11.5, fontWeight: 500, letterSpacing: "0.2em", cursor: "pointer" }}
            >
              Arroser maintenant
            </button>
          ) : (
            <button
              type="button"
              onClick={() => update(() => ({ thirst: Math.round(THIRST_LIMIT * 0.45) }))}
              className="uppercase"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minHeight: 58, padding: "0 30px", background: "none", border: "1px solid rgba(127,167,184,0.6)", color: "#DCE9EC", fontSize: 11.5, fontWeight: 500, letterSpacing: "0.2em", cursor: "pointer" }}
            >
              Aller chercher de l&rsquo;eau
            </button>
          )}
        </div>
      )}
    </>
  );
}

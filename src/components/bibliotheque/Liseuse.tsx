"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Livre } from "@/lib/bibliotheque";
import s from "@/app/bibliotheque/bibliotheque.module.css";

type Props = { livre: Livre; boutique: { etsy: string; gumroad: string } };

export default function Liseuse({ livre, boutique }: Props) {
  const N = Math.min(livre.extrait, livre.pages);
  const [page, setPage] = useState(1);
  const [anim, setAnim] = useState("");
  const x0 = useRef<number | null>(null);
  const img = (p: number) => `/bibliotheque/livres/${livre.slug}/page-${p}.jpg`;
  const gumroad = livre.gumroad || boutique.gumroad;
  const etsy = livre.etsy || boutique.etsy;

  const aller = useCallback(
    (p: number) => {
      if (p < 1 || p > N + 1) return;
      setAnim(p > page ? s.entreDroite : s.entreGauche);
      setPage(p);
    },
    [N, page]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") aller(page + 1);
      if (e.key === "ArrowLeft") aller(page - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aller, page]);

  useEffect(() => {
    if (page < N) new Image().src = img(page + 1); // précharge la page suivante
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <section className={s.lecteur}>
      <div className={s.barre}>
        <Link href="/bibliotheque" className={s.retour}>← La bibliothèque</Link>
        <h1 className={s.titreLivre}>{livre.titre}</h1>
        <span className={s.prixBarre}>{livre.prix}</span>
      </div>

      <div
        className={s.scene}
        onTouchStart={(e) => { x0.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (x0.current === null) return;
          const dx = e.changedTouches[0].clientX - x0.current;
          x0.current = null;
          if (Math.abs(dx) > 50) aller(page + (dx < 0 ? 1 : -1));
        }}
      >
        {page <= N ? (
          <button
            key={page}
            type="button"
            className={`${s.page} ${anim}`}
            style={{ ["--ratio" as string]: livre.ratio || 0.707 }}
            onClick={() => aller(page + 1)}
            aria-label="Page suivante"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img(page)} alt={`${livre.titre} – page ${page}`} />
          </button>
        ) : (
          <div className={s.fin}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/bibliotheque/livres/${livre.slug}/couverture.jpg`} alt={`Couverture : ${livre.titre}`} />
            <div>
              <div className={s.surtitre}>Fin de l&rsquo;extrait</div>
              <h2>{livre.titre}</h2>
              <p className={s.introFin}>{livre.intro}</p>
              <div className={s.prixFin}>
                {livre.prix} <small>· {livre.pages} pages</small>
              </div>
              {livre.contenu.length > 0 && (
                <ul>{livre.contenu.slice(0, 6).map((c) => <li key={c}>{c}</li>)}</ul>
              )}
              <div className={s.boutonsFin}>
                {gumroad && (
                  <a className={`${s.bouton} ${s.boutonPlein}`} href={gumroad} target="_blank" rel="noopener noreferrer sponsored">
                    Télécharger le livre complet
                  </a>
                )}
                {etsy && (
                  <a className={`${s.bouton} ${gumroad ? s.boutonClair : s.boutonPlein}`} href={etsy} target="_blank" rel="noopener noreferrer">
                    {gumroad ? "Voir sur Etsy" : "Acheter sur Etsy"}
                  </a>
                )}
                <button type="button" className={`${s.bouton} ${s.boutonClair}`} onClick={() => aller(1)}>
                  Revoir depuis la page 1
                </button>
              </div>
              <p className={s.note}>PDF à télécharger immédiatement, à imprimer chez vous autant de fois que vous le souhaitez (usage personnel).</p>
            </div>
          </div>
        )}
      </div>

      <div className={s.nav}>
        <button type="button" className={s.bouton} onClick={() => aller(page - 1)} style={{ visibility: page === 1 ? "hidden" : "visible" }}>
          ← Précédent
        </button>
        <div className={s.compteur}>
          <div>{page <= N ? <>Page <b>{page}</b> / {N} <span className={s.doux}>· extrait</span></> : <b>Fin de l&rsquo;extrait</b>}</div>
          <div className={s.points} aria-hidden="true">
            {Array.from({ length: N + 1 }, (_, i) => <i key={i} className={i === page - 1 ? s.actif : ""} />)}
          </div>
        </div>
        <button type="button" className={s.bouton} onClick={() => aller(page + 1)} style={{ visibility: page > N ? "hidden" : "visible" }}>
          {page === N ? "Fin de l’extrait →" : "Suivant →"}
        </button>
      </div>
    </section>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import type { Livre } from "@/lib/bibliotheque";
import s from "@/app/bibliotheque/bibliotheque.module.css";

export default function Rayonnage({ livres, categories }: { livres: Livre[]; categories: Record<string, string> }) {
  const [cat, setCat] = useState("");
  const cats = [["", "Tous les livres"], ...Object.entries(categories).filter(([k]) => livres.some((l) => l.categorie === k))];
  const liste = cat ? livres.filter((l) => l.categorie === cat) : livres;

  return (
    <>
      <div className={s.filtres} role="group" aria-label="Filtrer par thème">
        {cats.map(([k, nom]) => (
          <button key={k} type="button" className={s.filtre} aria-pressed={cat === k} onClick={() => setCat(k)}>
            {nom}
          </button>
        ))}
      </div>
      <div className={s.grille}>
        {liste.map((l) => (
          <Link key={l.slug} href={`/bibliotheque/${l.slug}`} className={s.carte}>
            <div className={s.couverture}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/bibliotheque/livres/${l.slug}/couverture.jpg`} alt={`Couverture : ${l.titre}`} loading="lazy" />
              <span className={s.feuilleter}>Feuilleter →</span>
            </div>
            <div>
              <h3>{l.titre}</h3>
              <p className={s.sous}>{l.sousTitre}</p>
            </div>
            <div className={s.meta}>
              <span>{l.pages} pages</span>
              <span className={s.prix}>{l.prix}</span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

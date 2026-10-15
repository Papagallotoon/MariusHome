import type { Metadata } from "next";
import { siteConfig } from "../../../config/site";
import { CATEGORIES, LIVRES } from "@/lib/bibliotheque";
import Rayonnage from "@/components/bibliotheque/Rayonnage";
import s from "./bibliotheque.module.css";

const description =
  "Feuilletez gratuitement les livres de Marius Dumas : mandalas, coloriages, carnets, planners et guides à imprimer. Un extrait page par page, puis le livre complet en téléchargement immédiat.";

export const metadata: Metadata = {
  title: "La Bibliothèque – livres et carnets à imprimer",
  description,
  alternates: { canonical: `${siteConfig.domain}/bibliotheque` },
  openGraph: { title: "La Bibliothèque de Marius", description, url: `${siteConfig.domain}/bibliotheque`, images: ["/bibliotheque/img/foret.jpg"] },
};

export default function BibliothequePage() {
  return (
    <div className={s.aile}>
      <header className={s.hero}>
        <div className={s.foret} aria-hidden="true" />
        <div className={`${s.brume} ${s.brume1}`} aria-hidden="true" />
        <div className={`${s.brume} ${s.brume2}`} aria-hidden="true" />
        <div className={s.heroContenu}>
          <svg className={s.enso} viewBox="0 0 100 100" aria-hidden="true"><path d="M78 24 A38 38 0 1 0 84 58" /></svg>
          <div className={s.editions}>La Bibliothèque de Marius</div>
          <h1>Ralentir, créer,<br /><em>respirer</em></h1>
          <p>Des livres à feuilleter comme on se promène en forêt : une page, puis une autre. Mandalas, carnets, coloriages et guides à imprimer.</p>
          <a className={s.bouton} href="#rayons">Entrer dans la bibliothèque <span aria-hidden="true">→</span></a>
          <div className={s.citation}>« Chaque page est un pas sur le chemin. »</div>
        </div>
      </header>

      <section className={s.intro}>
        <div className={`${s.wrap} ${s.introGrille}`}>
          <div className={s.introImage}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/bibliotheque/img/bouddha.jpg" alt="Statue de Bouddha en méditation, mains jointes" loading="lazy" />
          </div>
          <div>
            <div className={s.surtitre}>Feuilletez avant d&rsquo;acheter</div>
            <h2>Prenez le temps de découvrir chaque livre</h2>
            <p>Ici, rien ne presse. Ouvrez un livre, tournez les pages tranquillement, et laissez-vous guider par ce qui vous fait du bien : colorier, vous organiser, écrire, apprendre.</p>
            <ol className={s.etapes}>
              <li><span>1</span><div>Choisissez un livre dans la bibliothèque.</div></li>
              <li><span>2</span><div>Feuilletez l&rsquo;extrait page par page avec « Suivant ».</div></li>
              <li><span>3</span><div>Il vous plaît ? Téléchargez-le en entier, à imprimer chez vous.</div></li>
            </ol>
          </div>
        </div>
      </section>

      <section className={s.rayons} id="rayons">
        <div className={s.wrap}>
          <div className={s.rayonsTete}>
            <div className={s.surtitre}>La bibliothèque</div>
            <h2>{LIVRES.length} livres à feuilleter</h2>
          </div>
          <Rayonnage livres={LIVRES} categories={CATEGORIES} />
        </div>
      </section>
    </div>
  );
}

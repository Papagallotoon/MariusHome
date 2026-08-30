repo: Papagallotoon/MariusHome
branch: main

## Last sync
date: 2026-08-31T00:00:00Z

### Updated in this project
- Accueil A passée en mobile-first (header 62 px, menu tiroir, grilles 1 colonne, cibles ≥ 54 px)
- « Prendre rendez-vous » remplacé par « Écrire à Marius » puis « Ma serre »
- Hero animé : cascade lointaine, brume, Ken Burns, dérive des visuels, apparitions au scroll
- La Serre : plantation obligatoire à l'entrée, 6 espèces, croissance en 6 stades, arrosoir limité (3 gouttes, 1 par section explorée), mur de pause « Arrosez… »

## Sync history
### 2026-08-30T12:10:00Z
- Deux refontes de la page d'accueil (direction verte éditoriale / direction terre & lumière)
- Nouveau menu Ambiances : 6 univers, 5 lectures chacun dont le Top 5 produits
- Typographie et rythme de lecture revus (titres serif, interlignes 1.7–1.9)
- Photos d'ambiance importées et optimisées dans `img/`
- Direction A retenue ; page article « Top 5 produits » créée (liens Amazon + tag affilié)
- Conformité : CMP Consent Mode V2 (4 signaux), mentions légales et politique de confidentialité

## Screen map
| Écran du projet | Fichiers du dépôt |
| --- | --- |
| Accueil A — Vert Editorial.dc.html | src/app/page.tsx, content/homepage.json, content/ambiances.json, src/components/Header.tsx, src/components/AmbianceMegaMenu.tsx, config/site.ts, src/app/globals.css |
| Accueil B — Terre & Lumiere.dc.html | src/app/page.tsx, content/homepage.json, content/ambiances.json, src/components/Header.tsx, src/components/AmbianceMegaMenu.tsx, config/site.ts |
| Article-Top5-Salon-Boheme.dc.html | src/app/[category]/[slug]/page.tsx, src/components/ProductCard.tsx, src/components/AffiliateButton.tsx, src/components/FAQAccordion.tsx, src/lib/affiliate.ts, config/site.ts |
| Consentement.dc.html | — (nouveau, non présent dans le dépôt) |
| Mentions-Legales.dc.html | — (nouveau, non présent dans le dépôt) |
| Politique-Confidentialite.dc.html | — (nouveau, non présent dans le dépôt) |
| img/p-*.jpg | public/images/products/*.jpg |
# Concept — Marius Dumas Home
Direction retenue : A · Vert Éditorial · mobile-first (Pinterest ≈ 80 % mobile)

## 1. Positionnement
Conseil en décoration + sélections d'objets affiliés Amazon.
Six ambiances (Japon, Bohème, Bali, Provençal, Industriel, Indienne), chacune avec
5 lectures : salon, chambre, salle de bain, guide du style, Top 5 produits.

## 2. Identité
- Couleurs : vert profond #23281F / #2C3328 / #1F2A21, crème #F7F4EE / #FFFDF9,
  terracotta #A64B2A, doré #C9A87C.
- Typo : Cormorant Garamond (titres, italiques éditoriales) + Jost (UI, majuscules espacées).
- Photo pleine largeur, saturation légèrement réduite, dégradés sombres pour la lisibilité.

## 3. Mobile-first
- Header 62 px, logo + burger ; menu tiroir plein écran avec les 6 ambiances (cibles ≥ 54 px).
- Hero plein écran en superposition (image de fond + texte) au lieu de la grille 2 colonnes.
- Toutes les grilles en `auto-fit / minmax(min(x, 100%))` → 1 colonne sur mobile sans casse.
- Typo et espacements en `clamp()`, aucun débordement horizontal.
- « Prendre rendez-vous » supprimé — remplacé par « Écrire à Marius » puis « Ma serre ».

## 4. Animation (« que ça prenne vie »)
- Cascade dans la vallée : filets d'eau en dégradés animés + brume qui respire + halo au bassin,
  en `mix-blend-mode: screen` sur la photo du hero.
- Ken Burns lent sur le hero, dérive douce sur les visuels d'ambiances.
- Voile de brume horizontal sur toute la largeur (22 s).
- Apparitions au scroll (IntersectionObserver), indicateur de scroll animé.
- Tout est désactivé sous `prefers-reduced-motion`.

## 5. La Serre (générateur de graine tropicale) — bas de page
- 6 espèces : Hibiscus, Plumeria, Oiseau de paradis, Orchidée Vanda, Frangipanier, Héliconia.
- L'utilisateur choisit l'espèce, le nom de la plante, la couleur du pot.
- La plante grandit avec le temps passé sur le site : 6 stades
  (graine → germination → jeune pousse → feuillage → bourgeon → pleine floraison),
  tige, nombre et forme des feuilles, taille et couleur de la fleur dérivés de l'espèce.
- Bouton « Arroser » (+2 min), « Nouvelle graine », barre de progression, compteur de temps.
- État conservé en localStorage sur l'appareil ; balancement continu de la plante.
- Objectif : temps sur page + retour de visite, sans aucune donnée personnelle.

## 6. Conformité
- Consent Mode V2 : les 4 signaux Google en `denied` par défaut avant tout script.
- Mentions légales + Politique de confidentialité, gestion des cookies en pied de page.
- À faire avant production : CMP certifiée Google (Axeptio / Cookiebot / Didomi),
  HTTPS + HSTS, remplissage des champs entre crochets (raison sociale, SIRET, hébergeur).

## 7. Fichiers
Accueil-A-Vert-Editorial.dc.html · Article-Top5-Salon-Boheme.dc.html ·
Consentement.dc.html · Mentions-Legales.dc.html · Politique-Confidentialite.dc.html

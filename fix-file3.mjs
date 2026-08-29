import { readFileSync, writeFileSync } from 'fs';

const path = 'content/articles/par-ou-commencer-projet-decoration.json';
const data = JSON.parse(readFileSync(path, 'utf8'));

const content = [
  // Etape 1
  '<h2>Étape 1 : Définir son style et ses envies</h2>',
  '<h3>Le mood board : votre meilleur allié</h3>',
  '<p>Avant de dépenser le moindre euro, prenez le temps de <strong>clarifier ce que vous aimez</strong>. La méthode la plus efficace est de créer un mood board (tableau d\'inspiration) sur Pinterest.</p>',
  '<p>Pendant une semaine, épinglez spontanément tout ce qui vous attire : des intérieurs complets, des couleurs, des matières, des ambiances.</p>',
  '<p>Après une trentaine d\'épingles, analysez votre mood board : quelles couleurs reviennent le plus ? Quels matériaux ? Quelles ambiances ? Vous verrez émerger naturellement votre style personnel — souvent un mélange unique de 2-3 courants décoratifs.</p>',
  '<h3>Posez-vous les bonnes questions</h3>',
  '<ul><li>Comment vivez-vous au quotidien dans cet espace ? (Détente, travail, réception, famille...)</li><li>Quelles sont les contraintes (budget, location, luminosité, taille) ?</li><li>Quelles pièces sont prioritaires ?</li><li>Quel est votre budget global ?</li><li>Avez-vous des meubles à conserver absolument ?</li></ul>',

  '<hr>',

  // Etape 2
  '<h2>Étape 2 : Analyser l\'existant</h2>',
  '<h3>L\'audit déco de votre intérieur</h3>',
  '<p>Faites le tour de chaque pièce avec un <strong>œil critique mais bienveillant</strong>. Photographiez chaque espace — les photos révèlent souvent des choses qu\'on ne voit plus à force d\'y vivre.</p>',
  '<p>Pour chaque pièce, notez :</p>',
  '<ul><li><strong>Ce qui fonctionne</strong> : les meubles que vous aimez, les éléments architecturaux (moulures, cheminée, grandes fenêtres)</li><li><strong>Ce qui ne fonctionne pas</strong> : les meubles à remplacer, les couleurs qui vous déplaisent, les zones mortes ou encombrées</li><li><strong>La lumière naturelle</strong> : quand la pièce est-elle la plus lumineuse ? Les zones d\'ombre ?</li><li><strong>Les volumes</strong> : hauteur sous plafond, taille de la pièce, proportions</li></ul>',
  '<h3>Mesurez tout !</h3>',
  '<p>C\'est fastidieux mais essentiel : mesurez chaque pièce, chaque mur, chaque ouverture. Notez la position des prises électriques, des radiateurs, des fenêtres.</p>',
  '<p>Vous pouvez utiliser des applications comme MagicPlan pour créer un plan facilement avec votre smartphone.</p>',

  '<hr>',

  // Etape 3
  '<h2>Étape 3 : Définir sa palette de couleurs</h2>',
  '<h3>La règle du 60-30-10</h3>',
  '<blockquote><p>La règle du 60-30-10 est LA règle d\'or de la décoration que même les professionnels utilisent.</p></blockquote>',
  '<p>Voici comment l\'appliquer :</p>',
  '<ul><li><strong>60%</strong> de couleur dominante : c\'est la couleur des murs et des grands meubles. Optez pour un ton neutre et apaisant (blanc cassé, beige, gris clair).</li><li><strong>30%</strong> de couleur secondaire : c\'est la couleur du canapé, des rideaux, du tapis. Elle apporte de la profondeur.</li><li><strong>10%</strong> de couleur accent : ce sont les coussins, les vases, les objets déco. C\'est la touche de personnalité.</li></ul>',
  '<h3>Comment choisir ses couleurs ?</h3>',
  '<p>Partez de ce que vous avez : un meuble que vous adorez, un tableau qui vous inspire, un tissu qui vous plaît. Extrayez 3-4 couleurs de cet élément et construisez votre palette autour. Des outils comme Coolors.co ou Adobe Color vous aident à créer des palettes harmonieuses.</p>',
  '<p>Tenez compte de la <strong>lumière naturelle</strong> : les pièces très lumineuses supportent les couleurs sombres, tandis que les pièces peu éclairées gagnent à rester dans des tons clairs et chauds.</p>',

  '<hr>',

  // Etape 4
  '<h2>Étape 4 : Prioriser les investissements</h2>',
  '<h3>La hiérarchie des achats déco</h3>',
  '<p>Vous ne pouvez pas tout faire en même temps, ni tout acheter d\'un coup.</p>',
  '<p>Voici l\'ordre de priorité recommandé :</p>',
  '<ol><li><strong>La peinture</strong> : c\'est le changement le plus impactant pour le moindre coût. Un mur repeint transforme instantanément une pièce.</li><li><strong>Les textiles</strong> : rideaux, coussins, plaids, tapis. Changement immédiat d\'ambiance pour un budget modéré.</li><li><strong>L\'éclairage</strong> : remplacez les plafonniers basiques par des suspensions design. La lumière fait 50% de l\'ambiance.</li><li><strong>Le mobilier principal</strong> : canapé, table à manger, lit. Ce sont des investissements à long terme, choisissez-les bien.</li><li><strong>L\'art mural</strong> : cadres, tableaux, miroirs. Personnalisez vos murs.</li><li><strong>Les accessoires</strong> : vases, bougies, plantes, objets déco. Les touches finales qui font toute la différence.</li></ol>',
  '<h3>Le budget réaliste par pièce</h3>',
  '<ul><li><strong>Salon complet</strong> (sans canapé) : 300-800 \u20ac en déco et accessoires</li><li><strong>Chambre</strong> : 200-500 \u20ac en textiles et éclairage</li><li><strong>Entrée</strong> : 100-300 \u20ac (miroir, patère, console)</li><li><strong>Salle de bain</strong> : 50-200 \u20ac en accessoires</li></ul>',

  '<hr>',

  // Etape 5
  '<h2>Étape 5 : Commencer pièce par pièce</h2>',
  '<h3>Ne faites pas tout en même temps</h3>',
  '<p>L\'erreur la plus courante est de vouloir décorer tout l\'appartement d\'un coup. Résultat : on s\'éparpille, on dépasse le budget et on se retrouve avec un intérieur incohérent.</p>',
  '<p><strong>Concentrez-vous sur une pièce à la fois</strong>, en commençant par celle où vous passez le plus de temps (souvent le salon ou la chambre).</p>',
  '<h3>L\'ordre dans une pièce</h3>',
  '<ol><li><strong>Les murs</strong> : peinture, papier peint</li><li><strong>Le sol</strong> : tapis (si nécessaire)</li><li><strong>Le mobilier principal</strong> : positionnez d\'abord les gros meubles</li><li><strong>Les textiles</strong> : rideaux, coussins, plaids</li><li><strong>L\'éclairage</strong> : suspensions, lampes</li><li><strong>L\'art mural</strong> : cadres, miroirs, étagères</li><li><strong>Les accessoires</strong> : vases, bougies, plantes, objets déco</li></ol>',

  '<hr>',

  // Etape 6
  '<h2>Étape 6 : Les finitions qui font la différence</h2>',
  '<h3>La règle des nombres impairs</h3>',
  '<blockquote><p>En déco, les groupes impairs (3 vases, 5 coussins, 3 cadres) sont plus esthétiques que les groupes pairs. C\'est un principe de design bien établi qui crée un équilibre visuel dynamique et naturel.</p></blockquote>',
  '<h3>Les niveaux de hauteur</h3>',
  '<p>Variez toujours les hauteurs sur une étagère ou une console : un objet haut, un moyen et un petit. Cette variation crée du rythme et de l\'intérêt visuel.</p>',
  '<h3>La touche verte</h3>',
  '<p>Les plantes sont les meilleurs accessoires déco : elles apportent vie, couleur et purification de l\'air. Même si vous n\'avez pas la main verte, il existe des plantes quasi indestructibles : pothos, sansevieria, zamioculcas, succulentes.</p>',
  '<h3>Les senteurs</h3>',
  '<p>La déco, ce n\'est pas que visuel ! Une bougie parfumée, un diffuseur ou des fleurs fraîches ajoutent une dimension sensorielle qui rend un intérieur vraiment accueillant.</p>',

  '<hr>',

  // Etape 7
  '<h2>Étape 7 : Vivre avec sa déco et ajuster</h2>',
  '<p>Un intérieur réussi n\'est jamais \u00ab terminé \u00bb. Il évolue avec vous, avec les saisons, avec vos découvertes.</p>',
  '<p>Donnez-vous le temps de <strong>vivre dans votre espace</strong> avant de conclure que c\'est fini. Parfois, un vide sur une étagère a besoin de rester vide. Parfois, un coussin de trop doit partir.</p>',
  '<blockquote><p>L\'astuce des décorateurs professionnels : après avoir terminé une pièce, <strong>retirez un élément</strong>. Souvent, c\'est ce \u00ab moins \u00bb qui fait toute la différence entre un intérieur chargé et un intérieur maîtrisé.</p></blockquote>',
].join('');

data.content = content;

writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');

// Verify valid JSON
const verified = JSON.parse(readFileSync(path, 'utf8'));
const c = verified.content;
console.log('File 3 FIXED - par-ou-commencer-projet-decoration.json');
console.log('Has 7 h2 tags:', (c.match(/<h2>/g) || []).length);
console.log('Has 6 hr tags:', (c.match(/<hr>/g) || []).length);
console.log('Has 3 blockquotes:', (c.match(/<blockquote>/g) || []).length);
console.log('No broken tags:', !c.includes('<hr> :'));
console.log('All Étape headings present:',
  c.includes('Étape 1') && c.includes('Étape 2') && c.includes('Étape 3') &&
  c.includes('Étape 4') && c.includes('Étape 5') && c.includes('Étape 6') &&
  c.includes('Étape 7'));

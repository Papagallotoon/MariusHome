import { readFileSync } from 'fs';

const files = [
  'content/articles/guide-styles-deco-lequel-choisir.json',
  'content/articles/notions-architecture-interieure-debutants.json',
  'content/articles/par-ou-commencer-projet-decoration.json',
];

for (const file of files) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  const c = data.content;
  console.log(`\n=== ${file.split('/').pop()} ===`);
  console.log('Valid JSON: true');
  console.log('h2 tags:', (c.match(/<h2>/g) || []).length);
  console.log('hr tags:', (c.match(/<hr>/g) || []).length);
  console.log('blockquotes:', (c.match(/<blockquote>/g) || []).length);
  console.log('No broken tags:', !c.includes('<hr> :'));

  // Check for unclosed tags
  const openH2 = (c.match(/<h2>/g) || []).length;
  const closeH2 = (c.match(/<\/h2>/g) || []).length;
  console.log('h2 balanced:', openH2 === closeH2);

  const openP = (c.match(/<p>/g) || []).length;
  const closeP = (c.match(/<\/p>/g) || []).length;
  console.log('p balanced:', openP === closeP);

  const openBq = (c.match(/<blockquote>/g) || []).length;
  const closeBq = (c.match(/<\/blockquote>/g) || []).length;
  console.log('blockquote balanced:', openBq === closeBq);

  const openUl = (c.match(/<ul>/g) || []).length;
  const closeUl = (c.match(/<\/ul>/g) || []).length;
  console.log('ul balanced:', openUl === closeUl);

  const openOl = (c.match(/<ol>/g) || []).length;
  const closeOl = (c.match(/<\/ol>/g) || []).length;
  console.log('ol balanced:', openOl === closeOl);
}

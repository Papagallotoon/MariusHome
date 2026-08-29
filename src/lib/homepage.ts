import fs from "fs";
import path from "path";

interface HomepageData {
  hero: {
    backgroundImage: string;
    backgroundOverlayOpacity: number;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaPrimary: { label: string; href: string };
    ctaSecondary: { label: string; href: string };
  };
  features: {
    items: { title: string; description: string }[];
  };
  categoriesSection: { title: string; subtitle: string };
  articlesSection: { title: string; subtitle: string; count: number };
  cta: { title: string; subtitle: string; buttonLabel: string };
}

const HOMEPAGE_PATH = path.join(process.cwd(), "content", "homepage.json");

export function getHomepageData(): HomepageData {
  const raw = fs.readFileSync(HOMEPAGE_PATH, "utf-8");
  return JSON.parse(raw);
}

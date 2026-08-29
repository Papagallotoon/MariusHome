import fs from "fs";
import path from "path";
import type { Article } from "@/types";
const dir = path.join(process.cwd(), "content", "articles");
export function getAllArticles(): Article[] {
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as Article).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
export function getArticleBySlug(slug: string): Article | undefined { return getAllArticles().find((a) => a.slug === slug); }
export function getArticlesByCategory(cat: string): Article[] { return getAllArticles().filter((a) => a.category === cat); }
export function getFeaturedArticle(): Article { return getAllArticles()[0]; }

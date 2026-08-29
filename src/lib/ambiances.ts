import fs from "fs";
import path from "path";
import type { Ambiance, Article } from "@/types";
import { getAllArticles } from "./articles";

const ambiancesPath = path.join(process.cwd(), "content", "ambiances.json");
function load(): Ambiance[] { return JSON.parse(fs.readFileSync(ambiancesPath, "utf-8")); }
export function getAllAmbiances(): Ambiance[] { return load(); }
export function getAmbianceBySlug(slug: string): Ambiance | undefined { return load().find((a) => a.slug === slug); }
export function getAmbianceArticle(style: string, room: string): Article | undefined {
  return getAllArticles().find((a) => a.ambianceStyle === style && a.ambianceRoom === room);
}

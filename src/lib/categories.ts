import fs from "fs";
import path from "path";
import type { Category } from "@/types";
const categoriesPath = path.join(process.cwd(), "content", "categories.json");
function load(): Category[] { return JSON.parse(fs.readFileSync(categoriesPath, "utf-8")); }
export function getAllCategories(): Category[] { return load(); }
export function getCategoryBySlug(slug: string): Category | undefined { return load().find((c) => c.slug === slug); }

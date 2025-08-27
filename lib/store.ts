// lib/store.ts
import type { Recipe } from "@/types";

const FAV_KEY = "sr_favorites";
const RATINGS_KEY = "sr_ratings";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- Favorites ---------- */
export function getFavorites(): string[] {
  const arr = readJSON<string[]>(FAV_KEY, []);
  return Array.isArray(arr) ? arr : [];
}

export function toggleFavorite(id: string) {
  const set = new Set(getFavorites());
  set.has(id) ? set.delete(id) : set.add(id);
  writeJSON(FAV_KEY, Array.from(set));
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

/* ---------- Ratings ---------- */
export function setRating(id: string, rating: number) {
  const map = readJSON<Record<string, number>>(RATINGS_KEY, {});
  map[id] = Number(rating) || 0;
  writeJSON(RATINGS_KEY, map);
}

export function getRating(id: string): number {
  const map = readJSON<Record<string, number>>(RATINGS_KEY, {});
  return Number(map[id] || 0);
}

/* ---------- Suggestions ---------- */
export function suggested(recipes: Recipe[]): Recipe[] {
  const ratings = readJSON<Record<string, number>>(RATINGS_KEY, {});
  const topRatedIds = Object.entries(ratings)
    .filter(([, v]) => Number(v) >= 4)
    .map(([k]) => k);

  const cuisineCount = new Map<string, number>();
  for (const r of recipes) {
    if (topRatedIds.includes(r.id)) {
      cuisineCount.set(r.cuisine, (cuisineCount.get(r.cuisine) || 0) + 1);
    }
  }

  const topCuisine = Array.from(cuisineCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!topCuisine) return recipes.slice(0, 6);
  return recipes.filter((r) => r.cuisine === topCuisine).slice(0, 6);
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("sr_favorites") || "[]"); } catch { return []; }
}
export function toggleFavorite(id: string) {
  if (typeof window === "undefined") return;
  const set = new Set(getFavorites());
  set.has(id) ? set.delete(id) : set.add(id);
  localStorage.setItem("sr_favorites", JSON.stringify(Array.from(set)));
}
export function isFavorite(id: string): boolean { return getFavorites().includes(id); }

export function setRating(id: string, rating: number) {
  if (typeof window === "undefined") return;
  const key = "sr_ratings";
  const map = JSON.parse(localStorage.getItem(key) || "{}");
  map[id] = rating;
  localStorage.setItem(key, JSON.stringify(map));
}
export function getRating(id: string): number {
  if (typeof window === "undefined") return 0;
  const key = "sr_ratings";
  const map = JSON.parse(localStorage.getItem(key) || "{}");
  return map[id] || 0;
}

import type { Recipe } from "@/types";
export function suggested(recipes: Recipe[]): Recipe[] {
  if (typeof window === "undefined") return [];
  const ratings = JSON.parse(localStorage.getItem("sr_ratings") || "{}");
  const top = Object.entries(ratings).filter(([_, v]) => v >= 4).map(([k]) => k);
  const cuisines = new Map<string, number>();
  for (const r of recipes) if (top.includes(r.id)) cuisines.set(r.cuisine, (cuisines.get(r.cuisine) || 0) + 1);
  const topCuisine = Array.from(cuisines.entries()).sort((a,b)=>b[1]-a[1])[0]?.[0];
  if (!topCuisine) return recipes.slice(0,6);
  return recipes.filter(r=>r.cuisine===topCuisine).slice(0,6);
}

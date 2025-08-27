import { Recipe } from "@/types";
import { normalizeIngredient, tokenize } from "./normalize";
export type MatchInput = { ingredients: string[]; dietary?: string[]; difficulty?: string; maxTime?: number; };
export type MatchResult = { recipe: Recipe; score: number; missing: string[]; matched: string[]; };
function ingredientSet(arr:string[]):Set<string>{ const s=new Set<string>(); for(const a of arr){ tokenize(a).forEach(t=>s.add(t)); } return s; }
export function matchRecipes(recipes:Recipe[], input:MatchInput):MatchResult[]{
  const userSet = ingredientSet(input.ingredients);
  const filtered = recipes.filter(r=>{
    if (input.dietary && input.dietary.length>0){ for(const tag of input.dietary){ if(!r.dietary.includes(tag as any)) return false; } }
    if (input.difficulty && r.difficulty!==input.difficulty) return false;
    if (input.maxTime && r.time_min>input.maxTime) return false;
    return true;
  });
  const results:MatchResult[] = filtered.map(r=>{
    const ing = r.ingredients.map(i=>normalizeIngredient(i.name));
    const reqSet = ingredientSet(ing);
    const matched:string[]=[]; const missing:string[]=[];
    for (const req of reqSet){ if(userSet.has(req)) matched.push(req); else missing.push(req); }
    const coverage = matched.length / (matched.length + missing.length);
    const penalty = missing.length * 0.05;
    const score = Math.max(0, coverage - penalty);
    return { recipe:r, score, missing, matched };
  });
  return results.filter(r=>r.score>0.12).sort((a,b)=>b.score-a.score).slice(0,18);
}

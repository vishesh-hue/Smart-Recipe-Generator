"use client";
import { Recipe } from "@/types";
import { isFavorite, toggleFavorite, getRating, setRating } from "@/lib/store";
import { useEffect, useState } from "react";
export default function RecipeCard({ recipe, servings=2 }: { recipe: Recipe; servings?: number }) {
  const [fav, setFav] = useState(false); const [rating, setRate] = useState(0);
  useEffect(()=>{ setFav(isFavorite(recipe.id)); setRate(getRating(recipe.id)); },[recipe.id]);
  function toggleFav(){ toggleFavorite(recipe.id); setFav(isFavorite(recipe.id)); }
  function rate(n:number){ setRating(recipe.id,n); setRate(n); }
  const scale = servings / recipe.servings;
  const nutr = {
    calories: Math.round(recipe.nutrition_per_serving.calories * scale),
    protein_g: Math.round(recipe.nutrition_per_serving.protein_g * scale),
    carbs_g: Math.round(recipe.nutrition_per_serving.carbs_g * scale),
    fat_g: Math.round(recipe.nutrition_per_serving.fat_g * scale),
  };
  return (<div className="card p-4 space-y-2">
    <div className="flex items-start justify-between gap-3">
      <div><h4 className="text-xl font-semibold">{recipe.title}</h4>
        <div className="text-xs text-slate-400">{recipe.cuisine} • {recipe.time_min} min • {recipe.difficulty}</div>
        <div className="flex gap-1 mt-1 flex-wrap">{recipe.dietary.map(d=><span key={d} className="badge">{d}</span>)}</div></div>
      <button className="btn" onClick={toggleFav}>{fav ? "★ Saved" : "☆ Save"}</button>
    </div>
    <details className="mt-2"><summary className="cursor-pointer text-sm text-slate-300">Ingredients (scaled for {servings} serving{servings>1?'s':''})</summary>
      <ul className="list-disc ml-6 mt-2 text-sm">{recipe.ingredients.map((i,idx)=>(<li key={idx}>{i.qty?Math.round((i.qty||0)*scale*10)/10+" ":""}{i.unit?i.unit+" ":""}{i.name}{i.optional?" (optional)":""}</li>))}</ul>
    </details>
    <details><summary className="cursor-pointer text-sm text-slate-300">Steps</summary>
      <ol className="list-decimal ml-6 mt-2 text-sm space-y-1">{recipe.steps.map((s,i)=><li key={i}>{s}</li>)}</ol></details>
    <div className="text-sm text-slate-300"><span className="badge mr-2">~{nutr.calories} kcal</span><span className="badge mr-2">P {nutr.protein_g}g</span><span className="badge mr-2">C {nutr.carbs_g}g</span><span className="badge">F {nutr.fat_g}g</span></div>
    <div className="flex items-center gap-2 pt-2"><span className="text-sm text-slate-300">Rate:</span>{[1,2,3,4,5].map(n=>(<button key={n} className={`text-lg ${n<=rating?'text-yellow-400':'text-slate-500'}`} onClick={()=>rate(n)}>★</button>))}</div>
  </div>);
}

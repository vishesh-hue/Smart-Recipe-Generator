"use client";
import { useEffect, useMemo, useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import IngredientImage from "@/components/IngredientImage";
import Filters from "@/components/Filters";
import RecipeCard from "@/components/RecipeCard";
import { Recipe } from "@/types";
import { suggested } from "@/lib/store";

export default function HomePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<{dietary: string[]; difficulty?: string; maxTime?: number; servings?: number}>({ dietary: [], servings: 2 });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetch("/api/recipes").then(r=>r.json()).then(setRecipes); }, []);

  async function match() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/match", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, dietary: filters.dietary, difficulty: filters.difficulty, maxTime: filters.maxTime }) });
      const data = await res.json();
      if (data.error) setError(data.error);
      setResults(data.results || []);
    } catch (e: any) { setError(e?.message || "match failed"); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (ingredients.length) match(); }, [filters]); // run when filters change
  useEffect(() => { if (!ingredients.length) { setResults([]); return; } const t = setTimeout(()=>match(), 400); return ()=>clearTimeout(t); }, [ingredients]); // debounced

  const suggestions = useMemo(() => suggested(recipes), [recipes]);

  return (<main className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-4">
        <IngredientInput onAdd={(ing)=>{ setIngredients(prev=>Array.from(new Set([...prev, ...ing.split(',').map(s=>s.trim())]))); }} />
        <IngredientImage onDetected={(items)=>setIngredients(prev=>Array.from(new Set([...prev, ...items])))} />
        <div className="card p-4">
          <h3 className="text-lg font-medium">Added Ingredients</h3>
          <div className="flex gap-2 flex-wrap mt-3">
            {ingredients.map((ing,i)=>(<span key={i} className="badge">{ing}<button className="ml-2 text-slate-400" onClick={()=>setIngredients(prev=>prev.filter(x=>x!==ing))}>✕</button></span>))}
            {ingredients.length===0 && <p className="text-sm text-slate-400">No ingredients yet. Add some or upload a photo.</p>}
          </div>
          <div className="mt-4 flex gap-2"><button className="btn" onClick={match} disabled={!ingredients.length||loading}>{loading?"Matching...":"Find Recipes"}</button>
            <button className="btn" onClick={()=>{setIngredients([]); setResults([]);}}>Clear</button></div>
        </div>
      </div>
      <div><Filters onChange={setFilters} /></div>
    </div>

    {error && <div className="card p-4 text-red-300 text-sm">Error: {error}</div>}

    <section className="space-y-3">
      <h3 className="text-xl font-semibold">Results</h3>
      {results.length===0 && <p className="text-sm text-slate-400">No results yet. Try adding ingredients or relax filters.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((r:any)=>(<RecipeCard key={r.recipe.id} recipe={r.recipe} servings={filters.servings} />))}
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold">Suggestions for you</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {suggestions.map((rec)=>(<RecipeCard key={rec.id} recipe={rec} servings={filters.servings} />))}
      </div>
    </section>
  </main>);
}

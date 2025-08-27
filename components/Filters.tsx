"use client";
import { useState } from "react";
type Props = { onChange: (state: { dietary: string[]; difficulty?: string; maxTime?: number; servings?: number }) => void }
export default function Filters({ onChange }: Props) {
  const [dietary, setDietary] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("");
  const [maxTime, setMaxTime] = useState<number | undefined>();
  const [servings, setServings] = useState<number>(2);
  function toggle(tag: string){ const next = dietary.includes(tag) ? dietary.filter(t=>t!==tag) : [...dietary, tag]; setDietary(next); onChange({ dietary: next, difficulty, maxTime, servings }); }
  function updateDifficulty(v: string){ setDifficulty(v); onChange({ dietary, difficulty: v||undefined, maxTime, servings }); }
  function updateTime(v: string){ const n = v ? parseInt(v) : undefined; setMaxTime(n); onChange({ dietary, difficulty, maxTime:n, servings }); }
  function updateServings(v: string){ const n = Math.max(1, parseInt(v||"1")); setServings(n); onChange({ dietary, difficulty, maxTime, servings:n }); }
  const tags = ["vegetarian","vegan","gluten-free","dairy-free","nut-free","egg-free"];
  return (<div className="card p-4">
    <h3 className="text-lg font-medium">Filters & Preferences</h3>
    <div className="flex flex-wrap gap-2 mt-3">{tags.map(t=>(<button key={t} className={`badge ${dietary.includes(t)?'bg-slate-800':''}`} onClick={()=>toggle(t)}>{t}</button>))}</div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
      <select className="select" value={difficulty} onChange={(e)=>updateDifficulty(e.target.value)}>
        <option value="">Any difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
      </select>
      <input className="input" type="number" placeholder="Max time (min)" onChange={(e)=>updateTime(e.target.value)} />
      <input className="input" type="number" value={servings} onChange={(e)=>updateServings(e.target.value)} min={1} />
    </div>
    <p className="text-xs text-slate-400 mt-2">Serving size scales ingredient quantities & nutrition.</p>
  </div>);
}

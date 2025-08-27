"use client";
import { useState } from "react";
export default function IngredientInput({ onAdd }: { onAdd: (ing: string) => void }) {
  const [val, setVal] = useState("");
  return (<div className="card p-4">
    <h3 className="text-lg font-medium">Your Ingredients</h3>
    <div className="flex gap-2 mt-3">
      <input className="input" placeholder="e.g., tomato, onion, basil" value={val}
        onChange={(e)=>setVal(e.target.value)}
        onKeyDown={(e)=>{ if (e.key==='Enter' && val.trim()) { onAdd(val.trim()); setVal(''); } }} />
      <button className="btn" onClick={()=>{ if (val.trim()) { onAdd(val.trim()); setVal(''); } }}>Add</button>
    </div>
    <p className="text-xs text-slate-400 mt-2">Press Enter to add multiple items quickly.</p>
  </div>);
}

"use client";
import { useState } from "react";
export default function IngredientImage({ onDetected }: { onDetected: (items: string[]) => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true); setCaption(null); setError(null);
    const form = new FormData(); form.append("image", file);
    try {
      const res = await fetch("/api/vision", { method: "POST", body: form });
      const data = await res.json();
      if (data.error) setError(data.error);
      setCaption(data.caption || null);
      if (Array.isArray(data.ingredients) && data.ingredients.length) onDetected(data.ingredients);
    } catch (e: any) { setError(e?.message || "failed"); }
    finally { setLoading(false); }
  }
  return (<div className="card p-4">
    <div className="flex items-center justify-between">
      <div><h3 className="text-lg font-medium">Ingredient from Photo</h3><p className="text-sm text-slate-400">Upload a clear ingredient/food photo.</p></div>
      <label className="btn cursor-pointer">Upload<input type="file" accept="image/*" onChange={handleChange} className="hidden" /></label>
    </div>
    {preview && <img src={preview} alt="preview" className="mt-3 rounded-xl max-h-56 object-contain mx-auto" />}
    {loading && <p className="mt-2 text-sm text-slate-400">Detecting...</p>}
    {caption && <p className="mt-2 text-sm text-slate-400">Caption: {caption}</p>}
    {error && <p className="mt-2 text-sm text-red-400">Vision error: {error}</p>}
  </div>);
}

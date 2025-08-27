Smart Recipe Generator

Turn a fridge photo (or a few typed ingredients) into cookable recipes with steps, nutrition, filters, and smart substitutions.

Features

Image → ingredients (Gemini 1.5-Flash)

Optional BLIP fallback (Hugging Face)

Dietary filters (veg, vegan, gluten-free…)

Time & difficulty filters

Serving size scaling

Per-serving nutrition (kcal, P/C/F)

Favorites ⭐ and ratings ★1–5

“Suggestions for you” based on ratings

80+ curated recipes across cuisines

How it works

We extract structured ingredients from photos, normalize names (e.g., mozzarella → cheese), then match against the recipe database by token coverage with a small penalty for missing items. Missing items trigger substitution suggestions.

Run locally
npm i
npm run dev
# http://localhost:3000 (health: /api/health)


Create .env.local:

GEMINI_API_KEY=your_google_ai_studio_key
HF_TOKEN=your_huggingface_token   # optional

Deploy

Import the repo in Vercel, add the same environment variables (Production + Preview), and deploy. Check /api/health for { "gemini": true, "hf": true }.

Tech

Next.js 14 (App Router), TypeScript, Tailwind. Recipes stored as JSON; favorites/ratings in localStorage. Clean error states and loading indicators for a smooth UX.

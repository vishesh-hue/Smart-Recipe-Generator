# Smart Recipe Generator

Turn a fridge photo (or a few typed ingredients) into **cookable recipes** with clear steps, nutrition, filters, and smart substitutions.

## Features

* Image → ingredients via **Gemini 1.5-Flash** (free tier)
* Optional **Hugging Face BLIP** fallback
* Dietary filters (vegetarian, vegan, gluten-free, etc.)
* Time & difficulty filters
* Serving size scaling
* Per-serving nutrition (kcal, protein, carbs, fat)
* ⭐ Favorites, ★ ratings, and personalized suggestions
* **80+** curated recipes across cuisines

## Approach

The app focuses on *cookability* and resilient UX. Photos are processed by Gemini 1.5-Flash with a strict prompt to return compact JSON `{ingredients[], caption}`; if unavailable, BLIP captioning provides a fallback signal. Ingredient names are normalized and de-noised (e.g., *mozzarella → cheese*, *capsicum → bell pepper*), then tokenized. Matching scores coverage of recipe tokens present in user input with a small penalty per missing unique item; filters (dietary, time, difficulty) apply **before** scoring. Each recipe includes step-by-step instructions and per-serving nutrition; changing servings scales both quantities and macros. Missing items trigger a small substitution dictionary (e.g., milk → oat/almond/soy; paneer → tofu). Favorites and ratings persist in `localStorage`, and “Suggestions for you” surface cuisines you rate highly. Error states are explicit (vision/match), with loading indicators and empty states tuned for mobile.

## Tech

**Next.js 14** (App Router), **TypeScript**, **Tailwind**. Static JSON recipe database; UI state in the client; lightweight API routes for vision, matching, health, and data.

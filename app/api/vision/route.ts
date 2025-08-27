import { NextRequest, NextResponse } from "next/server";

const GEMINI_MODEL = "gemini-1.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini(imageB64: string, mime: string, apiKey: string) {
  const prompt = [
    "You extract grocery-style ingredient keywords visible in the image.",
    "Rules:",
    '- return ONLY a compact JSON object: {"ingredients": string[], "caption": string}',
    "- ingredients: lowercase, singular where possible, 1-3 words max, common pantry terms (e.g., tomato, mozzarella, basil, onion, bell pepper, olives, cheese, chicken).",
    "- exclude utensils, plates, table, sauces you cannot see, brand names.",
    "- max 15 ingredients.",
    "- caption: a short 6-12 word description of the food (e.g., 'margherita pizza with basil and mozzarella').",
  ].join("\n");

  const body = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inline_data: { mime_type: mime || "image/jpeg", data: imageB64 } },
        ],
      },
    ],
  };

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as any;
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p: any) => p?.text || "").join(" ").trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { ingredients: [] as string[], caption: "" as string };

  try {
    const obj = JSON.parse(jsonMatch[0]);
    const ingredients: string[] = Array.isArray(obj.ingredients)
      ? (obj.ingredients as string[]).slice(0, 20)
      : [];
    const caption: string = typeof obj.caption === "string" ? obj.caption : "";
    return { ingredients, caption };
  } catch {
    return { ingredients: [] as string[], caption: "" as string };
  }
}

async function callHF(bytes: ArrayBuffer, token: string) {
  const HF_MODEL = "Salesforce/blip-image-captioning-base";
  const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

  const res = await fetch(HF_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: bytes,
  });

  if (!res.ok) return { ingredients: [] as string[], caption: "" as string };

  const data: unknown = await res.json();
  const caption: string =
    Array.isArray(data) && (data as any)[0]?.generated_text
      ? (data as any)[0].generated_text
      : "";

  const base = caption.toLowerCase().replace(/[^a-z\s]/g, " ");
  const words: string[] = base.split(/\s+/).filter((s): s is string => s.length > 0);

  const blacklist = new Set<string>([
    "a",
    "an",
    "the",
    "with",
    "and",
    "of",
    "on",
    "in",
    "is",
    "are",
    "to",
    "some",
    "bowl",
    "plate",
    "dish",
    "food",
    "pizza",
    "pasta",
    "curry",
    "soup",
    "salad",
  ]);

  const WHITELIST = new Set<string>([
    "tomato",
    "tomatoes",
    "onion",
    "onions",
    "garlic",
    "ginger",
    "potato",
    "potatoes",
    "carrot",
    "carrots",
    "cucumber",
    "bell",
    "pepper",
    "peppers",
    "bread",
    "egg",
    "eggs",
    "milk",
    "butter",
    "cheese",
    "paneer",
    "chicken",
    "rice",
    "flour",
    "yogurt",
    "banana",
    "apple",
    "spinach",
    "lettuce",
    "broccoli",
    "cauliflower",
    "lemon",
    "lime",
    "cilantro",
    "coriander",
    "chili",
    "beans",
    "chickpeas",
    "lentils",
    "tofu",
    "mushroom",
    "mushrooms",
    "oil",
    "olive",
    "olives",
    "pasta",
    "noodles",
    "avocado",
    "mozzarella",
    "basil",
    "capsicum",
    "pepperoni",
    "sausage",
  ]);

  const candidates: string[] = Array.from(
    new Set(words.filter((w: string) => !blacklist.has(w)))
  );

  const ingredients: string[] = candidates.filter((w: string) => WHITELIST.has(w));

  return {
    ingredients: ingredients.length ? ingredients : candidates.slice(0, 5),
    caption,
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    if (!file)
      return NextResponse.json({
        ingredients: [] as string[],
        caption: "" as string,
        error: "no file",
      });

    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = buf.toString("base64");
    const mime = file.type || "image/jpeg";

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    const HF_TOKEN = process.env.HF_TOKEN;

    if (GEMINI_KEY) {
      try {
        const out = await callGemini(b64, mime, GEMINI_KEY);
        return NextResponse.json(out);
      } catch (e: any) {
        if (!HF_TOKEN) {
          return NextResponse.json(
            {
              ingredients: [] as string[],
              caption: "" as string,
              error: e?.message || "gemini failed",
            },
            { status: 200 }
          );
        }
      }
    }

  

    return NextResponse.json(
      {
        ingredients: [] as string[],
        caption: "" as string,
        error: "No vision provider configured",
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        ingredients: [] as string[],
        caption: "" as string,
        error: e?.message || "vision error",
      },
      { status: 200 }
    );
  }
}

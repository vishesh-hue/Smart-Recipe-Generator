import { NextRequest, NextResponse } from "next/server";
import { RECIPES } from "@/lib/recipes";
import { matchRecipes } from "@/lib/match";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients = [], dietary = [], difficulty, maxTime } = body || {};
    const results = matchRecipes(RECIPES, { ingredients, dietary, difficulty, maxTime });
    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Match failed" }, { status: 400 });
  }
}

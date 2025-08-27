import { NextResponse } from "next/server";
import { RECIPES } from "@/lib/recipes";
export async function GET(){ return NextResponse.json(RECIPES); }

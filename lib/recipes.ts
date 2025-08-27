import data from "@/public/recipes.json";
import { Recipe } from "@/types";
export const RECIPES = data as unknown as Recipe[];

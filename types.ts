export type Nutrition = { calories: number; protein_g: number; carbs_g: number; fat_g: number; };
export type Ingredient = { name: string; qty?: number; unit?: string; optional?: boolean; };
export type Recipe = { id: string; title: string; cuisine: string; servings: number; time_min: number; difficulty: "easy"|"medium"|"hard"; dietary: ("vegetarian"|"vegan"|"gluten-free"|"dairy-free"|"nut-free"|"egg-free")[]; ingredients: Ingredient[]; steps: string[]; nutrition_per_serving: Nutrition; };

const stop = new Set(["fresh","ground","powder","chopped","diced","sliced","large","small"]);
const synonyms: Record<string,string> = {
  "mozzarella":"cheese","capsicum":"bell pepper","curd":"yogurt","maida":"wheat flour","coriander":"cilantro","garbanzo":"chickpeas","chilies":"chili","chillies":"chili"
};
function applySynonyms(w:string){return synonyms[w]||w;}
export function normalizeIngredient(raw:string):string{
  return raw.toLowerCase().replace(/[^a-z\s-]/g," ").split(/\s+/).filter(Boolean).filter(w=>!stop.has(w)).map(applySynonyms).join(" ").trim();
}
export function tokenize(s:string):Set<string>{ return new Set(normalizeIngredient(s).split(/\s|,|\//).filter(Boolean)); }

// Client for USDA FoodData Central (free, no-cost government food database).
// https://fdc.nal.usda.gov/api-guide — get a free personal API key at
// https://fdc.nal.usda.gov/api-key-signup (instant, no payment) and set
// USDA_FDC_API_KEY. Falls back to the public DEMO_KEY (rate-limited to
// 30 req/hour, 50/day) if unset.

const NUTRIENT_IDS = {
  calories: 1008,
  proteinG: 1003,
  carbsG: 1005,
  fatG: 1004,
  fiberG: 1079,
  sugarG: 2000,
  sodiumMg: 1093,
  calciumMg: 1087,
  potassiumMg: 1092,
  magnesiumMg: 1090,
} as const;

export type ExternalFood = {
  externalId: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number | null;
  sugarG: number | null;
  sodiumMg: number | null;
  calciumMg: number | null;
  potassiumMg: number | null;
  magnesiumMg: number | null;
};

type UsdaFoodNutrient = {
  nutrientId: number;
  value: number;
};

type UsdaFoodItem = {
  fdcId: number;
  description: string;
  brandOwner?: string;
  dataType: string;
  foodNutrients: UsdaFoodNutrient[];
};

function nutrientValue(nutrients: UsdaFoodNutrient[], id: number): number {
  const match = nutrients.find((n) => n.nutrientId === id);
  return match ? match.value : 0;
}

export async function searchUsdaFoods(query: string, pageSize = 15): Promise<ExternalFood[]> {
  const apiKey = process.env.USDA_FDC_API_KEY || "DEMO_KEY";
  const url = new URL("https://api.nal.usda.gov/fdc/v1/foods/search");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("pageSize", String(pageSize));
  url.searchParams.set("dataType", "Foundation,SR Legacy,Survey (FNDDS),Branded");

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
  if (!res.ok) return [];

  const data = (await res.json()) as { foods?: UsdaFoodItem[] };
  const foods = data.foods ?? [];

  return foods
    .map((f) => {
      const n = f.foodNutrients ?? [];
      const calories = nutrientValue(n, NUTRIENT_IDS.calories);
      if (calories <= 0) return null;

      const food: ExternalFood = {
        externalId: `usda:${f.fdcId}`,
        name: f.description,
        brand: f.brandOwner,
        servingSize: 100,
        servingUnit: "g",
        calories: Math.round(calories),
        proteinG: Math.round(nutrientValue(n, NUTRIENT_IDS.proteinG) * 10) / 10,
        carbsG: Math.round(nutrientValue(n, NUTRIENT_IDS.carbsG) * 10) / 10,
        fatG: Math.round(nutrientValue(n, NUTRIENT_IDS.fatG) * 10) / 10,
        fiberG: n.some((x) => x.nutrientId === NUTRIENT_IDS.fiberG)
          ? Math.round(nutrientValue(n, NUTRIENT_IDS.fiberG) * 10) / 10
          : null,
        sugarG: n.some((x) => x.nutrientId === NUTRIENT_IDS.sugarG)
          ? Math.round(nutrientValue(n, NUTRIENT_IDS.sugarG) * 10) / 10
          : null,
        sodiumMg: n.some((x) => x.nutrientId === NUTRIENT_IDS.sodiumMg)
          ? Math.round(nutrientValue(n, NUTRIENT_IDS.sodiumMg))
          : null,
        calciumMg: n.some((x) => x.nutrientId === NUTRIENT_IDS.calciumMg)
          ? Math.round(nutrientValue(n, NUTRIENT_IDS.calciumMg))
          : null,
        potassiumMg: n.some((x) => x.nutrientId === NUTRIENT_IDS.potassiumMg)
          ? Math.round(nutrientValue(n, NUTRIENT_IDS.potassiumMg))
          : null,
        magnesiumMg: n.some((x) => x.nutrientId === NUTRIENT_IDS.magnesiumMg)
          ? Math.round(nutrientValue(n, NUTRIENT_IDS.magnesiumMg))
          : null,
      };
      return food;
    })
    .filter((f): f is ExternalFood => f !== null);
}

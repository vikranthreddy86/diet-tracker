import { prisma } from "@/lib/prisma";
import { dateStrToDate } from "@/lib/date";

export type NutritionTrendPoint = {
  date: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
  calciumMg: number;
  potassiumMg: number;
  magnesiumMg: number;
};

export async function getNutritionTrend(
  userId: string,
  startDateStr: string,
  endDateStr: string
): Promise<NutritionTrendPoint[]> {
  const start = dateStrToDate(startDateStr);
  const end = dateStrToDate(endDateStr);

  const entries = await prisma.foodLogEntry.findMany({
    where: { userId, date: { gte: start, lte: end } },
    include: { food: true },
  });

  const byDate = new Map<string, NutritionTrendPoint>();
  for (const d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    byDate.set(key, {
      date: key,
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
      sodiumMg: 0,
      calciumMg: 0,
      potassiumMg: 0,
      magnesiumMg: 0,
    });
  }

  for (const e of entries) {
    const key = e.date.toISOString().slice(0, 10);
    const point = byDate.get(key);
    if (!point) continue;
    const mult = e.servingMultiplier;
    point.calories += e.food.calories * mult;
    point.proteinG += e.food.proteinG * mult;
    point.carbsG += e.food.carbsG * mult;
    point.fatG += e.food.fatG * mult;
    point.fiberG += (e.food.fiberG ?? 0) * mult;
    point.sodiumMg += (e.food.sodiumMg ?? 0) * mult;
    point.calciumMg += (e.food.calciumMg ?? 0) * mult;
    point.potassiumMg += (e.food.potassiumMg ?? 0) * mult;
    point.magnesiumMg += (e.food.magnesiumMg ?? 0) * mult;
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

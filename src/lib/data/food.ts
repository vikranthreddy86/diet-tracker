import { prisma } from "@/lib/prisma";
import { dateStrToDate } from "@/lib/date";

export async function searchFoods(userId: string, query: string) {
  const q = query.trim();
  if (!q) return [];

  return prisma.food.findMany({
    where: {
      AND: [
        { name: { contains: q, mode: "insensitive" } },
        { OR: [{ source: "system" }, { source: "usda" }, { createdByUserId: userId }] },
      ],
    },
    take: 20,
    orderBy: { name: "asc" },
  });
}

export async function getAllFoods(userId: string) {
  return prisma.food.findMany({
    where: { OR: [{ source: "system" }, { source: "usda" }, { createdByUserId: userId }] },
    orderBy: [{ name: "asc" }],
  });
}

export type DailyTotals = {
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

export async function getDailyLog(userId: string, dateStr: string) {
  const date = dateStrToDate(dateStr);

  const entries = await prisma.foodLogEntry.findMany({
    where: { userId, date },
    include: { food: true },
    orderBy: { loggedAt: "asc" },
  });

  const totals: DailyTotals = entries.reduce(
    (acc, e) => {
      const mult = e.servingMultiplier;
      acc.calories += e.food.calories * mult;
      acc.proteinG += e.food.proteinG * mult;
      acc.carbsG += e.food.carbsG * mult;
      acc.fatG += e.food.fatG * mult;
      acc.fiberG += (e.food.fiberG ?? 0) * mult;
      acc.sodiumMg += (e.food.sodiumMg ?? 0) * mult;
      acc.calciumMg += (e.food.calciumMg ?? 0) * mult;
      acc.potassiumMg += (e.food.potassiumMg ?? 0) * mult;
      acc.magnesiumMg += (e.food.magnesiumMg ?? 0) * mult;
      return acc;
    },
    {
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
      sodiumMg: 0,
      calciumMg: 0,
      potassiumMg: 0,
      magnesiumMg: 0,
    }
  );

  return { entries, totals };
}

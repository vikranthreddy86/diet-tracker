import { PrismaClient } from "@prisma/client";
import { indianFoods } from "./seed-foods";
import { genericFoods } from "./seed-foods-generic";
import { micronutrients } from "./seed-micronutrients";

const prisma = new PrismaClient();

async function main() {
  const missing = [...indianFoods, ...genericFoods]
    .map((f) => f.name)
    .filter((name) => !(name in micronutrients));
  if (missing.length > 0) {
    console.warn(`No micronutrient data for: ${missing.join(", ")}`);
  }

  const allFoods = [
    ...indianFoods.map((f) => ({ ...f, isIndian: true, ...micronutrients[f.name] })),
    ...genericFoods.map((f) => ({ ...f, isIndian: false, ...micronutrients[f.name] })),
  ];

  for (const food of allFoods) {
    const existing = await prisma.food.findFirst({
      where: { name: food.name, source: "system" },
    });

    if (existing) {
      await prisma.food.update({ where: { id: existing.id }, data: food });
    } else {
      await prisma.food.create({ data: { ...food, source: "system" } });
    }
  }

  console.log(`Seeded ${allFoods.length} foods (${indianFoods.length} Indian, ${genericFoods.length} generic).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

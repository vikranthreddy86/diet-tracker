import { PrismaClient } from "@prisma/client";
import { indianFoods } from "./seed-foods";
import { genericFoods } from "./seed-foods-generic";

const prisma = new PrismaClient();

async function main() {
  const allFoods = [
    ...indianFoods.map((f) => ({ ...f, isIndian: true })),
    ...genericFoods.map((f) => ({ ...f, isIndian: false })),
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

import { PrismaClient } from "@prisma/client";
import { indianFoods } from "./seed-foods";

const prisma = new PrismaClient();

async function main() {
  for (const food of indianFoods) {
    const existing = await prisma.food.findFirst({
      where: { name: food.name, source: "system" },
    });

    if (existing) {
      await prisma.food.update({ where: { id: existing.id }, data: { ...food, isIndian: true } });
    } else {
      await prisma.food.create({ data: { ...food, isIndian: true, source: "system" } });
    }
  }

  console.log(`Seeded ${indianFoods.length} Indian foods.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

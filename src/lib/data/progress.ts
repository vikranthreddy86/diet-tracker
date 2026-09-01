import { prisma } from "@/lib/prisma";

export async function getWeightEntries(userId: string, limit = 90) {
  return prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function getMeasurementTypesWithEntries(userId: string, limit = 90) {
  return prisma.measurementType.findMany({
    where: { userId, archived: false },
    orderBy: { sortOrder: "asc" },
    include: {
      entries: {
        orderBy: { date: "desc" },
        take: limit,
      },
    },
  });
}

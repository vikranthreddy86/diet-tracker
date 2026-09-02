import { prisma } from "@/lib/prisma";
import { dateStrToDate } from "@/lib/date";

export async function hasWeightEntryForDate(userId: string, dateStr: string) {
  const entry = await prisma.weightEntry.findUnique({
    where: { userId_date: { userId, date: dateStrToDate(dateStr) } },
    select: { id: true },
  });
  return entry !== null;
}

export async function hasMeasurementEntryForDate(userId: string, dateStr: string) {
  const entry = await prisma.measurementEntry.findFirst({
    where: { userId, date: dateStrToDate(dateStr) },
    select: { id: true },
  });
  return entry !== null;
}

export async function hasActiveMeasurementTypes(userId: string) {
  const count = await prisma.measurementType.count({ where: { userId, archived: false } });
  return count > 0;
}

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

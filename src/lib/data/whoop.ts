import { prisma } from "@/lib/prisma";
import { dateStrToDate } from "@/lib/date";

export async function getWhoopConnection(userId: string) {
  return prisma.whoopConnection.findUnique({ where: { userId } });
}

export async function getWhoopEnergyForDate(userId: string, dateStr: string) {
  return prisma.whoopDailyEnergy.findUnique({
    where: { userId_date: { userId, date: dateStrToDate(dateStr) } },
  });
}

export async function getWhoopEnergyRange(userId: string, startDateStr: string, endDateStr: string) {
  return prisma.whoopDailyEnergy.findMany({
    where: {
      userId,
      date: { gte: dateStrToDate(startDateStr), lte: dateStrToDate(endDateStr) },
    },
    orderBy: { date: "asc" },
  });
}

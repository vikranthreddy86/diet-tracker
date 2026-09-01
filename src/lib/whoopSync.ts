import "server-only";
import { prisma } from "@/lib/prisma";
import { fetchCycles } from "@/lib/whoop";
import { dateStrToDate, addDaysToDateStr, todayIST } from "@/lib/date";

/** Fetches the last 30 days of Whoop cycles and upserts them into WhoopDailyEnergy. */
export async function syncCyclesForUser(userId: string, accessToken: string) {
  const end = todayIST();
  const start = addDaysToDateStr(end, -30);
  const cycles = await fetchCycles(
    accessToken,
    dateStrToDate(start).toISOString(),
    new Date().toISOString()
  );

  for (const cycle of cycles) {
    await prisma.whoopDailyEnergy.upsert({
      where: { userId_date: { userId, date: dateStrToDate(cycle.date) } },
      update: {
        caloriesBurned: cycle.caloriesBurned,
        strain: cycle.strain,
        cycleStart: cycle.cycleStart,
        cycleEnd: cycle.cycleEnd,
      },
      create: {
        userId,
        date: dateStrToDate(cycle.date),
        caloriesBurned: cycle.caloriesBurned,
        strain: cycle.strain,
        cycleStart: cycle.cycleStart,
        cycleEnd: cycle.cycleEnd,
      },
    });
  }

  await prisma.whoopConnection.update({
    where: { userId },
    data: { lastSyncedAt: new Date() },
  });

  return cycles.length;
}

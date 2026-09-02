import "server-only";
import { prisma } from "@/lib/prisma";
import { fetchCycles, fetchRecovery, fetchSleep, fetchWorkoutDays } from "@/lib/whoop";
import { dateStrToDate, addDaysToDateStr, todayIST } from "@/lib/date";

/** Fetches the last 30 days of Whoop cycles, recovery, sleep, and workouts, merged by day. */
export async function syncCyclesForUser(userId: string, accessToken: string) {
  const end = todayIST();
  const start = addDaysToDateStr(end, -30);
  const startIso = dateStrToDate(start).toISOString();
  const endIso = new Date().toISOString();

  // Each pulls from a separate OAuth scope — a connection authorized before a
  // scope was added (or one that only grants a subset) shouldn't break the
  // whole sync, so failures here degrade to "no data for that category."
  const [cycles, recovery, sleep, workouts] = await Promise.all([
    fetchCycles(accessToken, startIso, endIso),
    fetchRecovery(accessToken, startIso, endIso).catch(() => []),
    fetchSleep(accessToken, startIso, endIso).catch(() => []),
    fetchWorkoutDays(accessToken, startIso, endIso).catch(() => []),
  ]);

  const recoveryByDate = new Map(recovery.map((r) => [r.date, r]));
  const sleepByDate = new Map(sleep.map((s) => [s.date, s]));
  const workoutByDate = new Map(workouts.map((w) => [w.date, w]));

  for (const cycle of cycles) {
    const rec = recoveryByDate.get(cycle.date);
    const sl = sleepByDate.get(cycle.date);
    const wk = workoutByDate.get(cycle.date);

    const data = {
      caloriesBurned: cycle.caloriesBurned,
      strain: cycle.strain,
      cycleStart: cycle.cycleStart,
      cycleEnd: cycle.cycleEnd,
      recoveryScore: rec?.recoveryScore ?? null,
      hrvMs: rec?.hrvMs ?? null,
      restingHeartRate: rec?.restingHeartRate ?? null,
      sleepPerformancePct: sl?.sleepPerformancePct ?? null,
      sleepMinutes: sl?.sleepMinutes ?? null,
      workoutCount: wk?.count ?? null,
      workoutSummary: wk?.summary ?? null,
    };

    await prisma.whoopDailyEnergy.upsert({
      where: { userId_date: { userId, date: dateStrToDate(cycle.date) } },
      update: data,
      create: { userId, date: dateStrToDate(cycle.date), ...data },
    });
  }

  await prisma.whoopConnection.update({
    where: { userId },
    data: { lastSyncedAt: new Date() },
  });

  return cycles.length;
}

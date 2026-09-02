import { dateStrToDate, addDaysToDateStr } from "@/lib/date";

export type ProjectionPoint = { date: string; actual: number | null; projected: number | null };

export type WeightProjection = {
  chartData: ProjectionPoint[];
  weeklyRateKg: number;
  onTrack: boolean;
  etaDate: string | null;
  daysRemaining: number | null;
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/**
 * Fits a least-squares trend line through recent weight entries and, if it's
 * heading toward the target, projects forward to estimate an arrival date.
 * Requires at least 3 entries — a shorter history is too noisy to trend.
 */
export function computeWeightProjection(
  entries: { date: string; weightKg: number }[],
  targetWeightKg: number | null
): WeightProjection | null {
  if (!targetWeightKg || entries.length < 3) return null;

  const firstMs = dateStrToDate(entries[0].date).getTime();
  const points = entries.map((e) => ({
    x: (dateStrToDate(e.date).getTime() - firstMs) / 86_400_000,
    y: e.weightKg,
  }));

  const n = points.length;
  const meanX = points.reduce((a, p) => a + p.x, 0) / n;
  const meanY = points.reduce((a, p) => a + p.y, 0) / n;
  const num = points.reduce((a, p) => a + (p.x - meanX) * (p.y - meanY), 0);
  const den = points.reduce((a, p) => a + (p.x - meanX) ** 2, 0);
  const slope = den === 0 ? 0 : num / den; // kg per day
  const intercept = meanY - slope * meanX;

  const latest = entries[entries.length - 1];
  const latestX = points[points.length - 1].x;
  const onTrack =
    (targetWeightKg < latest.weightKg && slope < -0.001) ||
    (targetWeightKg > latest.weightKg && slope > 0.001);

  let etaDate: string | null = null;
  let daysRemaining: number | null = null;

  if (onTrack) {
    const targetX = (targetWeightKg - intercept) / slope;
    const daysFromNow = Math.round(targetX - latestX);
    if (daysFromNow > 0) {
      daysRemaining = daysFromNow;
      etaDate = addDaysToDateStr(latest.date, daysFromNow);
    }
  }

  const chartData: ProjectionPoint[] = entries.map((e) => ({
    date: e.date,
    actual: round1(e.weightKg),
    projected: null,
  }));

  if (onTrack && daysRemaining) {
    chartData[chartData.length - 1].projected = chartData[chartData.length - 1].actual;
    const steps = Math.min(12, Math.max(1, Math.ceil(daysRemaining / 7)));
    for (let i = 1; i <= steps; i++) {
      const day = Math.min(daysRemaining, Math.round((daysRemaining * i) / steps));
      chartData.push({
        date: addDaysToDateStr(latest.date, day),
        actual: null,
        projected: round1(latest.weightKg + slope * day),
      });
    }
  }

  return {
    chartData,
    weeklyRateKg: round1(slope * 7),
    onTrack,
    etaDate,
    daysRemaining,
  };
}

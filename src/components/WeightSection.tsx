import { logWeight, deleteWeightEntry } from "@/lib/actions/progress";
import { updateTargetWeight } from "@/lib/actions/settings";
import TrendChart from "./TrendChart";
import WeightProjectionChart from "./WeightProjectionChart";
import { computeWeightProjection } from "@/lib/weightProjection";
import { todayIST, formatDateLabel } from "@/lib/date";
import { inputClass } from "@/lib/ui";
import { ScaleIcon } from "./icons";

type WeightEntry = { id: string; date: Date; weightKg: number; note: string | null };

export default function WeightSection({
  entries,
  targetWeightKg,
}: {
  entries: WeightEntry[];
  targetWeightKg: number | null;
}) {
  const ascending = [...entries]
    .reverse()
    .map((e) => ({ date: e.date.toISOString().slice(0, 10), weightKg: e.weightKg }));

  const latest = entries[0];
  const projection = computeWeightProjection(ascending, targetWeightKg);

  return (
    <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-md shadow-stone-900/5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
          <ScaleIcon className="h-4 w-4 text-emerald-800" /> Weight
        </h2>
        {latest && (
          <span className="text-xs text-slate-400">
            Latest <span className="font-semibold text-emerald-600">{latest.weightKg} kg</span>
          </span>
        )}
      </div>

      <form action={updateTargetWeight} className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            Target weight (kg)
          </label>
          <input
            name="targetWeightKg"
            type="number"
            step="0.1"
            min="1"
            defaultValue={targetWeightKg ?? ""}
            placeholder="e.g. 70"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
        >
          Save
        </button>
      </form>

      {projection ? (
        <>
          <WeightProjectionChart data={projection.chartData} targetWeightKg={targetWeightKg!} />
          {projection.onTrack && projection.etaDate ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              At {Math.abs(projection.weeklyRateKg)} kg/week, you&apos;re on track to hit{" "}
              {targetWeightKg}kg by{" "}
              <span className="font-semibold">{formatDateLabel(projection.etaDate)}</span> (
              {projection.daysRemaining} days).
            </p>
          ) : (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              Your recent trend ({projection.weeklyRateKg > 0 ? "+" : ""}
              {projection.weeklyRateKg} kg/week) isn&apos;t heading toward {targetWeightKg}kg yet
              — keep logging and it&apos;ll update.
            </p>
          )}
        </>
      ) : (
        <TrendChart
          data={ascending.map((e) => ({ date: e.date, value: e.weightKg }))}
          unit="kg"
          color="#10b981"
        />
      )}
      {targetWeightKg && !projection && entries.length > 0 && (
        <p className="text-xs text-slate-400">
          Log a few more weigh-ins to see a prediction for reaching {targetWeightKg}kg.
        </p>
      )}

      <form action={logWeight} className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
          <input
            type="date"
            name="date"
            defaultValue={todayIST()}
            max={todayIST()}
            required
            className={inputClass}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">Weight (kg)</label>
          <input type="number" name="weightKg" step="0.1" min="1" required className={inputClass} />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-emerald-950 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
        >
          Log
        </button>
      </form>

      {entries.length > 0 && (
        <ul className="max-h-40 space-y-1 overflow-y-auto">
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-sm"
            >
              <span className="text-slate-500">{e.date.toISOString().slice(0, 10)}</span>
              <span className="font-medium text-slate-900">{e.weightKg} kg</span>
              <form action={deleteWeightEntry}>
                <input type="hidden" name="id" value={e.id} />
                <button
                  type="submit"
                  className="ml-2 text-slate-300 hover:text-rose-500"
                  aria-label="Remove entry"
                >
                  ×
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import {
  addMeasurementType,
  addStandardMeasurementTypes,
  archiveMeasurementType,
  logMeasurementEntry,
  deleteMeasurementEntry,
} from "@/lib/actions/progress";
import TrendChart from "./TrendChart";
import { todayIST } from "@/lib/date";
import { inputClass } from "@/lib/ui";
import { RulerIcon } from "./icons";

type MeasurementType = {
  id: string;
  name: string;
  unit: string;
  entries: { id: string; date: Date; value: number }[];
};

const COLORS = ["#8b5cf6", "#0ea5e9", "#f97316", "#ec4899", "#14b8a6", "#84cc16"];

export default function MeasurementsSection({ types }: { types: MeasurementType[] }) {
  return (
    <section className="space-y-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-md shadow-stone-900/5">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
        <RulerIcon className="h-4 w-4 text-emerald-800" /> Body measurements
      </h2>

      <form action={addMeasurementType} className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-slate-500">New measurement</label>
          <input name="name" placeholder="e.g. Waist" required className={inputClass} />
        </div>
        <div className="w-20">
          <label className="mb-1 block text-xs font-medium text-slate-500">Unit</label>
          <input name="unit" placeholder="cm" required className={inputClass} />
        </div>
        <button
          type="submit"
          className="rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
        >
          Add
        </button>
      </form>

      {types.length === 0 && (
        <div className="space-y-2 text-center">
          <p className="text-xs text-slate-400">
            No measurement types yet. Start with the common ones people track while losing
            weight, or add your own above.
          </p>
          <form action={addStandardMeasurementTypes}>
            <button
              type="submit"
              className="rounded-full bg-emerald-950 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-900"
            >
              + Add standard set (Waist, Chest, Hips, Neck, Arms, Thighs, Body Fat %)
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 lg:items-start">
        {types.map((t, i) => {
          const chartData = [...t.entries]
            .reverse()
            .map((e) => ({ date: e.date.toISOString().slice(0, 10), value: e.value }));
          const latest = t.entries[0];
          const color = COLORS[i % COLORS.length];

          return (
            <div key={t.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800">
                  {t.name} <span className="text-xs font-normal text-slate-400">({t.unit})</span>
                </p>
                <div className="flex items-center gap-3">
                  {latest && (
                    <span className="text-xs text-slate-400">
                      Latest{" "}
                      <span className="font-semibold" style={{ color }}>
                        {latest.value} {t.unit}
                      </span>
                    </span>
                  )}
                  <form action={archiveMeasurementType}>
                    <input type="hidden" name="id" value={t.id} />
                    <button type="submit" className="text-xs text-slate-300 hover:text-rose-500">
                      Archive
                    </button>
                  </form>
                </div>
              </div>

              <TrendChart data={chartData} unit={t.unit} color={color} />

              <form action={logMeasurementEntry} className="mt-2 flex items-end gap-2">
                <input type="hidden" name="measurementTypeId" value={t.id} />
                <div className="flex-1">
                  <input
                    type="date"
                    name="date"
                    defaultValue={todayIST()}
                    max={todayIST()}
                    required
                    className={inputClass}
                  />
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    name="value"
                    step="0.1"
                    required
                    placeholder={t.unit}
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-950 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
                >
                  Log
                </button>
              </form>

              {t.entries.length > 0 && (
                <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto">
                  {t.entries.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between rounded-lg bg-white px-3 py-1 text-xs"
                    >
                      <span className="text-slate-400">{e.date.toISOString().slice(0, 10)}</span>
                      <span className="font-medium text-slate-700">
                        {e.value} {t.unit}
                      </span>
                      <form action={deleteMeasurementEntry}>
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
            </div>
          );
        })}
      </div>
    </section>
  );
}

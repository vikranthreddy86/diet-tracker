import { logWeight, deleteWeightEntry } from "@/lib/actions/progress";
import TrendChart from "./TrendChart";
import { todayIST } from "@/lib/date";
import { inputClass } from "@/lib/ui";

type WeightEntry = { id: string; date: Date; weightKg: number; note: string | null };

export default function WeightSection({ entries }: { entries: WeightEntry[] }) {
  const chartData = [...entries]
    .reverse()
    .map((e) => ({ date: e.date.toISOString().slice(0, 10), value: e.weightKg }));

  const latest = entries[0];

  return (
    <section className="space-y-3 rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">⚖️ Weight</h2>
        {latest && (
          <span className="text-xs text-slate-400">
            Latest <span className="font-semibold text-emerald-600">{latest.weightKg} kg</span>
          </span>
        )}
      </div>

      <TrendChart data={chartData} unit="kg" color="#10b981" />

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
          className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600"
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

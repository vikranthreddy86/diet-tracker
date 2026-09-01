import { updateGoals } from "@/lib/actions/settings";
import { inputClass } from "@/lib/ui";

type Goals = {
  dailyCalorieGoal: number | null;
  proteinGoalG: number | null;
  carbsGoalG: number | null;
  fatGoalG: number | null;
  fiberGoalG: number | null;
};

const FIELDS = [
  { name: "dailyCalorieGoal", label: "Calories (kcal)" },
  { name: "proteinGoalG", label: "Protein (g)" },
  { name: "carbsGoalG", label: "Carbs (g)" },
  { name: "fatGoalG", label: "Fat (g)" },
  { name: "fiberGoalG", label: "Fiber (g)" },
] as const;

export default function GoalsSection({ goals }: { goals: Goals }) {
  return (
    <section className="space-y-3 rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">🎯 Daily targets</h2>
        <p className="text-xs text-slate-400">
          Set these to see progress bars on the Today page. Leave blank to skip any.
        </p>
      </div>

      <form action={updateGoals} className="grid grid-cols-2 gap-2">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label className="mb-1 block text-xs font-medium text-slate-500">{f.label}</label>
            <input
              name={f.name}
              type="number"
              min="0"
              defaultValue={goals[f.name] ?? ""}
              className={inputClass}
            />
          </div>
        ))}
        <button
          type="submit"
          className="col-span-2 mt-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600"
        >
          Save targets
        </button>
      </form>
    </section>
  );
}

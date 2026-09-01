import type { DailyTotals } from "@/lib/data/food";

function round(n: number) {
  return Math.round(n * 10) / 10;
}

const MACRO_STYLES = {
  Calories: "border-orange-100 bg-orange-50 text-orange-600",
  Protein: "border-blue-100 bg-blue-50 text-blue-600",
  Carbs: "border-emerald-100 bg-emerald-50 text-emerald-600",
  Fat: "border-violet-100 bg-violet-50 text-violet-600",
  Fiber: "border-teal-100 bg-teal-50 text-teal-600",
} as const;

const MACRO_BAR = {
  Calories: "bg-orange-400",
  Protein: "bg-blue-400",
  Carbs: "bg-emerald-400",
  Fat: "bg-violet-400",
  Fiber: "bg-teal-400",
} as const;

const MICRO_DOT = {
  Sodium: "bg-rose-400",
  Calcium: "bg-sky-400",
  Potassium: "bg-fuchsia-400",
  Magnesium: "bg-lime-500",
} as const;

export type MacroGoals = {
  dailyCalorieGoal: number | null;
  proteinGoalG: number | null;
  carbsGoalG: number | null;
  fatGoalG: number | null;
  fiberGoalG: number | null;
};

export default function SummaryCards({
  totals,
  goals,
}: {
  totals: DailyTotals;
  goals?: MacroGoals;
}) {
  const macroCards = [
    { label: "Calories" as const, value: round(totals.calories), unit: "kcal", goal: goals?.dailyCalorieGoal },
    { label: "Protein" as const, value: round(totals.proteinG), unit: "g", goal: goals?.proteinGoalG },
    { label: "Carbs" as const, value: round(totals.carbsG), unit: "g", goal: goals?.carbsGoalG },
    { label: "Fat" as const, value: round(totals.fatG), unit: "g", goal: goals?.fatGoalG },
    { label: "Fiber" as const, value: round(totals.fiberG), unit: "g", goal: goals?.fiberGoalG },
  ];

  const microCards = [
    { label: "Sodium" as const, value: Math.round(totals.sodiumMg), unit: "mg" },
    { label: "Calcium" as const, value: Math.round(totals.calciumMg), unit: "mg" },
    { label: "Potassium" as const, value: Math.round(totals.potassiumMg), unit: "mg" },
    { label: "Magnesium" as const, value: Math.round(totals.magnesiumMg), unit: "mg" },
  ];

  return (
    <div className="space-y-2 rounded-2xl bg-white p-3 shadow-md shadow-emerald-900/5">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {macroCards.map((c) => {
          const pct = c.goal ? Math.min(100, Math.round((c.value / c.goal) * 100)) : null;
          return (
            <div
              key={c.label}
              className={`rounded-xl border p-3 text-center ${MACRO_STYLES[c.label]}`}
            >
              <div className="text-lg font-bold">{c.value}</div>
              <div className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                {c.label} {c.unit}
              </div>
              {pct !== null && (
                <>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/60">
                    <div
                      className={`h-full rounded-full ${MACRO_BAR[c.label]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="mt-0.5 text-[10px] opacity-60">of {c.goal}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2 rounded-xl bg-slate-50 p-2">
        {microCards.map((c) => (
          <div key={c.label} className="text-center">
            <div className="flex items-center justify-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${MICRO_DOT[c.label]}`} />
              <span className="text-sm font-semibold text-slate-700">{c.value}</span>
            </div>
            <div className="text-[10px] uppercase tracking-wide text-slate-400">
              {c.label} {c.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

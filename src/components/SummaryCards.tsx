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

const MICRO_DOT = {
  Sodium: "bg-rose-400",
  Calcium: "bg-sky-400",
  Potassium: "bg-fuchsia-400",
  Magnesium: "bg-lime-500",
} as const;

export default function SummaryCards({ totals }: { totals: DailyTotals }) {
  const macroCards = [
    { label: "Calories" as const, value: round(totals.calories), unit: "kcal" },
    { label: "Protein" as const, value: round(totals.proteinG), unit: "g" },
    { label: "Carbs" as const, value: round(totals.carbsG), unit: "g" },
    { label: "Fat" as const, value: round(totals.fatG), unit: "g" },
    { label: "Fiber" as const, value: round(totals.fiberG), unit: "g" },
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
        {macroCards.map((c) => (
          <div
            key={c.label}
            className={`rounded-xl border p-3 text-center ${MACRO_STYLES[c.label]}`}
          >
            <div className="text-lg font-bold">{c.value}</div>
            <div className="text-[11px] font-medium uppercase tracking-wide opacity-70">
              {c.label} {c.unit}
            </div>
          </div>
        ))}
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

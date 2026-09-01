import type { DailyTotals } from "@/lib/data/food";

function round(n: number) {
  return Math.round(n * 10) / 10;
}

export default function SummaryCards({ totals }: { totals: DailyTotals }) {
  const macroCards = [
    { label: "Calories", value: round(totals.calories), unit: "kcal" },
    { label: "Protein", value: round(totals.proteinG), unit: "g" },
    { label: "Carbs", value: round(totals.carbsG), unit: "g" },
    { label: "Fat", value: round(totals.fatG), unit: "g" },
    { label: "Fiber", value: round(totals.fiberG), unit: "g" },
  ];

  const microCards = [
    { label: "Sodium", value: Math.round(totals.sodiumMg), unit: "mg" },
    { label: "Calcium", value: Math.round(totals.calciumMg), unit: "mg" },
    { label: "Potassium", value: Math.round(totals.potassiumMg), unit: "mg" },
    { label: "Magnesium", value: Math.round(totals.magnesiumMg), unit: "mg" },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {macroCards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-neutral-200 bg-white p-3 text-center"
          >
            <div className="text-lg font-semibold text-neutral-900">{c.value}</div>
            <div className="text-[11px] uppercase tracking-wide text-neutral-500">
              {c.label} {c.unit}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {microCards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-neutral-100 bg-neutral-50 p-2 text-center"
          >
            <div className="text-sm font-medium text-neutral-700">{c.value}</div>
            <div className="text-[10px] uppercase tracking-wide text-neutral-400">
              {c.label} {c.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

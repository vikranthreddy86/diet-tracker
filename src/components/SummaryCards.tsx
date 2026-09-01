import type { DailyTotals } from "@/lib/data/food";

function round(n: number) {
  return Math.round(n * 10) / 10;
}

export default function SummaryCards({ totals }: { totals: DailyTotals }) {
  const cards = [
    { label: "Calories", value: round(totals.calories), unit: "kcal" },
    { label: "Protein", value: round(totals.proteinG), unit: "g" },
    { label: "Carbs", value: round(totals.carbsG), unit: "g" },
    { label: "Fat", value: round(totals.fatG), unit: "g" },
    { label: "Fiber", value: round(totals.fiberG), unit: "g" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {cards.map((c) => (
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
  );
}

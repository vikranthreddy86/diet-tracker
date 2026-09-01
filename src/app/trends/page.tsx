import { createClient } from "@/lib/supabase/server";
import { getNutritionTrend } from "@/lib/data/trends";
import { todayIST, addDaysToDateStr, formatDateLabel } from "@/lib/date";
import RangePicker from "@/components/RangePicker";
import TrendChart from "@/components/TrendChart";
import BottomNav from "@/components/BottomNav";

const VALID_RANGES = [7, 30, 90];

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

const MACROS = [
  { key: "calories" as const, label: "Calories", unit: "kcal", color: "#f97316", cardClass: "border-orange-100 bg-orange-50 text-orange-600" },
  { key: "proteinG" as const, label: "Protein", unit: "g", color: "#3b82f6", cardClass: "border-blue-100 bg-blue-50 text-blue-600" },
  { key: "carbsG" as const, label: "Carbs", unit: "g", color: "#10b981", cardClass: "border-emerald-100 bg-emerald-50 text-emerald-600" },
  { key: "fatG" as const, label: "Fat", unit: "g", color: "#8b5cf6", cardClass: "border-violet-100 bg-violet-50 text-violet-600" },
  { key: "fiberG" as const, label: "Fiber", unit: "g", color: "#14b8a6", cardClass: "border-teal-100 bg-teal-50 text-teal-600" },
];

const MICROS = [
  { key: "sodiumMg" as const, label: "Sodium", unit: "mg", color: "#fb7185" },
  { key: "calciumMg" as const, label: "Calcium", unit: "mg", color: "#38bdf8" },
  { key: "potassiumMg" as const, label: "Potassium", unit: "mg", color: "#e879f9" },
  { key: "magnesiumMg" as const, label: "Magnesium", unit: "mg", color: "#84cc16" },
];

export default async function TrendsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { days: daysParam } = await searchParams;
  const days = VALID_RANGES.includes(Number(daysParam)) ? Number(daysParam) : 30;

  const today = todayIST();
  const startDate = addDaysToDateStr(today, -(days - 1));
  const trend = await getNutritionTrend(user!.id, startDate, today);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-500 px-4 pb-6 pt-6 text-white">
        <div className="mx-auto max-w-md">
          <h1 className="text-lg font-semibold">Trends</h1>
          <p className="text-sm text-emerald-50">
            {formatDateLabel(startDate)} – {formatDateLabel(today)}
          </p>
          <div className="mt-3">
            <RangePicker days={days} />
          </div>
        </div>
      </header>

      <div className="mx-auto -mt-2 flex max-w-md flex-col gap-4 px-4">
        <section className="rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Daily average
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {MACROS.map((m) => (
              <div key={m.key} className={`rounded-xl border p-3 text-center ${m.cardClass}`}>
                <div className="text-lg font-bold">
                  {round(average(trend.map((t) => t[m.key])))}
                </div>
                <div className="text-[11px] font-medium uppercase tracking-wide opacity-70">
                  {m.label} {m.unit}
                </div>
              </div>
            ))}
          </div>
        </section>

        {MACROS.map((m) => (
          <section
            key={m.key}
            className="rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5"
          >
            <div className="mb-1 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">{m.label}</h3>
              <span className="text-xs text-slate-400">
                avg {round(average(trend.map((t) => t[m.key])))} {m.unit}/day
              </span>
            </div>
            <TrendChart
              data={trend.map((t) => ({ date: t.date, value: round(t[m.key]) }))}
              unit={m.unit}
              color={m.color}
            />
          </section>
        ))}

        <section className="rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Micronutrients
          </h2>
          <div className="space-y-4">
            {MICROS.map((m) => (
              <div key={m.key}>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-600">{m.label}</p>
                  <span className="text-xs text-slate-400">
                    avg {Math.round(average(trend.map((t) => t[m.key])))} {m.unit}/day
                  </span>
                </div>
                <TrendChart
                  data={trend.map((t) => ({ date: t.date, value: Math.round(t[m.key]) }))}
                  unit={m.unit}
                  color={m.color}
                />
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}

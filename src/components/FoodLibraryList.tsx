"use client";

import { useMemo, useState } from "react";

type Food = {
  id: string;
  name: string;
  brand: string | null;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number | null;
  sugarG: number | null;
  sodiumMg: number | null;
  calciumMg: number | null;
  potassiumMg: number | null;
  magnesiumMg: number | null;
  category: string | null;
  isIndian: boolean;
  source: string;
};

type FilterKey = "all" | "indian" | "generic" | "custom" | "usda";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "indian", label: "Indian" },
  { key: "generic", label: "Generic" },
  { key: "custom", label: "Your custom" },
  { key: "usda", label: "USDA" },
];

function matchesFilter(f: Food, filter: FilterKey) {
  if (filter === "all") return true;
  if (filter === "indian") return f.source === "system" && f.isIndian;
  if (filter === "generic") return f.source === "system" && !f.isIndian;
  if (filter === "custom") return f.source === "custom";
  if (filter === "usda") return f.source === "usda";
  return true;
}

function sourceBadge(f: Food) {
  if (f.source === "custom")
    return { label: "Your custom", className: "bg-emerald-100 text-emerald-700" };
  if (f.source === "usda") return { label: "USDA", className: "bg-violet-100 text-violet-700" };
  if (f.isIndian) return { label: "Indian", className: "bg-orange-100 text-orange-700" };
  return { label: "Generic", className: "bg-sky-100 text-sky-700" };
}

function round(n: number | null) {
  if (n === null) return "—";
  return Math.round(n * 10) / 10;
}

export default function FoodLibraryList({ foods }: { foods: Food[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods.filter((f) => {
      if (!matchesFilter(f, filter)) return false;
      if (!q) return true;
      return f.name.toLowerCase().includes(q) || f.category?.toLowerCase().includes(q);
    });
  }, [foods, query, filter]);

  return (
    <div className="space-y-3">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the food library…"
        className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
      />

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-emerald-950 text-white shadow-sm"
                : "bg-white text-slate-500 border border-slate-200 hover:border-emerald-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="px-1 text-xs text-slate-400">
        {filtered.length} food{filtered.length === 1 ? "" : "s"}
      </p>

      <ul className="space-y-2 md:grid md:grid-cols-2 md:gap-2 md:space-y-0 md:items-start">
        {filtered.map((f) => {
          const badge = sourceBadge(f);
          const expanded = expandedId === f.id;
          return (
            <li
              key={f.id}
              className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm"
            >
              <button
                onClick={() => setExpandedId(expanded ? null : f.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-slate-900">{f.name}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {f.calories} kcal · {f.servingSize} {f.servingUnit}
                    {f.brand ? ` · ${f.brand}` : ""}
                  </p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 shrink-0 text-slate-300 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                >
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {expanded && (
                <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "Protein", value: round(f.proteinG), unit: "g", color: "text-blue-600" },
                      { label: "Carbs", value: round(f.carbsG), unit: "g", color: "text-emerald-600" },
                      { label: "Fat", value: round(f.fatG), unit: "g", color: "text-violet-600" },
                      { label: "Fiber", value: round(f.fiberG), unit: "g", color: "text-teal-600" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className={`text-sm font-semibold ${m.color}`}>{m.value}</div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-400">
                          {m.label} {m.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: "Sugar", value: round(f.sugarG), unit: "g", color: "text-pink-500" },
                      { label: "Sodium", value: round(f.sodiumMg), unit: "mg", color: "text-rose-500" },
                      { label: "Calcium", value: round(f.calciumMg), unit: "mg", color: "text-sky-500" },
                      { label: "Potassium", value: round(f.potassiumMg), unit: "mg", color: "text-fuchsia-500" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className={`text-xs font-medium ${m.color}`}>{m.value}</div>
                        <div className="text-[10px] uppercase tracking-wide text-slate-400">
                          {m.label} {m.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-xs font-medium text-lime-600">
                      {round(f.magnesiumMg)} mg magnesium
                    </span>
                    {f.category && (
                      <span className="ml-2 text-xs text-slate-400">· {f.category}</span>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}

        {filtered.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-400">
            No foods match your search.
          </p>
        )}
      </ul>
    </div>
  );
}

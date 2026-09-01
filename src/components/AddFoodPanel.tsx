"use client";

import { useEffect, useRef, useState } from "react";
import { logFoodEntry, addCustomFood } from "@/lib/actions/food";
import { MEAL_TYPES, type MealType } from "@/lib/types";

type Food = {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export default function AddFoodPanel({
  date,
  defaultMealType,
}: {
  date: string;
  defaultMealType: MealType;
}) {
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Food | null>(null);
  const [multiplier, setMultiplier] = useState("1");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) return;

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.foods ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  const visibleResults = query.trim() ? results : [];

  function reset() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSelected(null);
    setMultiplier("1");
    setShowCustomForm(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-600 hover:border-neutral-400"
      >
        + Add food
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900">Add food</h3>
        <button onClick={reset} className="text-xs text-neutral-400 hover:text-neutral-700">
          Cancel
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-neutral-600">Meal</label>
        <div className="flex gap-1.5">
          {MEAL_TYPES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMealType(m)}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                mealType === m
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {MEAL_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {!showCustomForm && !selected && (
        <div>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food (e.g. roti, dal, rice)"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />

          {loading && <p className="mt-2 text-xs text-neutral-400">Searching…</p>}

          {!loading && query.trim() && visibleResults.length === 0 && (
            <p className="mt-2 text-xs text-neutral-500">No matches.</p>
          )}

          {visibleResults.length > 0 && (
            <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto">
              {visibleResults.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(f)}
                    className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-neutral-100"
                  >
                    <span className="font-medium text-neutral-900">{f.name}</span>
                    <span className="ml-1 text-xs text-neutral-500">
                      {f.calories} kcal / {f.servingSize} {f.servingUnit}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="mt-3 text-xs font-medium text-neutral-600 underline hover:text-neutral-900"
          >
            Can&apos;t find it? Add a custom food
          </button>
        </div>
      )}

      {selected && (
        <form action={logFoodEntry} onSubmit={reset} className="space-y-3">
          <input type="hidden" name="foodId" value={selected.id} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="mealType" value={mealType} />

          <div className="rounded-md bg-neutral-50 p-3 text-sm">
            <p className="font-medium text-neutral-900">{selected.name}</p>
            <p className="text-xs text-neutral-500">
              {selected.calories} kcal per {selected.servingSize} {selected.servingUnit}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">
              Servings eaten
            </label>
            <input
              name="servingMultiplier"
              type="number"
              step="0.25"
              min="0.25"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-24 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-600"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Log it
            </button>
          </div>
        </form>
      )}

      {showCustomForm && (
        <form action={addCustomFood} onSubmit={reset} className="space-y-2">
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="mealType" value={mealType} />

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-600">Name</label>
            <input
              name="name"
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">
                Serving size
              </label>
              <input
                name="servingSize"
                type="number"
                step="0.1"
                required
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600">Unit</label>
              <input
                name="servingUnit"
                placeholder="g, piece, cup…"
                required
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "calories", label: "Calories" },
              { name: "proteinG", label: "Protein (g)" },
              { name: "carbsG", label: "Carbs (g)" },
              { name: "fatG", label: "Fat (g)" },
              { name: "fiberG", label: "Fiber (g, optional)" },
              { name: "sugarG", label: "Sugar (g, optional)" },
              { name: "sodiumMg", label: "Sodium (mg, optional)" },
            ].map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-xs font-medium text-neutral-600">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  type="number"
                  step="0.1"
                  required={!f.label.includes("optional")}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-600"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Save & log it
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

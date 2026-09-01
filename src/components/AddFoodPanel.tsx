"use client";

import { useEffect, useRef, useState } from "react";
import { logFoodEntry, logExternalFood, addCustomFood } from "@/lib/actions/food";

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

type ExternalFood = {
  externalId: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number | null;
  sugarG: number | null;
  sodiumMg: number | null;
};

// For foods whose serving is measured in grams/ml, let the user type the
// actual amount eaten instead of doing serving-multiplier math themselves.
function weightUnit(servingUnit: string): "g" | "ml" | null {
  const u = servingUnit.trim().toLowerCase();
  if (u.startsWith("g")) return "g";
  if (u.startsWith("ml")) return "ml";
  return null;
}

function AmountInput({
  food,
  multiplier,
  weightText,
  onMultiplierChange,
  onWeightChange,
}: {
  food: { servingSize: number; servingUnit: string; calories: number };
  multiplier: string;
  weightText: string;
  onMultiplierChange: (v: string) => void;
  onWeightChange: (v: string) => void;
}) {
  const unit = weightUnit(food.servingUnit);
  const estimatedCalories = Math.round((Number(multiplier) || 0) * food.calories);

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-neutral-600">
        {unit ? `Weight eaten (${unit})` : "Servings eaten"}
      </label>
      {unit ? (
        <input
          type="number"
          step="1"
          min="1"
          value={weightText}
          onChange={(e) => {
            onWeightChange(e.target.value);
            const grams = Number(e.target.value);
            onMultiplierChange(
              Number.isFinite(grams) && food.servingSize > 0
                ? String(grams / food.servingSize)
                : "0"
            );
          }}
          className="w-28 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      ) : (
        <input
          type="number"
          step="0.25"
          min="0.25"
          value={multiplier}
          onChange={(e) => onMultiplierChange(e.target.value)}
          className="w-24 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      )}
      {multiplier && Number(multiplier) > 0 && (
        <p className="mt-1 text-xs text-neutral-400">≈ {estimatedCalories} kcal</p>
      )}
    </div>
  );
}

export default function AddFoodPanel({ date }: { date: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [externalResults, setExternalResults] = useState<ExternalFood[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocal, setSelectedLocal] = useState<Food | null>(null);
  const [selectedExternal, setSelectedExternal] = useState<ExternalFood | null>(null);
  const [multiplier, setMultiplier] = useState("1");
  const [weightText, setWeightText] = useState("");
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
        setExternalResults(data.externalFoods ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, open]);

  const hasQuery = query.trim().length > 0;
  const visibleResults = hasQuery ? results : [];
  const visibleExternal = hasQuery ? externalResults : [];
  const selected = selectedLocal ?? selectedExternal;

  function reset() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setExternalResults([]);
    setSelectedLocal(null);
    setSelectedExternal(null);
    setMultiplier("1");
    setWeightText("");
    setShowCustomForm(false);
  }

  function selectLocal(f: Food) {
    setSelectedLocal(f);
    setMultiplier("1");
    setWeightText(String(f.servingSize));
  }

  function selectExternal(f: ExternalFood) {
    setSelectedExternal(f);
    setMultiplier("1");
    setWeightText(String(f.servingSize));
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

      {!showCustomForm && !selected && (
        <div>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search food (e.g. roti, apple, chicken breast)"
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
          />

          {loading && <p className="mt-2 text-xs text-neutral-400">Searching…</p>}

          {!loading && hasQuery && visibleResults.length === 0 && visibleExternal.length === 0 && (
            <p className="mt-2 text-xs text-neutral-500">No matches.</p>
          )}

          {visibleResults.length > 0 && (
            <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
              {visibleResults.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => selectLocal(f)}
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

          {visibleExternal.length > 0 && (
            <div className="mt-2">
              <p className="px-2 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                From USDA FoodData Central
              </p>
              <ul className="max-h-40 space-y-1 overflow-y-auto">
                {visibleExternal.map((f) => (
                  <li key={f.externalId}>
                    <button
                      type="button"
                      onClick={() => selectExternal(f)}
                      className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-neutral-100"
                    >
                      <span className="font-medium text-neutral-900">{f.name}</span>
                      {f.brand && <span className="ml-1 text-xs text-neutral-400">{f.brand}</span>}
                      <span className="ml-1 text-xs text-neutral-500">
                        {f.calories} kcal / {f.servingSize} {f.servingUnit}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="mt-3 text-xs font-medium text-neutral-600 underline hover:text-neutral-900"
          >
            Still can&apos;t find it? Add a custom food
          </button>
        </div>
      )}

      {selectedLocal && (
        <form action={logFoodEntry} onSubmit={reset} className="space-y-3">
          <input type="hidden" name="foodId" value={selectedLocal.id} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="servingMultiplier" value={multiplier} />

          <div className="rounded-md bg-neutral-50 p-3 text-sm">
            <p className="font-medium text-neutral-900">{selectedLocal.name}</p>
            <p className="text-xs text-neutral-500">
              {selectedLocal.calories} kcal per {selectedLocal.servingSize} {selectedLocal.servingUnit}
            </p>
          </div>

          <AmountInput
            food={selectedLocal}
            multiplier={multiplier}
            weightText={weightText}
            onMultiplierChange={setMultiplier}
            onWeightChange={setWeightText}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedLocal(null)}
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

      {selectedExternal && (
        <form action={logExternalFood} onSubmit={reset} className="space-y-3">
          <input type="hidden" name="externalId" value={selectedExternal.externalId} />
          <input type="hidden" name="name" value={selectedExternal.name} />
          <input type="hidden" name="brand" value={selectedExternal.brand ?? ""} />
          <input type="hidden" name="servingSize" value={selectedExternal.servingSize} />
          <input type="hidden" name="servingUnit" value={selectedExternal.servingUnit} />
          <input type="hidden" name="calories" value={selectedExternal.calories} />
          <input type="hidden" name="proteinG" value={selectedExternal.proteinG} />
          <input type="hidden" name="carbsG" value={selectedExternal.carbsG} />
          <input type="hidden" name="fatG" value={selectedExternal.fatG} />
          <input type="hidden" name="fiberG" value={selectedExternal.fiberG ?? ""} />
          <input type="hidden" name="sugarG" value={selectedExternal.sugarG ?? ""} />
          <input type="hidden" name="sodiumMg" value={selectedExternal.sodiumMg ?? ""} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="servingMultiplier" value={multiplier} />

          <div className="rounded-md bg-neutral-50 p-3 text-sm">
            <p className="font-medium text-neutral-900">{selectedExternal.name}</p>
            {selectedExternal.brand && (
              <p className="text-xs text-neutral-400">{selectedExternal.brand}</p>
            )}
            <p className="text-xs text-neutral-500">
              {selectedExternal.calories} kcal per {selectedExternal.servingSize}{" "}
              {selectedExternal.servingUnit} · USDA FoodData Central
            </p>
          </div>

          <AmountInput
            food={selectedExternal}
            multiplier={multiplier}
            weightText={weightText}
            onMultiplierChange={setMultiplier}
            onWeightChange={setWeightText}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelectedExternal(null)}
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

"use client";

import { useEffect, useRef, useState } from "react";
import { logFoodEntry, logExternalFood, addCustomFood } from "@/lib/actions/food";
import { inputClass } from "@/lib/ui";

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
  calciumMg: number | null;
  potassiumMg: number | null;
  magnesiumMg: number | null;
};

// Every food can be logged by weight: if the serving unit isn't already
// grams/ml (e.g. "piece (~40g)", "large egg (~50g)"), pull the gram/ml
// equivalent out of the descriptive text so weight entry still works.
function weightBasis(food: {
  servingSize: number;
  servingUnit: string;
}): { grams: number; unit: "g" | "ml" } | null {
  const u = food.servingUnit.trim().toLowerCase();
  if (u.startsWith("g")) return { grams: food.servingSize, unit: "g" };
  if (u.startsWith("ml")) return { grams: food.servingSize, unit: "ml" };
  const match = u.match(/(\d+(?:\.\d+)?)\s*(g|ml)\b/);
  return match ? { grams: Number(match[1]), unit: match[2] as "g" | "ml" } : null;
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
  const basis = weightBasis(food);
  const isNativelyWeight = /^(g|ml)\b/.test(food.servingUnit.trim().toLowerCase());
  const [mode, setMode] = useState<"servings" | "weight">(isNativelyWeight ? "weight" : "servings");
  const estimatedCalories = Math.round((Number(multiplier) || 0) * food.calories);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-xs font-medium text-slate-500">
          {mode === "weight" ? `Weight eaten (${basis?.unit ?? "g"})` : "Servings eaten"}
        </label>
        {basis && !isNativelyWeight && (
          <button
            type="button"
            onClick={() => setMode(mode === "servings" ? "weight" : "servings")}
            className="text-[11px] font-medium text-emerald-600 underline hover:text-emerald-800"
          >
            {mode === "servings" ? `Log by weight instead` : "Log by servings instead"}
          </button>
        )}
      </div>
      {mode === "weight" && basis ? (
        <input
          type="number"
          step="1"
          min="1"
          value={weightText}
          onChange={(e) => {
            onWeightChange(e.target.value);
            const amount = Number(e.target.value);
            onMultiplierChange(
              Number.isFinite(amount) && basis.grams > 0 ? String(amount / basis.grams) : "0"
            );
          }}
          className={`${inputClass} w-28`}
        />
      ) : (
        <input
          type="number"
          step="0.25"
          min="0.25"
          value={multiplier}
          onChange={(e) => onMultiplierChange(e.target.value)}
          className={`${inputClass} w-24`}
        />
      )}
      {multiplier && Number(multiplier) > 0 && (
        <p className="mt-1 text-xs font-medium text-orange-500">≈ {estimatedCalories} kcal</p>
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
    setWeightText(String(weightBasis(f)?.grams ?? f.servingSize));
  }

  function selectExternal(f: ExternalFood) {
    setSelectedExternal(f);
    setMultiplier("1");
    setWeightText(String(weightBasis(f)?.grams ?? f.servingSize));
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 hover:from-emerald-600 hover:to-teal-600"
      >
        <span className="text-lg leading-none">+</span> Add food
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">Add food</h3>
        <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-700">
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
            className={inputClass}
          />

          {loading && <p className="mt-2 text-xs text-slate-400">Searching…</p>}

          {!loading && hasQuery && visibleResults.length === 0 && visibleExternal.length === 0 && (
            <p className="mt-2 text-xs text-slate-400">No matches.</p>
          )}

          {visibleResults.length > 0 && (
            <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
              {visibleResults.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => selectLocal(f)}
                    className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-emerald-50"
                  >
                    <span className="font-medium text-slate-900">{f.name}</span>
                    <span className="ml-1 text-xs text-slate-400">
                      {f.calories} kcal / {f.servingSize} {f.servingUnit}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {visibleExternal.length > 0 && (
            <div className="mt-2">
              <p className="px-2 text-[11px] font-semibold uppercase tracking-wide text-violet-400">
                From USDA FoodData Central
              </p>
              <ul className="max-h-40 space-y-1 overflow-y-auto">
                {visibleExternal.map((f) => (
                  <li key={f.externalId}>
                    <button
                      type="button"
                      onClick={() => selectExternal(f)}
                      className="w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-violet-50"
                    >
                      <span className="font-medium text-slate-900">{f.name}</span>
                      {f.brand && <span className="ml-1 text-xs text-slate-400">{f.brand}</span>}
                      <span className="ml-1 text-xs text-slate-400">
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
            className="mt-3 text-xs font-medium text-emerald-600 underline hover:text-emerald-800"
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

          <div className="rounded-lg bg-emerald-50 p-3 text-sm">
            <p className="font-medium text-slate-900">{selectedLocal.name}</p>
            <p className="text-xs text-slate-500">
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
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600"
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
          <input type="hidden" name="calciumMg" value={selectedExternal.calciumMg ?? ""} />
          <input type="hidden" name="potassiumMg" value={selectedExternal.potassiumMg ?? ""} />
          <input type="hidden" name="magnesiumMg" value={selectedExternal.magnesiumMg ?? ""} />
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="servingMultiplier" value={multiplier} />

          <div className="rounded-lg bg-violet-50 p-3 text-sm">
            <p className="font-medium text-slate-900">{selectedExternal.name}</p>
            {selectedExternal.brand && (
              <p className="text-xs text-slate-400">{selectedExternal.brand}</p>
            )}
            <p className="text-xs text-slate-500">
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
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600"
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
            <label className="mb-1 block text-xs font-medium text-slate-500">Name</label>
            <input name="name" required className={inputClass} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">
                Serving size
              </label>
              <input name="servingSize" type="number" step="0.1" required className={inputClass} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500">Unit</label>
              <input
                name="servingUnit"
                placeholder="g, piece, cup…"
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Weight of 1 serving (g, optional — lets you log this by weight later)
            </label>
            <input name="servingWeightG" type="number" step="1" className={inputClass} />
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
              { name: "calciumMg", label: "Calcium (mg, optional)" },
              { name: "potassiumMg", label: "Potassium (mg, optional)" },
              { name: "magnesiumMg", label: "Magnesium (mg, optional)" },
            ].map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-xs font-medium text-slate-500">{f.label}</label>
                <input
                  name={f.name}
                  type="number"
                  step="0.1"
                  required={!f.label.includes("optional")}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCustomForm(false)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600"
            >
              Save & log it
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

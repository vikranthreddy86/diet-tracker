import type { Prisma } from "@prisma/client";
import { deleteLogEntry } from "@/lib/actions/food";
import { UtensilsIcon } from "./icons";

type EntryWithFood = Prisma.FoodLogEntryGetPayload<{ include: { food: true } }>;

export default function TodayEntries({ entries }: { entries: EntryWithFood[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-6 text-center">
        <UtensilsIcon className="mx-auto h-6 w-6 text-stone-300" />
        <p className="mt-2 text-sm font-medium text-slate-600">Nothing logged yet</p>
        <p className="text-xs text-slate-400">Add your first food above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-sm"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-semibold text-emerald-700">
              {Math.round(e.food.calories * e.servingMultiplier)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">
                {e.food.name}
                {e.servingMultiplier !== 1 && (
                  <span className="ml-1 font-normal text-slate-400">× {e.servingMultiplier}</span>
                )}
              </p>
              <p className="text-xs text-slate-400">
                {e.food.servingSize} {e.food.servingUnit} per serving
              </p>
            </div>
          </div>
          <form action={deleteLogEntry}>
            <input type="hidden" name="id" value={e.id} />
            <button
              type="submit"
              className="ml-3 shrink-0 rounded-full p-1.5 text-slate-300 hover:bg-rose-50 hover:text-rose-500"
              aria-label={`Remove ${e.food.name}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

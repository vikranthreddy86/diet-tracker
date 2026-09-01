import type { Prisma } from "@prisma/client";
import { deleteLogEntry } from "@/lib/actions/food";

type EntryWithFood = Prisma.FoodLogEntryGetPayload<{ include: { food: true } }>;

export default function TodayEntries({ entries }: { entries: EntryWithFood[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500">
        Nothing logged yet.
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {entries.map((e) => (
        <li
          key={e.id}
          className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 py-2"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">
              {e.food.name}
              {e.servingMultiplier !== 1 && (
                <span className="ml-1 font-normal text-neutral-500">
                  × {e.servingMultiplier}
                </span>
              )}
            </p>
            <p className="text-xs text-neutral-500">
              {Math.round(e.food.calories * e.servingMultiplier)} kcal ·{" "}
              {e.food.servingSize} {e.food.servingUnit} per serving
            </p>
          </div>
          <form action={deleteLogEntry}>
            <input type="hidden" name="id" value={e.id} />
            <button
              type="submit"
              className="ml-3 shrink-0 text-xs text-neutral-400 hover:text-red-600"
              aria-label={`Remove ${e.food.name}`}
            >
              Remove
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
}

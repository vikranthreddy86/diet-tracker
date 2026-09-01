import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { getDailyLog } from "@/lib/data/food";
import { todayIST, formatDateLabel } from "@/lib/date";
import { defaultMealTypeForHour } from "@/lib/types";
import SummaryCards from "@/components/SummaryCards";
import TodayEntries from "@/components/TodayEntries";
import AddFoodPanel from "@/components/AddFoodPanel";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const date = todayIST();
  const { entries, totals } = await getDailyLog(user!.id, date);
  const nowIST = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false });
  const defaultMeal = defaultMealTypeForHour(Number(nowIST));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-neutral-900">Today</h1>
          <p className="text-xs text-neutral-500">{formatDateLabel(date)}</p>
        </div>
        <form action={signOut}>
          <button type="submit" className="text-sm text-neutral-500 underline">
            Sign out
          </button>
        </form>
      </header>

      <SummaryCards totals={totals} />

      <AddFoodPanel date={date} defaultMealType={defaultMeal} />

      <TodayEntries entries={entries} />
    </div>
  );
}

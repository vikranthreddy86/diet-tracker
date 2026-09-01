import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { getDailyLog } from "@/lib/data/food";
import { todayIST, formatDateLabel } from "@/lib/date";
import SummaryCards from "@/components/SummaryCards";
import TodayEntries from "@/components/TodayEntries";
import AddFoodPanel from "@/components/AddFoodPanel";
import BottomNav from "@/components/BottomNav";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const date = todayIST();
  const { entries, totals } = await getDailyLog(user!.id, date);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-500 px-4 pb-10 pt-6 text-white">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Today</h1>
            <p className="text-sm text-emerald-50">{formatDateLabel(date)}</p>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto -mt-6 flex max-w-md flex-col gap-4 px-4">
        <SummaryCards totals={totals} />

        <AddFoodPanel date={date} />

        <TodayEntries entries={entries} />
      </div>

      <BottomNav />
    </div>
  );
}

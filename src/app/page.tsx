import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { getDailyLog } from "@/lib/data/food";
import { todayIST, formatDateLabel, isValidDateStr, addDaysToDateStr } from "@/lib/date";
import SummaryCards from "@/components/SummaryCards";
import TodayEntries from "@/components/TodayEntries";
import AddFoodPanel from "@/components/AddFoodPanel";
import BottomNav from "@/components/BottomNav";
import DateNav from "@/components/DateNav";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const todayDate = todayIST();
  const { date: requestedDate } = await searchParams;
  const date =
    requestedDate && isValidDateStr(requestedDate) && requestedDate <= todayDate
      ? requestedDate
      : todayDate;
  const isToday = date === todayDate;

  const { entries, totals } = await getDailyLog(user!.id, date);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-500 px-4 pb-10 pt-6 text-white">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{isToday ? "Today" : formatDateLabel(date)}</h1>
            {isToday && <p className="text-sm text-emerald-50">{formatDateLabel(date)}</p>}
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

        <div className="mx-auto mt-4 max-w-md">
          <DateNav
            date={date}
            prevDate={addDaysToDateStr(date, -1)}
            nextDate={addDaysToDateStr(date, 1)}
            isToday={isToday}
            todayDate={todayDate}
          />
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

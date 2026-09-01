import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { getDailyLog } from "@/lib/data/food";
import { getNutritionTrend } from "@/lib/data/trends";
import { getWeightEntries } from "@/lib/data/progress";
import { getWhoopEnergyForDate } from "@/lib/data/whoop";
import { todayIST, formatDateLabel, isValidDateStr, addDaysToDateStr } from "@/lib/date";
import SummaryCards from "@/components/SummaryCards";
import TodayEntries from "@/components/TodayEntries";
import AddFoodPanel from "@/components/AddFoodPanel";
import DateNav from "@/components/DateNav";
import CopyDayButton from "@/components/CopyDayButton";
import TrendChart from "@/components/TrendChart";
import DeficitCard from "@/components/DeficitCard";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

  const todayDate = todayIST();
  const { date: requestedDate } = await searchParams;
  const date =
    requestedDate && isValidDateStr(requestedDate) && requestedDate <= todayDate
      ? requestedDate
      : todayDate;
  const isToday = date === todayDate;

  const [{ entries, totals }, weekTrend, latestWeight, whoopEnergy] = await Promise.all([
    getDailyLog(userId, date),
    getNutritionTrend(userId, addDaysToDateStr(todayDate, -6), todayDate),
    getWeightEntries(userId, 1),
    getWhoopEnergyForDate(userId, date),
  ]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-500 px-4 pb-10 pt-6 text-white md:px-8">
        <div className="mx-auto flex max-w-md items-center justify-between md:max-w-5xl">
          <div>
            <h1 className="text-lg font-semibold">{isToday ? "Today" : formatDateLabel(date)}</h1>
            {isToday && <p className="text-sm text-emerald-50">{formatDateLabel(date)}</p>}
          </div>
          <div className="flex items-center gap-2">
            <CopyDayButton dateLabel={formatDateLabel(date)} totals={totals} entries={entries} />
            <form action={signOut} className="md:hidden">
              <button
                type="submit"
                className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/25"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-md md:max-w-5xl">
          <DateNav
            date={date}
            prevDate={addDaysToDateStr(date, -1)}
            nextDate={addDaysToDateStr(date, 1)}
            isToday={isToday}
            todayDate={todayDate}
          />
        </div>
      </header>

      <div className="mx-auto -mt-6 max-w-md px-4 md:max-w-5xl md:px-8">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-start md:gap-6">
          <div className="flex flex-col gap-4 md:col-span-2">
            {whoopEnergy && (
              <DeficitCard burned={whoopEnergy.caloriesBurned} consumed={totals.calories} />
            )}
            <SummaryCards totals={totals} />
            <AddFoodPanel date={date} />
            <TodayEntries entries={entries} />
          </div>

          <div className="hidden flex-col gap-4 md:flex">
            <section className="rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5">
              <div className="mb-1 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">This week</h2>
                <span className="text-xs text-slate-400">Calories, last 7 days</span>
              </div>
              <TrendChart
                data={weekTrend.map((t) => ({ date: t.date, value: Math.round(t.calories) }))}
                unit="kcal"
                color="#f97316"
              />
            </section>

            {latestWeight[0] && (
              <section className="rounded-2xl border border-emerald-50 bg-white p-4 shadow-md shadow-emerald-900/5">
                <h2 className="text-sm font-semibold text-slate-900">⚖️ Latest weight</h2>
                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  {latestWeight[0].weightKg} kg
                </p>
                <p className="text-xs text-slate-400">
                  {latestWeight[0].date.toISOString().slice(0, 10)}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

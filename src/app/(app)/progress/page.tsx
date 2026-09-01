import { createClient } from "@/lib/supabase/server";
import { getWeightEntries, getMeasurementTypesWithEntries } from "@/lib/data/progress";
import { getWhoopConnection, getWhoopEnergyRange } from "@/lib/data/whoop";
import { getProfile } from "@/lib/data/settings";
import { todayIST, addDaysToDateStr } from "@/lib/date";
import WeightSection from "@/components/WeightSection";
import MeasurementsSection from "@/components/MeasurementsSection";
import WhoopSection from "@/components/WhoopSection";
import GoalsSection from "@/components/GoalsSection";

export default async function ProgressPage({
  searchParams,
}: {
  searchParams: Promise<{ whoopConnected?: string; whoopError?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user!.id;

  const today = todayIST();
  const { whoopConnected, whoopError } = await searchParams;

  const [weightEntries, measurementTypes, whoopConnection, whoopEnergy, profile] =
    await Promise.all([
      getWeightEntries(userId),
      getMeasurementTypesWithEntries(userId),
      getWhoopConnection(userId),
      getWhoopEnergyRange(userId, addDaysToDateStr(today, -13), today),
      getProfile(userId),
    ]);

  const whoopNotice = whoopConnected
    ? ({ type: "connected" } as const)
    : whoopError
      ? ({ type: "error", message: whoopError } as const)
      : undefined;

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-500 px-4 pb-8 pt-6 text-white md:px-8">
        <div className="mx-auto max-w-md md:max-w-5xl">
          <h1 className="text-lg font-semibold">Progress</h1>
          <p className="text-sm text-emerald-50">Weight and body measurements over time</p>
        </div>
      </header>

      <div className="mx-auto -mt-4 max-w-md px-4 md:max-w-5xl md:px-8">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-start md:gap-6">
          <div className="flex flex-col gap-4 md:col-span-1">
            <WeightSection entries={weightEntries} />
            <WhoopSection
              connection={whoopConnection}
              energy={whoopEnergy.map((e) => ({
                date: e.date.toISOString().slice(0, 10),
                caloriesBurned: e.caloriesBurned,
              }))}
              notice={whoopNotice}
            />
          </div>
          <div className="flex flex-col gap-4 md:col-span-2">
            <GoalsSection
              goals={{
                dailyCalorieGoal: profile.dailyCalorieGoal,
                proteinGoalG: profile.proteinGoalG,
                carbsGoalG: profile.carbsGoalG,
                fatGoalG: profile.fatGoalG,
                fiberGoalG: profile.fiberGoalG,
              }}
            />
            <MeasurementsSection types={measurementTypes} />
          </div>
        </div>
      </div>
    </div>
  );
}

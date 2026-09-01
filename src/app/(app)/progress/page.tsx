import { createClient } from "@/lib/supabase/server";
import { getWeightEntries, getMeasurementTypesWithEntries } from "@/lib/data/progress";
import WeightSection from "@/components/WeightSection";
import MeasurementsSection from "@/components/MeasurementsSection";

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [weightEntries, measurementTypes] = await Promise.all([
    getWeightEntries(user!.id),
    getMeasurementTypesWithEntries(user!.id),
  ]);

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
          <div className="md:col-span-1">
            <WeightSection entries={weightEntries} />
          </div>
          <div className="md:col-span-2">
            <MeasurementsSection types={measurementTypes} />
          </div>
        </div>
      </div>
    </div>
  );
}

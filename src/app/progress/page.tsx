import { createClient } from "@/lib/supabase/server";
import { getWeightEntries, getMeasurementTypesWithEntries } from "@/lib/data/progress";
import WeightSection from "@/components/WeightSection";
import MeasurementsSection from "@/components/MeasurementsSection";
import BottomNav from "@/components/BottomNav";

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
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-500 px-4 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-md">
          <h1 className="text-lg font-semibold">Progress</h1>
          <p className="text-sm text-emerald-50">Weight and body measurements over time</p>
        </div>
      </header>

      <div className="mx-auto -mt-4 flex max-w-md flex-col gap-4 px-4">
        <WeightSection entries={weightEntries} />
        <MeasurementsSection types={measurementTypes} />
      </div>

      <BottomNav />
    </div>
  );
}

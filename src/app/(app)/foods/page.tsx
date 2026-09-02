import { createClient } from "@/lib/supabase/server";
import { getAllFoods } from "@/lib/data/food";
import FoodLibraryList from "@/components/FoodLibraryList";

export default async function FoodsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const foods = await getAllFoods(user!.id);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 px-4 pb-8 pt-6 text-white md:px-8">
        <div className="mx-auto max-w-md md:max-w-5xl">
          <h1 className="text-lg font-semibold">Food Library</h1>
          <p className="text-sm text-emerald-50">
            {foods.length} foods · Indian dishes, generic foods, USDA search results, and your
            own custom entries
          </p>
        </div>
      </header>

      <div className="mx-auto -mt-4 max-w-md px-4 md:max-w-5xl md:px-8">
        <FoodLibraryList foods={foods} />
      </div>
    </div>
  );
}

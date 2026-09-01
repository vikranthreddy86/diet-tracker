import { createClient } from "@/lib/supabase/server";
import { getAllFoods } from "@/lib/data/food";
import FoodLibraryList from "@/components/FoodLibraryList";
import BottomNav from "@/components/BottomNav";

export default async function FoodsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const foods = await getAllFoods(user!.id);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-br from-emerald-500 to-teal-500 px-4 pb-8 pt-6 text-white">
        <div className="mx-auto max-w-md">
          <h1 className="text-lg font-semibold">Food Library</h1>
          <p className="text-sm text-emerald-50">
            {foods.length} foods · Indian dishes, generic foods, USDA search results, and your
            own custom entries
          </p>
        </div>
      </header>

      <div className="mx-auto -mt-4 max-w-md px-4">
        <FoodLibraryList foods={foods} />
      </div>

      <BottomNav />
    </div>
  );
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchFoods } from "@/lib/data/food";
import { searchUsdaFoods } from "@/lib/usda";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ foods: [], externalFoods: [] }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return NextResponse.json({ foods: [], externalFoods: [] });
  }

  const [foods, usdaResults] = await Promise.all([
    searchFoods(user.id, q),
    searchUsdaFoods(q).catch((e) => {
      console.error("USDA search failed:", e);
      return [];
    }),
  ]);

  const localExternalIds = new Set(foods.map((f) => f.externalId).filter(Boolean));
  const externalFoods = usdaResults.filter((f) => !localExternalIds.has(f.externalId));

  return NextResponse.json({ foods, externalFoods });
}

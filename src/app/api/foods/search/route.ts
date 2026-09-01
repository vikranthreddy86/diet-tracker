import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchFoods } from "@/lib/data/food";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ foods: [] }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get("q") ?? "";
  const foods = await searchFoods(user.id, q);
  return NextResponse.json({ foods });
}

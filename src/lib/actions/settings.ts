"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

function intOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export async function updateGoals(formData: FormData) {
  const userId = await requireUserId();

  await prisma.profile.update({
    where: { id: userId },
    data: {
      dailyCalorieGoal: intOrNull(formData.get("dailyCalorieGoal")),
      proteinGoalG: intOrNull(formData.get("proteinGoalG")),
      carbsGoalG: intOrNull(formData.get("carbsGoalG")),
      fatGoalG: intOrNull(formData.get("fatGoalG")),
      fiberGoalG: intOrNull(formData.get("fiberGoalG")),
    },
  });

  revalidatePath("/");
  revalidatePath("/progress");
}

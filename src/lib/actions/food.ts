"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { dateStrToDate } from "@/lib/date";
import type { MealType } from "@/lib/types";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

function numOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function logFoodEntry(formData: FormData) {
  const userId = await requireUserId();
  const foodId = String(formData.get("foodId"));
  const date = String(formData.get("date"));
  const mealType = String(formData.get("mealType")) as MealType;
  const servingMultiplier = Number(formData.get("servingMultiplier") ?? 1);

  if (!foodId || !date || !Number.isFinite(servingMultiplier) || servingMultiplier <= 0) {
    throw new Error("Invalid food log entry");
  }

  await prisma.foodLogEntry.create({
    data: {
      userId,
      foodId,
      date: dateStrToDate(date),
      mealType,
      servingMultiplier,
    },
  });

  revalidatePath("/");
}

export async function deleteLogEntry(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id"));
  await prisma.foodLogEntry.deleteMany({ where: { id, userId } });
  revalidatePath("/");
}

export async function addCustomFood(formData: FormData) {
  const userId = await requireUserId();
  const date = String(formData.get("date"));
  const mealType = String(formData.get("mealType")) as MealType;
  const name = String(formData.get("name") ?? "").trim();
  const servingSize = Number(formData.get("servingSize"));
  const servingUnit = String(formData.get("servingUnit") ?? "").trim();
  const calories = Number(formData.get("calories"));
  const proteinG = Number(formData.get("proteinG"));
  const carbsG = Number(formData.get("carbsG"));
  const fatG = Number(formData.get("fatG"));

  if (
    !name ||
    !servingUnit ||
    !date ||
    ![servingSize, calories, proteinG, carbsG, fatG].every(Number.isFinite)
  ) {
    throw new Error("Invalid custom food");
  }

  const food = await prisma.food.create({
    data: {
      name,
      servingSize,
      servingUnit,
      calories,
      proteinG,
      carbsG,
      fatG,
      fiberG: numOrNull(formData.get("fiberG")),
      sugarG: numOrNull(formData.get("sugarG")),
      sodiumMg: numOrNull(formData.get("sodiumMg")),
      source: "custom",
      createdByUserId: userId,
    },
  });

  await prisma.foodLogEntry.create({
    data: {
      userId,
      foodId: food.id,
      date: dateStrToDate(date),
      mealType,
      servingMultiplier: 1,
    },
  });

  revalidatePath("/");
}

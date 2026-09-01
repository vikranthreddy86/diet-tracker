"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { dateStrToDate } from "@/lib/date";

async function requireUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export async function logWeight(formData: FormData) {
  const userId = await requireUserId();
  const date = String(formData.get("date"));
  const weightKg = Number(formData.get("weightKg"));
  const note = String(formData.get("note") ?? "").trim();

  if (!date || !Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Invalid weight entry");
  }

  await prisma.weightEntry.upsert({
    where: { userId_date: { userId, date: dateStrToDate(date) } },
    update: { weightKg, note: note || null },
    create: { userId, date: dateStrToDate(date), weightKg, note: note || null },
  });

  revalidatePath("/progress");
}

export async function deleteWeightEntry(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id"));
  await prisma.weightEntry.deleteMany({ where: { id, userId } });
  revalidatePath("/progress");
}

export async function addMeasurementType(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const unit = String(formData.get("unit") ?? "").trim();

  if (!name || !unit) throw new Error("Invalid measurement type");

  const count = await prisma.measurementType.count({ where: { userId } });
  await prisma.measurementType.create({
    data: { userId, name, unit, sortOrder: count },
  });

  revalidatePath("/progress");
}

export async function archiveMeasurementType(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id"));
  await prisma.measurementType.updateMany({
    where: { id, userId },
    data: { archived: true },
  });
  revalidatePath("/progress");
}

export async function logMeasurementEntry(formData: FormData) {
  const userId = await requireUserId();
  const measurementTypeId = String(formData.get("measurementTypeId"));
  const date = String(formData.get("date"));
  const value = Number(formData.get("value"));

  if (!measurementTypeId || !date || !Number.isFinite(value)) {
    throw new Error("Invalid measurement entry");
  }

  const type = await prisma.measurementType.findFirst({
    where: { id: measurementTypeId, userId },
  });
  if (!type) throw new Error("Measurement type not found");

  await prisma.measurementEntry.upsert({
    where: { measurementTypeId_date: { measurementTypeId, date: dateStrToDate(date) } },
    update: { value },
    create: { userId, measurementTypeId, date: dateStrToDate(date), value },
  });

  revalidatePath("/progress");
}

export async function deleteMeasurementEntry(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id"));
  await prisma.measurementEntry.deleteMany({ where: { id, userId } });
  revalidatePath("/progress");
}

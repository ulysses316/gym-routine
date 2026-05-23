"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function parseOptionalFloat(v: FormDataEntryValue | null): number | undefined {
  if (!v || v === "") return undefined;
  const n = Number.parseFloat(v as string);
  return Number.isNaN(n) ? undefined : n;
}

export async function createBodyRecord(
  _state: { message?: string } | undefined,
  formData: FormData,
): Promise<{ message?: string } | undefined> {
  const session = await getSession();
  if (!session) return { message: "No autorizado." };

  const date = formData.get("date") as string;
  if (!date) return { message: "La fecha es requerida." };

  await prisma.bodyRecord.create({
    data: {
      userId: session.userId,
      date: new Date(date),
      weightKg: parseOptionalFloat(formData.get("weightKg")),
      heightCm: parseOptionalFloat(formData.get("heightCm")),
      bodyFatPct: parseOptionalFloat(formData.get("bodyFatPct")),
      muscleMassKg: parseOptionalFloat(formData.get("muscleMassKg")),
      waterPct: parseOptionalFloat(formData.get("waterPct")),
      boneMassKg: parseOptionalFloat(formData.get("boneMassKg")),
      neck: parseOptionalFloat(formData.get("neck")),
      shoulders: parseOptionalFloat(formData.get("shoulders")),
      chest: parseOptionalFloat(formData.get("chest")),
      waist: parseOptionalFloat(formData.get("waist")),
      hips: parseOptionalFloat(formData.get("hips")),
      leftArm: parseOptionalFloat(formData.get("leftArm")),
      rightArm: parseOptionalFloat(formData.get("rightArm")),
      leftThigh: parseOptionalFloat(formData.get("leftThigh")),
      rightThigh: parseOptionalFloat(formData.get("rightThigh")),
      leftCalf: parseOptionalFloat(formData.get("leftCalf")),
      rightCalf: parseOptionalFloat(formData.get("rightCalf")),
      notes: (formData.get("notes") as string) || undefined,
    },
  });

  revalidatePath("/body");
  redirect("/body");
}

export async function deleteBodyRecord(id: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.bodyRecord.deleteMany({
    where: { id, userId: session.userId },
  });

  revalidatePath("/body");
}

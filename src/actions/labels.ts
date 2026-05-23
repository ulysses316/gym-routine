"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const LabelSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(30).trim(),
});

export type LabelState = { error?: string; success?: boolean } | undefined;

export async function createLabel(
  _state: LabelState,
  formData: FormData,
): Promise<LabelState> {
  const session = await getSession();
  if (!session) return { error: "No autorizado." };

  const validated = LabelSchema.safeParse({ name: formData.get("name") });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const existing = await prisma.label.findUnique({
    where: { name: validated.data.name },
  });
  if (existing) return { error: "Ya existe un label con ese nombre." };

  await prisma.label.create({ data: { name: validated.data.name } });

  revalidatePath("/labels");
  return { success: true };
}

export async function deleteLabel(id: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.label.delete({ where: { id } });
  revalidatePath("/labels");
}

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type State = { error?: string; success: boolean };

export async function updateWeekStartDay(
  _prev: State,
  formData: FormData,
): Promise<State> {
  const session = await getSession();
  if (!session) return { error: "No autenticado", success: false };

  const raw = Number(formData.get("weekStartDay"));
  if (!Number.isInteger(raw) || raw < 0 || raw > 6) {
    return { error: "Día inválido", success: false };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { weekStartDay: raw },
  });

  revalidatePath("/stats");
  revalidatePath("/settings");
  return { success: true };
}

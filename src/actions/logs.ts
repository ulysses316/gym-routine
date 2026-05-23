"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { WorkoutLogSchema } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function createWorkoutLog(
  _state: { message?: string } | undefined,
  formData: FormData,
): Promise<{ message?: string } | undefined> {
  const session = await getSession();
  if (!session) return { message: "No autorizado." };

  const validated = WorkoutLogSchema.safeParse({
    routineId: formData.get("routineId"),
    date: formData.get("date"),
    notes: formData.get("notes") || undefined,
  });

  if (!validated.success) return { message: "Datos inválidos." };

  const setsRaw = formData.get("setsJson") as string | null;
  let sets: {
    exerciseId: string;
    reps: number;
    weightKg: number;
    setNumber: number;
  }[] = [];
  try {
    sets = JSON.parse(setsRaw ?? "[]");
  } catch {
    sets = [];
  }

  const log = await prisma.workoutLog.create({
    data: {
      userId: session.userId,
      routineId: validated.data.routineId,
      date: new Date(validated.data.date),
      notes: validated.data.notes,
      sets: {
        create: sets.map((s) => ({
          exerciseId: s.exerciseId,
          reps: s.reps,
          weightKg: s.weightKg,
          setNumber: s.setNumber,
        })),
      },
    },
  });

  revalidatePath("/logs");
  redirect(`/logs/${log.id}`);
}

export async function addSet(
  logId: string,
  exerciseId: string,
  setNumber: number,
  reps: number,
  weightKg: number,
) {
  const session = await getSession();
  if (!session) return;

  const log = await prisma.workoutLog.findFirst({
    where: { id: logId, userId: session.userId },
  });
  if (!log) return;

  await prisma.workoutSet.create({
    data: { workoutLogId: logId, exerciseId, setNumber, reps, weightKg },
  });

  revalidatePath(`/logs/${logId}`);
}

export async function deleteSet(setId: string, logId: string) {
  const session = await getSession();
  if (!session) return;

  const set = await prisma.workoutSet.findFirst({
    where: { id: setId, workoutLog: { userId: session.userId } },
  });
  if (!set) return;

  await prisma.workoutSet.delete({ where: { id: setId } });
  revalidatePath(`/logs/${logId}`);
}

export async function deleteWorkoutLog(id: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.workoutLog.deleteMany({
    where: { id, userId: session.userId },
  });

  revalidatePath("/logs");
}

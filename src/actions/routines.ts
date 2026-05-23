"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RoutineSchema, type RoutineState } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function createRoutine(
  _state: RoutineState,
  formData: FormData,
): Promise<RoutineState> {
  const session = await getSession();
  if (!session) return { message: "No autorizado." };

  const exerciseIds = formData.getAll("exerciseIds") as string[];

  const validated = RoutineSchema.safeParse({
    name: formData.get("name"),
    exerciseIds,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const routine = await prisma.routine.create({
    data: {
      name: validated.data.name,
      userId: session.userId,
      exercises: {
        create: validated.data.exerciseIds.map((exerciseId, index) => ({
          exerciseId,
          order: index,
        })),
      },
    },
  });

  revalidatePath("/routines");
  redirect(`/routines/${routine.id}`);
}

export async function updateRoutine(
  id: string,
  _state: RoutineState,
  formData: FormData,
): Promise<RoutineState> {
  const session = await getSession();
  if (!session) return { message: "No autorizado." };

  const exerciseIds = formData.getAll("exerciseIds") as string[];

  const validated = RoutineSchema.safeParse({
    name: formData.get("name"),
    exerciseIds,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const existing = await prisma.routine.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return { message: "Rutina no encontrada." };

  await prisma.$transaction([
    prisma.routineExercise.deleteMany({ where: { routineId: id } }),
    prisma.routine.update({
      where: { id },
      data: {
        name: validated.data.name,
        exercises: {
          create: validated.data.exerciseIds.map((exerciseId, index) => ({
            exerciseId,
            order: index,
          })),
        },
      },
    }),
  ]);

  revalidatePath("/routines");
  redirect("/routines");
}

export async function deleteRoutine(id: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.routine.deleteMany({
    where: { id, userId: session.userId },
  });

  revalidatePath("/routines");
}

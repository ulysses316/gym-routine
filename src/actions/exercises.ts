"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadExerciseImage } from "@/lib/cloudinary";
import { ExerciseSchema, type ExerciseState } from "@/lib/definitions";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function createExercise(
  _state: ExerciseState,
  formData: FormData,
): Promise<ExerciseState> {
  const session = await getSession();
  if (!session) return { message: "No autorizado." };

  const photoFile = formData.get("photo") as File | null;
  let photoUrl: string | undefined;

  if (photoFile && photoFile.size > 0) {
    try {
      photoUrl = await uploadExerciseImage(photoFile);
    } catch (err) {
      console.error("[Cloudinary]", err);
      return { message: "Error al subir la imagen." };
    }
  }

  const labelIds = formData.getAll("labelIds") as string[];

  const validated = ExerciseSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    photoUrl,
    videoUrl: (formData.get("videoUrl") as string) || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.exercise.create({
    data: {
      ...validated.data,
      createdById: session.userId,
      labels: {
        create: labelIds.map((labelId) => ({ labelId })),
      },
    },
  });

  revalidatePath("/exercises");
  redirect("/exercises");
}

export async function updateExercise(
  id: string,
  _state: ExerciseState,
  formData: FormData,
): Promise<ExerciseState> {
  const session = await getSession();
  if (!session) return { message: "No autorizado." };

  const existing = await prisma.exercise.findFirst({
    where: { id, createdById: session.userId },
  });
  if (!existing) return { message: "Ejercicio no encontrado." };

  const photoFile = formData.get("photo") as File | null;
  let photoUrl: string | undefined = existing.photoUrl ?? undefined;

  if (photoFile && photoFile.size > 0) {
    try {
      photoUrl = await uploadExerciseImage(photoFile);
    } catch (err) {
      console.error("[Cloudinary]", err);
      return { message: "Error al subir la imagen." };
    }
  }

  const labelIds = formData.getAll("labelIds") as string[];

  const validated = ExerciseSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    photoUrl,
    videoUrl: (formData.get("videoUrl") as string) || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await prisma.$transaction([
    prisma.exerciseLabel.deleteMany({ where: { exerciseId: id } }),
    prisma.exercise.update({
      where: { id },
      data: {
        ...validated.data,
        labels: {
          create: labelIds.map((labelId) => ({ labelId })),
        },
      },
    }),
  ]);

  revalidatePath(`/exercises/${id}`);
  revalidatePath("/exercises");
  redirect(`/exercises/${id}`);
}

export async function deleteExercise(id: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.exercise.deleteMany({
    where: { id, createdById: session.userId },
  });

  revalidatePath("/exercises");
  redirect("/exercises");
}

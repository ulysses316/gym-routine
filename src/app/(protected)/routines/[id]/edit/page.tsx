import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import RoutineEditForm from "@/components/RoutineEditForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function EditRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const [routine, exercises] = await Promise.all([
    prisma.routine.findFirst({
      where: { id, userId: session.userId },
      include: {
        exercises: { orderBy: { order: "asc" } },
      },
    }),
    prisma.exercise.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!routine) notFound();

  const defaultExerciseIds = routine.exercises.map((re) => re.exerciseId);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link
          href="/routines"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Volver a rutinas
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          Editar: {routine.name}
        </h1>
      </div>
      <RoutineEditForm
        routineId={id}
        defaultName={routine.name}
        defaultExerciseIds={defaultExerciseIds}
        exercises={exercises}
      />
    </div>
  );
}

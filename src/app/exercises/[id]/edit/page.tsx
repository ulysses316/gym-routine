import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateExercise } from "@/actions/exercises";
import ExerciseForm from "@/components/ExerciseForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function EditExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [exercise, labels, session] = await Promise.all([
    prisma.exercise.findUnique({
      where: { id },
      include: { labels: { include: { label: true } } },
    }),
    prisma.label.findMany({ orderBy: { name: "asc" } }),
    getSession(),
  ]);

  if (!exercise) notFound();
  if (!session || session.userId !== exercise.createdById)
    redirect("/exercises");

  const boundAction = updateExercise.bind(null, id);

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link
          href={`/exercises/${id}`}
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Volver al ejercicio
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          Editar: {exercise.name}
        </h1>
      </div>
      <ExerciseForm
        action={boundAction}
        defaultValues={{
          ...exercise,
          labelIds: exercise.labels.map((el) => el.labelId),
        }}
        labels={labels}
        backHref={`/exercises/${id}`}
        submitLabel="Guardar cambios"
      />
    </div>
  );
}

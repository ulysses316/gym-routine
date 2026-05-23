import Link from "next/link";
import { createExercise } from "@/actions/exercises";
import ExerciseForm from "@/components/ExerciseForm";
import { prisma } from "@/lib/prisma";

export default async function NewExercisePage() {
  const labels = await prisma.label.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link
          href="/exercises"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Volver a ejercicios
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Nuevo ejercicio</h1>
      </div>
      <ExerciseForm
        action={createExercise}
        labels={labels}
        backHref="/exercises"
        submitLabel="Guardar ejercicio"
      />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import ExerciseLogger from "@/components/ExerciseLogger";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function LogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return null;

  const log = await prisma.workoutLog.findFirst({
    where: { id, userId: session.userId },
    include: {
      routine: {
        include: {
          exercises: {
            include: { exercise: true },
            orderBy: { order: "asc" },
          },
        },
      },
      sets: { orderBy: { setNumber: "asc" } },
    },
  });

  if (!log) notFound();

  const setsByExercise = log.sets.reduce(
    (acc, set) => {
      if (!acc[set.exerciseId]) acc[set.exerciseId] = [];
      acc[set.exerciseId].push(set);
      return acc;
    },
    {} as Record<string, typeof log.sets>,
  );

  const totalSets = log.sets.length;
  const totalVolume = log.sets.reduce((acc, s) => acc + s.reps * s.weightKg, 0);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/logs" className="text-sm text-zinc-400 hover:text-white">
          ← Historial
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">
          {log.routine.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {new Date(log.date).toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        {log.notes && (
          <p className="mt-2 text-sm italic text-zinc-500">{log.notes}</p>
        )}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-400">Series totales</p>
          <p className="mt-0.5 text-2xl font-bold text-white">{totalSets}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-400">Volumen total</p>
          <p className="mt-0.5 text-2xl font-bold text-white">
            {totalVolume.toLocaleString("es-MX")} kg
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-xs text-zinc-400">Ejercicios</p>
          <p className="mt-0.5 text-2xl font-bold text-white">
            {log.routine.exercises.length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {log.routine.exercises.map((re) => (
          <ExerciseLogger
            key={re.exerciseId}
            logId={log.id}
            exerciseId={re.exerciseId}
            exerciseName={re.exercise.name}
            sets={setsByExercise[re.exerciseId] ?? []}
          />
        ))}
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { deleteRoutine } from "@/actions/routines";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function RoutinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const routine = await prisma.routine.findFirst({
    where: { id, userId: session.userId },
    include: {
      exercises: {
        orderBy: { order: "asc" },
        include: {
          exercise: {
            include: {
              labels: { include: { label: true } },
            },
          },
        },
      },
    },
  });

  if (!routine) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/routines"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Volver a rutinas
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">{routine.name}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {routine.exercises.length} ejercicio
              {routine.exercises.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={`/routines/${id}/edit`}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              Editar
            </Link>
            <form
              action={async () => {
                "use server";
                await deleteRoutine(id);
              }}
            >
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-400 transition hover:border-red-500/50 hover:text-red-400"
              >
                Eliminar
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Start workout CTA */}
      <Link
        href={`/logs/new?routineId=${id}`}
        className="mb-8 flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Registrar entrenamiento
      </Link>

      {/* Exercise list */}
      <ol className="space-y-3">
        {routine.exercises.map((re, index) => {
          const ex = re.exercise;
          return (
            <li
              key={re.id}
              className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              {/* Order number */}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-zinc-400">
                {index + 1}
              </span>

              {/* Thumbnail */}
              {ex.photoUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                  <Image
                    src={ex.photoUrl}
                    alt={ex.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-2xl text-zinc-600">
                  🏋️
                </div>
              )}

              {/* Info */}
              <div className="min-w-0 flex-1">
                <Link
                  href={`/exercises/${ex.id}`}
                  className="font-semibold text-white hover:text-orange-400"
                >
                  {ex.name}
                </Link>
                {ex.description && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-zinc-400">
                    {ex.description}
                  </p>
                )}
                {ex.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ex.labels.map(({ label }) => (
                      <span
                        key={label.id}
                        className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-400"
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {routine.exercises.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-center">
          <p className="text-sm text-zinc-400">
            Esta rutina no tiene ejercicios.
          </p>
          <Link
            href={`/routines/${id}/edit`}
            className="mt-3 inline-block text-sm text-orange-400 hover:text-orange-300"
          >
            Agregar ejercicios →
          </Link>
        </div>
      )}
    </div>
  );
}

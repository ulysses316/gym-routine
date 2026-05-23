import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function ExercisesPage() {
  const [exercises, session] = await Promise.all([
    prisma.exercise.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: { select: { name: true } },
        labels: { include: { label: true } },
      },
    }),
    getSession(),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ejercicios</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {exercises.length} ejercicio{exercises.length !== 1 ? "s" : ""}{" "}
            disponibles
          </p>
        </div>
        {session && (
          <Link
            href="/exercises/new"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            + Agregar ejercicio
          </Link>
        )}
      </div>

      {exercises.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">No hay ejercicios aún.</p>
          {session && (
            <Link
              href="/exercises/new"
              className="mt-4 inline-block text-sm font-medium text-orange-400 hover:text-orange-300"
            >
              Agrega el primero →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden transition hover:border-zinc-600"
            >
              <div className="relative h-44 w-full bg-zinc-800">
                {exercise.photoUrl ? (
                  <Image
                    src={exercise.photoUrl}
                    alt={exercise.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl text-zinc-600">
                    🏋️
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-white">{exercise.name}</h2>
                {exercise.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {exercise.description}
                  </p>
                )}
                {exercise.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {exercise.labels.map(({ label }) => (
                      <span
                        key={label.id}
                        className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-400"
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs text-zinc-500">
                  Por {exercise.createdBy.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

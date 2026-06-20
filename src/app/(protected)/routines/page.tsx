import Link from "next/link";
import { deleteRoutine } from "@/actions/routines";
import Pagination from "@/components/Pagination";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const PER_PAGE = 25;

export default async function RoutinesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [routines, total] = await Promise.all([
    prisma.routine.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        exercises: { include: { exercise: true }, orderBy: { order: "asc" } },
      },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.routine.count({ where: { userId: session.userId } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Mis rutinas</h1>
        <Link
          href="/routines/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Nueva rutina
        </Link>
      </div>

      {routines.length === 0 && page === 1 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">Aún no tienes rutinas.</p>
          <Link
            href="/routines/new"
            className="mt-4 inline-block text-sm font-medium text-orange-400 hover:text-orange-300"
          >
            Crea tu primera rutina →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/routines/${routine.id}`}
                      className="truncate text-lg font-semibold text-white hover:text-orange-400"
                    >
                      {routine.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-zinc-400">
                      {routine.exercises.length} ejercicio
                      {routine.exercises.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Link
                      href={`/routines/${routine.id}/edit`}
                      className="text-sm text-zinc-400 transition hover:text-white"
                    >
                      Editar
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteRoutine(routine.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="text-sm text-zinc-500 transition hover:text-red-400"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </div>

                <ul className="mt-3 space-y-1">
                  {routine.exercises.slice(0, 4).map((re) => (
                    <li key={re.id} className="text-sm text-zinc-400">
                      • {re.exercise.name}
                    </li>
                  ))}
                  {routine.exercises.length > 4 && (
                    <li className="text-sm text-zinc-500">
                      +{routine.exercises.length - 4} más
                    </li>
                  )}
                </ul>

                <Link
                  href={`/logs/new?routineId=${routine.id}`}
                  className="mt-4 inline-block rounded-lg bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/20"
                >
                  Registrar entrenamiento
                </Link>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={(p) => (p === 1 ? "/routines" : `/routines?page=${p}`)}
          />
        </>
      )}
    </div>
  );
}

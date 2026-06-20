import Link from "next/link";
import { deleteWorkoutLog } from "@/actions/logs";
import Pagination from "@/components/Pagination";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const PER_PAGE = 25;

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [logs, total] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { userId: session.userId },
      orderBy: { date: "desc" },
      include: {
        routine: true,
        sets: true,
      },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.workoutLog.count({ where: { userId: session.userId } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Historial</h1>
        <Link
          href="/logs/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Nuevo registro
        </Link>
      </div>

      {logs.length === 0 && page === 1 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">No hay registros todavía.</p>
          <Link
            href="/logs/new"
            className="mt-4 inline-block text-sm font-medium text-orange-400 hover:text-orange-300"
          >
            Registra tu primer entrenamiento →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4"
              >
                <div>
                  <Link
                    href={`/logs/${log.id}`}
                    className="font-semibold text-white hover:text-orange-400"
                  >
                    {log.routine.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    {new Date(log.date).toLocaleDateString("es-MX", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {log.sets.length} serie{log.sets.length !== 1 ? "s" : ""}{" "}
                    registradas
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/logs/${log.id}`}
                    className="text-sm text-orange-400 hover:text-orange-300"
                  >
                    Ver →
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await deleteWorkoutLog(log.id);
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
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            buildHref={(p) => (p === 1 ? "/logs" : `/logs?page=${p}`)}
          />
        </>
      )}
    </div>
  );
}

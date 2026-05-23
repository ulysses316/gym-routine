import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [routinesCount, logsCount, lastLog] = await Promise.all([
    prisma.routine.count({ where: { userId: session.userId } }),
    prisma.workoutLog.count({ where: { userId: session.userId } }),
    prisma.workoutLog.findFirst({
      where: { userId: session.userId },
      orderBy: { date: "desc" },
      include: { routine: true },
    }),
  ]);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">
        Hola, {session.name} 👋
      </h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Rutinas creadas" value={routinesCount} />
        <StatCard label="Entrenamientos" value={logsCount} />
        <StatCard
          label="Último entreno"
          value={
            lastLog
              ? new Date(lastLog.date).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "short",
                })
              : "—"
          }
        />
      </div>

      {lastLog && (
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <p className="mb-1 text-sm text-zinc-400">Último entrenamiento</p>
          <p className="text-lg font-semibold text-white">
            {lastLog.routine.name}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {new Date(lastLog.date).toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <Link
            href={`/logs/${lastLog.id}`}
            className="mt-3 inline-block text-sm font-medium text-orange-400 hover:text-orange-300"
          >
            Ver detalle →
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <ActionCard
          href="/logs/new"
          title="Registrar entrenamiento"
          description="Inicia un nuevo registro de hoy"
          accent
        />
        <ActionCard
          href="/routines/new"
          title="Nueva rutina"
          description="Crea un bundle de ejercicios"
        />
        <ActionCard
          href="/exercises/new"
          title="Agregar ejercicio"
          description="Sube un ejercicio con foto"
        />
        <ActionCard
          href="/logs"
          title="Ver historial"
          description="Revisa todos tus entrenamientos"
        />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
  accent,
}: {
  href: string;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-5 transition hover:border-zinc-600 ${
        accent
          ? "border-orange-500/40 bg-orange-500/5 hover:bg-orange-500/10"
          : "border-zinc-800 bg-zinc-900 hover:bg-zinc-800/60"
      }`}
    >
      <p
        className={`font-semibold ${accent ? "text-orange-400" : "text-white"}`}
      >
        {title}
      </p>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </Link>
  );
}

import WeekStartDayForm from "@/components/settings/WeekStartDayForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { WEEK_DAYS } from "@/lib/stats";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.userId },
    select: { weekStartDay: true },
  });

  return (
    <div className="mx-auto max-w-lg space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Configuración</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Ajusta cómo funciona la app para ti
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-1 text-sm font-semibold text-white">
          Inicio de semana
        </h2>
        <p className="mb-4 text-sm text-zinc-400">
          Define qué día inicia tu semana de ejercicios. Afecta las
          estadísticas, el heatmap y los volúmenes semanales.
        </p>
        <WeekStartDayForm
          currentDay={user.weekStartDay}
          dayLabels={WEEK_DAYS}
        />
      </div>
    </div>
  );
}

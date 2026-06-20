import Link from "next/link";
import ConsistencyHeatmap from "@/components/stats/ConsistencyHeatmap";
import InsightsList from "@/components/stats/InsightsList";
import MuscleBalanceSection from "@/components/stats/MuscleBalanceSection";
import OverviewCards from "@/components/stats/OverviewCards";
import PRSection from "@/components/stats/PRSection";
import StrengthSection from "@/components/stats/StrengthSection";
import VolumeSection from "@/components/stats/VolumeSection";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { computeStats } from "@/lib/stats";

export default async function StatsPage() {
  const session = await getSession();
  if (!session) return null;

  const [logs, user] = await Promise.all([
    prisma.workoutLog.findMany({
      where: { userId: session.userId },
      orderBy: { date: "asc" },
      include: {
        sets: {
          include: {
            exercise: {
              include: { labels: { include: { label: true } } },
            },
          },
        },
      },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: session.userId },
      select: { weekStartDay: true },
    }),
  ]);

  const stats = computeStats(logs, user.weekStartDay);

  if (!stats.hasData) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <p className="text-4xl">📊</p>
        <h1 className="mt-4 text-xl font-bold text-white">Sin datos aún</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Registra tu primer entrenamiento para ver tus estadísticas.
        </p>
        <Link
          href="/logs/new"
          className="mt-6 inline-block rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Registrar entrenamiento
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Basado en {stats.totalWorkouts} entrenamientos registrados
        </p>
      </div>

      {/* 1. KPIs — above the fold, decisión rápida */}
      <OverviewCards stats={stats} />

      {/* 2. Insights — accionables, visibles sin scroll */}
      {stats.insights.length > 0 && <InsightsList insights={stats.insights} />}

      {/* 3. Progreso de fuerza — mayor engagement */}
      <StrengthSection exercises={stats.strengthByExercise} />

      {/* 4. Consistencia — motivacional, heatmap */}
      <ConsistencyHeatmap
        heatmap={stats.heatmap}
        currentStreak={stats.currentStreak}
        bestStreak={stats.bestStreak}
        weeklyFrequency={stats.weeklyFrequency}
        weekStartDay={user.weekStartDay}
      />

      {/* 5. Volumen — tendencia de carga */}
      <VolumeSection
        weeklyVolumes={stats.weeklyVolumes}
        thisWeek={stats.thisWeek}
        lastWeek={stats.lastWeek}
        thisMonth={stats.thisMonth}
        lastMonth={stats.lastMonth}
      />

      {/* 6. Balance muscular — detectar huecos */}
      <MuscleBalanceSection muscles={stats.muscleVolumes} />

      {/* 7. PRs — hitos y logros */}
      <PRSection prs={stats.prs} />
    </div>
  );
}

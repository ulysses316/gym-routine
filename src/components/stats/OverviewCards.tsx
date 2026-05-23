import type { StatsResult } from "@/lib/stats";

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

export default function OverviewCards({ stats }: { stats: StatsResult }) {
  const cards = [
    {
      label: "Entrenamientos",
      value: String(stats.totalWorkouts),
      sub: `${stats.weeklyFrequency}x / semana`,
      color: "text-orange-400",
    },
    {
      label: "Racha actual",
      value: `${stats.currentStreak}d`,
      sub: `Mejor: ${stats.bestStreak}d`,
      color: "text-yellow-400",
    },
    {
      label: "Esta semana",
      value: String(stats.thisWeek.workouts),
      sub: `vs ${stats.lastWeek.workouts} semana anterior`,
      color:
        stats.thisWeek.workouts >= stats.lastWeek.workouts
          ? "text-green-400"
          : "text-red-400",
    },
    {
      label: "Volumen total",
      value: `${fmt(stats.totalVolume)} kg`,
      sub: `${fmt(stats.thisMonth.volume)} kg este mes`,
      color: "text-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
        >
          <p className="text-xs text-zinc-500">{c.label}</p>
          <p className={`mt-1 text-2xl font-bold ${c.color}`}>{c.value}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{c.sub}</p>
        </div>
      ))}
    </div>
  );
}

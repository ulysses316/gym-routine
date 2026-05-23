"use client";

import { useState } from "react";
import type { PeriodStats, WeeklyVolume } from "@/lib/stats";

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
}

function DeltaBadge({ curr, prev }: { curr: number; prev: number }) {
  if (prev === 0) return null;
  const pct = Math.round(((curr - prev) / prev) * 100);
  if (pct === 0) return null;
  const up = pct > 0;
  return (
    <span
      className={`text-xs font-medium ${up ? "text-green-400" : "text-red-400"}`}
    >
      {up ? "+" : ""}
      {pct}%
    </span>
  );
}

export default function VolumeSection({
  weeklyVolumes,
  thisWeek,
  lastWeek,
  thisMonth,
  lastMonth,
}: {
  weeklyVolumes: WeeklyVolume[];
  thisWeek: PeriodStats;
  lastWeek: PeriodStats;
  thisMonth: PeriodStats;
  lastMonth: PeriodStats;
}) {
  const [metric, setMetric] = useState<"volume" | "sets" | "workouts">(
    "volume",
  );

  const metricLabel = {
    volume: "Tonelaje (kg)",
    sets: "Series",
    workouts: "Entrenos",
  };

  const vals = weeklyVolumes.map((w) => w[metric]);
  const maxVal = Math.max(...vals, 1);

  const comparisons = [
    {
      label: "Esta semana",
      curr: thisWeek,
      prev: lastWeek,
      prevLabel: "semana anterior",
    },
    {
      label: "Este mes",
      curr: thisMonth,
      prev: lastMonth,
      prevLabel: "mes anterior",
    },
  ];

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Volumen
      </h2>

      {/* Comparison cards */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {comparisons.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <p className="text-xs text-zinc-500">{c.label}</p>
            <p className="mt-1 text-xl font-bold text-white">
              {fmt(c.curr.volume)}{" "}
              <span className="text-sm font-normal text-zinc-500">kg</span>
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-xs text-zinc-600">
                vs {fmt(c.prev.volume)} kg ({c.prevLabel})
              </span>
              <DeltaBadge curr={c.curr.volume} prev={c.prev.volume} />
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        {/* Metric toggle */}
        <div className="mb-4 flex gap-1">
          {(["volume", "sets", "workouts"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMetric(m)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                metric === m
                  ? "bg-orange-500 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {metricLabel[m]}
            </button>
          ))}
        </div>

        {/* Bars */}
        <div className="flex h-32 items-end gap-1">
          {weeklyVolumes.map((w) => {
            const val = w[metric];
            const heightPct = maxVal > 0 ? (val / maxVal) * 100 : 0;
            const isCurrentWeek = w.weekKey === weeklyVolumes.at(-1)?.weekKey;
            return (
              <div
                key={w.weekKey}
                className="group relative flex flex-1 flex-col items-center justify-end"
                title={`${w.label}: ${fmt(val)}`}
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    isCurrentWeek
                      ? "bg-orange-500"
                      : "bg-zinc-700 group-hover:bg-zinc-600"
                  }`}
                  style={{ height: `${Math.max(heightPct, val > 0 ? 2 : 0)}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* X-axis: show every 4 weeks */}
        <div className="mt-1 flex items-center gap-1">
          {weeklyVolumes.map((w, i) => (
            <div key={w.weekKey} className="flex-1 text-center">
              {i % 4 === 0 && (
                <span className="text-[9px] text-zinc-600">{w.label}</span>
              )}
            </div>
          ))}
        </div>

        <p className="mt-1 text-right text-xs text-zinc-600">
          Últimas {weeklyVolumes.length} semanas
        </p>
      </div>
    </div>
  );
}

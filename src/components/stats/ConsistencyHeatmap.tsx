"use client";

import { useState } from "react";
import type { HeatmapDay } from "@/lib/stats";

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const ALL_DAYS = ["D", "L", "M", "X", "J", "V", "S"];

function cellColor(count: number): string {
  if (count === 0) return "bg-zinc-800";
  if (count === 1) return "bg-orange-500/40";
  if (count === 2) return "bg-orange-500/70";
  return "bg-orange-500";
}

export default function ConsistencyHeatmap({
  heatmap,
  currentStreak,
  bestStreak,
  weeklyFrequency: _weeklyFrequency,
  weekStartDay = 1,
}: {
  heatmap: HeatmapDay[];
  currentStreak: number;
  bestStreak: number;
  weeklyFrequency: number;
  weekStartDay?: number;
}) {
  const days = [
    ...ALL_DAYS.slice(weekStartDay),
    ...ALL_DAYS.slice(0, weekStartDay),
  ];
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
  } | null>(null);

  // Group by week column
  const weeks: HeatmapDay[][] = [];
  for (const day of heatmap) {
    if (!weeks[day.week]) weeks[day.week] = [];
    weeks[day.week][day.day] = day;
  }

  // Month labels: find first week of each month
  const monthLabels: { week: number; label: string }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const week = weeks[w];
    if (!week) continue;
    const firstDay = week.find((d) => d);
    if (!firstDay) continue;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ week: w, label: MONTHS[month] });
      lastMonth = month;
    }
  }

  const totalWorkouts = heatmap.filter((d) => d.count > 0).length;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Consistencia
      </h2>

      {/* Stats strip */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        {[
          { label: "Racha actual", value: `${currentStreak}d` },
          { label: "Mejor racha", value: `${bestStreak}d` },
          { label: "Días entrenados", value: String(totalWorkouts) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center"
          >
            <p className="text-lg font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        {/* Month labels */}
        <div className="mb-1 flex" style={{ paddingLeft: "1.5rem" }}>
          {weeks.map((week, wi) => {
            const ml = monthLabels.find((m) => m.week === wi);
            const weekKey = week?.find((d) => d)?.date ?? `w-${wi}`;
            return (
              <div
                key={`ml-${weekKey}`}
                className="flex-shrink-0"
                style={{ width: "0.875rem", marginRight: "0.125rem" }}
              >
                {ml && (
                  <span className="text-[9px] text-zinc-500">{ml.label}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Grid: day labels + week columns */}
        <div className="flex gap-0">
          {/* Day labels */}
          <div className="mr-0.5 flex flex-col gap-0.5">
            {days.map((d, i) => (
              <div
                key={d}
                className="flex h-3.5 w-5 items-center justify-end pr-1"
              >
                {i % 2 === 1 && (
                  <span className="text-[9px] text-zinc-600">{d}</span>
                )}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-0.5 overflow-x-auto pb-1">
            {weeks.map((week, wi) => {
              const weekKey = week?.find((d) => d)?.date ?? `wk-${wi}`;
              return (
                <div
                  key={weekKey}
                  className="flex flex-shrink-0 flex-col gap-0.5"
                >
                  {Array.from({ length: 7 }, (_, di) => {
                    const day = week?.[di];
                    const slotKey = `${weekKey}-${di}`;
                    return day ? (
                      <button
                        key={day.date}
                        type="button"
                        className={`h-3.5 w-3.5 rounded-[2px] transition-opacity hover:opacity-80 ${cellColor(day.count)}`}
                        onMouseEnter={() =>
                          setTooltip({ date: day.date, count: day.count })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        aria-label={`${day.date}: ${day.count} entrenamientos`}
                      />
                    ) : (
                      <div key={slotKey} className="h-3.5 w-3.5" />
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <p className="mt-2 text-center text-xs text-zinc-400">
            {new Date(tooltip.date).toLocaleDateString("es-MX", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            {" — "}
            {tooltip.count === 0
              ? "Sin entrenamiento"
              : `${tooltip.count} entrenamiento${tooltip.count > 1 ? "s" : ""}`}
          </p>
        )}

        {/* Legend */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          <span className="text-xs text-zinc-600">Menos</span>
          {[0, 1, 2, 3].map((v) => (
            <div key={v} className={`h-3 w-3 rounded-[2px] ${cellColor(v)}`} />
          ))}
          <span className="text-xs text-zinc-600">Más</span>
        </div>
      </div>
    </div>
  );
}

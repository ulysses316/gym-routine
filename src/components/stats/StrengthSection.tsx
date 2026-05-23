"use client";

import { useState } from "react";
import type { ExerciseStrength } from "@/lib/stats";

const TREND_STYLE = {
  improving: { label: "Mejorando", color: "text-green-400" },
  stagnant: { label: "Estancado", color: "text-yellow-400" },
  declining: { label: "Bajando", color: "text-red-400" },
};

function LineChart({ data }: { data: { date: string; e1rm: number }[] }) {
  if (data.length < 2) {
    return (
      <div className="flex h-28 items-center justify-center text-xs text-zinc-600">
        Necesitas al menos 2 sesiones para ver la progresión
      </div>
    );
  }

  const W = 400;
  const H = 100;
  const P = { top: 8, right: 8, bottom: 20, left: 36 };
  const cW = W - P.left - P.right;
  const cH = H - P.top - P.bottom;

  const vals = data.map((d) => d.e1rm);
  const minV = Math.min(...vals) * 0.95;
  const maxV = Math.max(...vals) * 1.05;
  const range = maxV - minV || 1;

  const px = (i: number) => P.left + (i / (data.length - 1)) * cW;
  const py = (v: number) => P.top + cH - ((v - minV) / range) * cH;

  const linePath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(d.e1rm).toFixed(1)}`,
    )
    .join(" ");
  const areaPath = `${linePath} L ${px(data.length - 1).toFixed(1)} ${(P.top + cH).toFixed(1)} L ${P.left.toFixed(1)} ${(P.top + cH).toFixed(1)} Z`;

  const yTicks = [
    { id: "min", v: minV },
    { id: "mid", v: (minV + maxV) / 2 },
    { id: "max", v: maxV },
  ];
  const xLabelIndices = [
    0,
    Math.floor(data.length / 2),
    data.length - 1,
  ].filter((v, i, arr) => arr.indexOf(v) === i);
  const xLabels = xLabelIndices.map((i) => ({
    x: px(i),
    idx: i,
    label: new Date(data[i].date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    }),
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      aria-label="Progresión de fuerza"
    >
      <title>Progresión de fuerza estimada (1RM)</title>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(({ id, v }) => (
        <line
          key={`gl-${id}`}
          x1={P.left}
          y1={py(v)}
          x2={W - P.right}
          y2={py(v)}
          stroke="#27272a"
          strokeWidth="0.8"
        />
      ))}

      {/* Y labels */}
      {yTicks.map(({ id, v }) => (
        <text
          key={`yl-${id}`}
          x={P.left - 3}
          y={py(v) + 3}
          textAnchor="end"
          fontSize="8"
          fill="#71717a"
        >
          {Math.round(v)}
        </text>
      ))}

      {/* X labels */}
      {xLabels.map((xl) => (
        <text
          key={xl.idx}
          x={xl.x}
          y={H - 2}
          textAnchor="middle"
          fontSize="7"
          fill="#71717a"
        >
          {xl.label}
        </text>
      ))}

      {/* Area */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#f97316"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Dots */}
      {data.map((d, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: index is the stable position identity for chart dots
        <circle key={i} cx={px(i)} cy={py(d.e1rm)} r="2" fill="#f97316" />
      ))}

      {/* First & last labels */}
      {[0, data.length - 1].map((i) => (
        <text
          key={i}
          x={px(i)}
          y={py(data[i].e1rm) - 5}
          textAnchor={i === 0 ? "start" : "end"}
          fontSize="8"
          fill="#f97316"
          fontWeight="600"
        >
          {data[i].e1rm} kg
        </text>
      ))}
    </svg>
  );
}

export default function StrengthSection({
  exercises,
}: {
  exercises: ExerciseStrength[];
}) {
  const [selectedId, setSelectedId] = useState(exercises[0]?.id ?? "");
  const selected = exercises.find((e) => e.id === selectedId) ?? exercises[0];

  if (exercises.length === 0) {
    return (
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Progreso de fuerza
        </h2>
        <p className="text-sm text-zinc-500">
          Registra entrenamientos para ver tu progresión.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Progreso de fuerza
      </h2>

      {/* Exercise selector */}
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
      >
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name}
          </option>
        ))}
      </select>

      {selected && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          {/* Stats row */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-zinc-500">1RM estimado</p>
              <p className="mt-0.5 text-lg font-bold text-orange-400">
                {selected.latestE1rm > 0 ? `${selected.latestE1rm} kg` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Máximo histórico</p>
              <p className="mt-0.5 text-lg font-bold text-white">
                {selected.peakE1rm > 0 ? `${selected.peakE1rm} kg` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500">Tendencia</p>
              <p
                className={`mt-0.5 text-sm font-semibold ${TREND_STYLE[selected.trend].color}`}
              >
                {TREND_STYLE[selected.trend].label}
              </p>
            </div>
          </div>

          {/* Chart */}
          <LineChart data={selected.history} />

          {/* Bottom meta */}
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
            <span>{selected.totalSessions} sesiones registradas</span>
            {selected.improvementPct !== 0 && (
              <span
                className={
                  selected.improvementPct > 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {selected.improvementPct > 0 ? "+" : ""}
                {selected.improvementPct}% desde el inicio
              </span>
            )}
          </div>

          {selected.weeksStagnant >= 4 && (
            <p className="mt-2 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
              ⚠️ Sin nuevo récord en {selected.weeksStagnant} semanas. Considera
              cambiar el rango de repeticiones, agregar peso o variar el
              ejercicio.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

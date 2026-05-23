"use client";

interface Point {
  date: string;
  value: number;
}

interface Props {
  data: Point[];
  unit: string;
  color: string;
  gradientId: string;
  gradientColor: string;
}

export default function WeightChart({
  data,
  unit,
  color,
  gradientId,
  gradientColor,
}: Props) {
  if (data.length < 2) {
    return (
      <div className="flex h-28 items-center justify-center text-xs text-zinc-600">
        Necesitas al menos 2 registros para ver la evolución
      </div>
    );
  }

  const W = 400;
  const H = 100;
  const P = { top: 10, right: 8, bottom: 20, left: 40 };
  const cW = W - P.left - P.right;
  const cH = H - P.top - P.bottom;

  const vals = data.map((d) => d.value);
  const minV = Math.min(...vals) * 0.97;
  const maxV = Math.max(...vals) * 1.03;
  const range = maxV - minV || 1;

  const px = (i: number) => P.left + (i / (data.length - 1)) * cW;
  const py = (v: number) => P.top + cH - ((v - minV) / range) * cH;

  const linePath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${px(i).toFixed(1)} ${py(d.value).toFixed(1)}`,
    )
    .join(" ");
  const areaPath = `${linePath} L ${px(data.length - 1).toFixed(1)} ${(P.top + cH).toFixed(1)} L ${P.left.toFixed(1)} ${(P.top + cH).toFixed(1)} Z`;

  const yTicks = [
    { id: "min", v: minV },
    { id: "mid", v: (minV + maxV) / 2 },
    { id: "max", v: maxV },
  ];
  const xLabels = [0, Math.floor(data.length / 2), data.length - 1]
    .filter((i, idx, arr) => arr.indexOf(i) === idx)
    .map((i) => ({
      idx: i,
      x: px(i),
      label: new Date(data[i].date).toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
      }),
    }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      aria-label={`Evolución ${unit}`}
    >
      <title>Evolución de {unit}</title>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
        </linearGradient>
      </defs>

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

      {yTicks.map(({ id, v }) => (
        <text
          key={`yl-${id}`}
          x={P.left - 3}
          y={py(v) + 3}
          textAnchor="end"
          fontSize="8"
          fill="#71717a"
        >
          {Math.round(v * 10) / 10}
        </text>
      ))}

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

      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {data.map((d, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: index is the stable position identity for chart dots
        <circle key={i} cx={px(i)} cy={py(d.value)} r="2" fill={color} />
      ))}

      {[0, data.length - 1].map((i) => (
        <text
          key={i}
          x={px(i)}
          y={py(data[i].value) - 5}
          textAnchor={i === 0 ? "start" : "end"}
          fontSize="8"
          fill={color}
          fontWeight="600"
        >
          {data[i].value} {unit}
        </text>
      ))}
    </svg>
  );
}

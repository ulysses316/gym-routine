import type { MuscleVolume } from "@/lib/stats";

const CATEGORY_LABELS: Record<MuscleVolume["category"], string> = {
  push: "Push (pecho, hombros, tríceps)",
  pull: "Pull (espalda, bíceps, trapecio)",
  legs: "Piernas",
  core: "Core",
  other: "Otros",
};

const CATEGORY_COLOR: Record<MuscleVolume["category"], string> = {
  push: "bg-orange-500",
  pull: "bg-blue-500",
  legs: "bg-green-500",
  core: "bg-purple-500",
  other: "bg-zinc-500",
};

export default function MuscleBalanceSection({
  muscles,
}: {
  muscles: MuscleVolume[];
}) {
  // Aggregate by category
  const byCategory: Record<string, { volume: number; sets: number }> = {};
  for (const m of muscles) {
    if (!byCategory[m.category])
      byCategory[m.category] = { volume: 0, sets: 0 };
    byCategory[m.category].volume += m.volume;
    byCategory[m.category].sets += m.sets;
  }

  const totalVol = Object.values(byCategory).reduce((s, v) => s + v.volume, 0);
  const categories = (
    ["push", "pull", "legs", "core", "other"] as const
  ).filter((c) => byCategory[c]?.volume > 0);

  // Top individual muscles
  const topMuscles = muscles.slice(0, 8);

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Balance muscular
      </h2>

      {muscles.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Agrega labels a tus ejercicios para ver el balance muscular.
        </p>
      ) : (
        <>
          {/* Category bars */}
          <div className="mb-5 space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            {categories.map((cat) => {
              const pct = Math.round((byCategory[cat].volume / totalVol) * 100);
              return (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-zinc-300">
                      {CATEGORY_LABELS[cat]}
                    </span>
                    <span className="font-medium text-zinc-400">{pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all ${CATEGORY_COLOR[cat]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Individual muscle chips */}
          <div className="flex flex-wrap gap-2">
            {topMuscles.map((m) => (
              <div
                key={m.name}
                className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs"
              >
                <span
                  className={`h-2 w-2 rounded-full ${CATEGORY_COLOR[m.category]}`}
                />
                <span className="text-zinc-300">{m.name}</span>
                <span className="text-zinc-500">{m.percentage}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

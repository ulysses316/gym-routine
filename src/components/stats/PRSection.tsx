import type { PR } from "@/lib/stats";

export default function PRSection({ prs }: { prs: PR[] }) {
  const shown = prs.slice(0, 10);

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Records Personales
      </h2>

      {shown.length === 0 ? (
        <p className="text-sm text-zinc-500">Aún no hay PRs registrados.</p>
      ) : (
        <div className="space-y-2">
          {shown.map((pr) => (
            <div
              key={pr.exerciseId}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-white">
                  {pr.exerciseName}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {pr.weight > 0
                    ? `${pr.weight} kg × ${pr.reps} reps`
                    : `${pr.reps} reps`}
                  {" · "}
                  {new Date(pr.date).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-orange-400">
                  {pr.e1rm > 0 ? `~${pr.e1rm} kg` : `${pr.reps} reps`}
                </p>
                {pr.improvementPct !== null && pr.improvementPct > 0 && (
                  <p className="text-xs text-green-400">
                    +{pr.improvementPct}%
                  </p>
                )}
                {pr.isRecent && (
                  <span className="mt-0.5 inline-block rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-400">
                    Nuevo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

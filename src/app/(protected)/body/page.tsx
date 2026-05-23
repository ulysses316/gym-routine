import Link from "next/link";
import { deleteBodyRecord } from "@/actions/body";
import WeightChart from "@/components/body/WeightChart";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function bmi(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

function bmiCategory(v: number): { label: string; color: string } {
  if (v < 18.5) return { label: "Bajo peso", color: "text-blue-400" };
  if (v < 25) return { label: "Normal", color: "text-green-400" };
  if (v < 30) return { label: "Sobrepeso", color: "text-yellow-400" };
  return { label: "Obesidad", color: "text-red-400" };
}

function fmt(v: number | null | undefined, unit: string): string {
  if (v == null) return "—";
  return `${v} ${unit}`;
}

function Delta({
  current,
  previous,
  unit,
}: {
  current: number | null | undefined;
  previous: number | null | undefined;
  unit: string;
}) {
  if (current == null || previous == null) return null;
  const diff = Math.round((current - previous) * 10) / 10;
  if (diff === 0) return null;
  const positive = diff > 0;
  return (
    <span className={`text-xs ${positive ? "text-red-400" : "text-green-400"}`}>
      {positive ? "+" : ""}
      {diff} {unit}
    </span>
  );
}

export default async function BodyPage() {
  const session = await getSession();
  if (!session) return null;

  const records = await prisma.bodyRecord.findMany({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
  });

  const latest = records[0] ?? null;
  const first = records[records.length - 1] ?? null;
  const previous = records[1] ?? null;

  const bmiVal =
    latest?.weightKg && latest?.heightCm
      ? bmi(latest.weightKg, latest.heightCm)
      : null;
  const bmiInfo = bmiVal ? bmiCategory(bmiVal) : null;

  const weightHistory = records
    .filter((r) => r.weightKg != null)
    .map((r) => ({ date: r.date.toISOString(), value: r.weightKg as number }))
    .reverse();

  const fatHistory = records
    .filter((r) => r.bodyFatPct != null)
    .map((r) => ({ date: r.date.toISOString(), value: r.bodyFatPct as number }))
    .reverse();

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Medidas corporales</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {records.length === 0
              ? "Sin registros aún"
              : `${records.length} registro${records.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          href="/body/new"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          + Nueva medición
        </Link>
      </div>

      {records.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
          <p className="text-3xl">⚖️</p>
          <p className="mt-3 text-sm text-zinc-400">
            Registra tu primera medición para empezar a ver tu evolución.
          </p>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">Peso actual</p>
              <p className="mt-1 text-xl font-bold text-orange-400">
                {fmt(latest?.weightKg, "kg")}
              </p>
              <Delta
                current={latest?.weightKg}
                previous={previous?.weightKg}
                unit="kg"
              />
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">IMC</p>
              <p
                className={`mt-1 text-xl font-bold ${bmiInfo?.color ?? "text-white"}`}
              >
                {bmiVal ?? "—"}
              </p>
              {bmiInfo && (
                <p className={`text-xs ${bmiInfo.color}`}>{bmiInfo.label}</p>
              )}
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">% Grasa</p>
              <p className="mt-1 text-xl font-bold text-white">
                {fmt(latest?.bodyFatPct, "%")}
              </p>
              <Delta
                current={latest?.bodyFatPct}
                previous={previous?.bodyFatPct}
                unit="%"
              />
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">Masa muscular</p>
              <p className="mt-1 text-xl font-bold text-white">
                {fmt(latest?.muscleMassKg, "kg")}
              </p>
              <Delta
                current={latest?.muscleMassKg}
                previous={previous?.muscleMassKg}
                unit="kg"
              />
            </div>
          </div>

          {/* Weight chart */}
          {weightHistory.length >= 2 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Evolución del peso
              </h2>
              <WeightChart
                data={weightHistory}
                unit="kg"
                color="#f97316"
                gradientId="weightGrad"
                gradientColor="#f97316"
              />
            </div>
          )}

          {/* Body fat chart */}
          {fatHistory.length >= 2 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Evolución % grasa corporal
              </h2>
              <WeightChart
                data={fatHistory}
                unit="%"
                color="#a78bfa"
                gradientId="fatGrad"
                gradientColor="#a78bfa"
              />
            </div>
          )}

          {/* First vs latest comparison */}
          {first && latest && first.id !== latest.id && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                Primer registro vs. último
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-zinc-500">
                      <th className="pb-2 text-left font-normal">Medida</th>
                      <th className="pb-2 text-right font-normal">
                        {new Date(first.date).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </th>
                      <th className="pb-2 text-right font-normal">
                        {new Date(latest.date).toLocaleDateString("es-MX", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </th>
                      <th className="pb-2 text-right font-normal">Cambio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {(
                      [
                        ["Peso", "weightKg", "kg"],
                        ["% Grasa", "bodyFatPct", "%"],
                        ["Masa muscular", "muscleMassKg", "kg"],
                        ["% Agua", "waterPct", "%"],
                        ["Masa ósea", "boneMassKg", "kg"],
                        ["Cintura", "waist", "cm"],
                        ["Cadera", "hips", "cm"],
                        ["Pecho", "chest", "cm"],
                      ] as [string, keyof typeof latest, string][]
                    )
                      .filter(
                        ([, key]) => first[key] != null || latest[key] != null,
                      )
                      .map(([label, key, unit]) => {
                        const f = first[key] as number | null;
                        const l = latest[key] as number | null;
                        const diff =
                          f != null && l != null
                            ? Math.round((l - f) * 10) / 10
                            : null;
                        return (
                          <tr key={key} className="text-zinc-300">
                            <td className="py-2 text-xs text-zinc-400">
                              {label}
                            </td>
                            <td className="py-2 text-right text-xs">
                              {fmt(f, unit)}
                            </td>
                            <td className="py-2 text-right text-xs font-medium">
                              {fmt(l, unit)}
                            </td>
                            <td className="py-2 text-right text-xs">
                              {diff != null ? (
                                <span
                                  className={
                                    diff === 0
                                      ? "text-zinc-500"
                                      : diff > 0
                                        ? key === "muscleMassKg" ||
                                          key === "waterPct"
                                          ? "text-green-400"
                                          : "text-red-400"
                                        : key === "muscleMassKg" ||
                                            key === "waterPct"
                                          ? "text-red-400"
                                          : "text-green-400"
                                  }
                                >
                                  {diff > 0 ? "+" : ""}
                                  {diff} {unit}
                                </span>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* History list */}
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Historial
            </h2>
            <div className="space-y-3">
              {records.map((r) => {
                const bv =
                  r.weightKg && r.heightCm ? bmi(r.weightKg, r.heightCm) : null;
                const bi = bv ? bmiCategory(bv) : null;
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-zinc-400">
                          {new Date(r.date).toLocaleDateString("es-MX", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {r.weightKg != null && (
                            <span className="text-sm text-white">
                              <span className="text-zinc-500">Peso </span>
                              <span className="font-semibold text-orange-400">
                                {r.weightKg} kg
                              </span>
                            </span>
                          )}
                          {bv != null && bi && (
                            <span className="text-sm">
                              <span className="text-zinc-500">IMC </span>
                              <span className={`font-semibold ${bi.color}`}>
                                {bv}
                              </span>
                            </span>
                          )}
                          {r.bodyFatPct != null && (
                            <span className="text-sm text-white">
                              <span className="text-zinc-500">Grasa </span>
                              <span className="font-semibold">
                                {r.bodyFatPct}%
                              </span>
                            </span>
                          )}
                          {r.muscleMassKg != null && (
                            <span className="text-sm text-white">
                              <span className="text-zinc-500">Músculo </span>
                              <span className="font-semibold">
                                {r.muscleMassKg} kg
                              </span>
                            </span>
                          )}
                          {r.waterPct != null && (
                            <span className="text-sm text-white">
                              <span className="text-zinc-500">Agua </span>
                              <span className="font-semibold">
                                {r.waterPct}%
                              </span>
                            </span>
                          )}
                          {r.waist != null && (
                            <span className="text-sm text-white">
                              <span className="text-zinc-500">Cintura </span>
                              <span className="font-semibold">
                                {r.waist} cm
                              </span>
                            </span>
                          )}
                        </div>
                        {r.notes && (
                          <p className="mt-2 text-xs italic text-zinc-500">
                            {r.notes}
                          </p>
                        )}
                      </div>
                      <form
                        action={async () => {
                          "use server";
                          await deleteBodyRecord(r.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-zinc-600 transition hover:text-red-400"
                        >
                          Eliminar
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createWorkoutLog } from "@/actions/logs";

interface Exercise {
  exerciseId: string;
  exercise: { name: string };
}

interface Routine {
  id: string;
  name: string;
  exercises: Exercise[];
}

type SetRow = { reps: string; weightKg: string };
type ExerciseSets = Record<string, SetRow[]>;

export default function NewLogForm({ routines }: { routines: Routine[] }) {
  const [state, action, pending] = useActionState(createWorkoutLog, undefined);
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("routineId") ?? "";
  const today = new Date().toISOString().split("T")[0];

  const [selectedRoutineId, setSelectedRoutineId] = useState(preselectedId);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSets>({});
  const [setsJson, setSetsJson] = useState("[]");

  const selectedRoutine = routines.find((r) => r.id === selectedRoutineId);

  useEffect(() => {
    if (!selectedRoutine) {
      setExerciseSets({});
      return;
    }
    const initial: ExerciseSets = {};
    for (const re of selectedRoutine.exercises) {
      initial[re.exerciseId] = [{ reps: "10", weightKg: "0" }];
    }
    setExerciseSets(initial);
  }, [selectedRoutine]);

  useEffect(() => {
    const allSets: {
      exerciseId: string;
      reps: number;
      weightKg: number;
      setNumber: number;
    }[] = [];
    for (const [exerciseId, rows] of Object.entries(exerciseSets)) {
      rows.forEach((row, i) => {
        const reps = Number.parseInt(row.reps, 10) || 0;
        const weightKg = Number.parseFloat(row.weightKg) || 0;
        if (reps > 0) {
          allSets.push({ exerciseId, reps, weightKg, setNumber: i + 1 });
        }
      });
    }
    setSetsJson(JSON.stringify(allSets));
  }, [exerciseSets]);

  function updateSet(
    exerciseId: string,
    index: number,
    field: "reps" | "weightKg",
    value: string,
  ) {
    setExerciseSets((prev) => {
      const rows = [...(prev[exerciseId] ?? [])];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, [exerciseId]: rows };
    });
  }

  function addRow(exerciseId: string) {
    setExerciseSets((prev) => ({
      ...prev,
      [exerciseId]: [
        ...(prev[exerciseId] ?? []),
        { reps: "10", weightKg: "0" },
      ],
    }));
  }

  function removeRow(exerciseId: string, index: number) {
    setExerciseSets((prev) => {
      const rows = prev[exerciseId].filter((_, i) => i !== index);
      return {
        ...prev,
        [exerciseId]: rows.length > 0 ? rows : [{ reps: "10", weightKg: "0" }],
      };
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link href="/logs" className="text-sm text-zinc-400 hover:text-white">
          ← Volver al historial
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Nuevo registro</h1>
      </div>

      <form action={action} className="space-y-6">
        {/* Rutina + Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="routineId"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Rutina *
            </label>
            <select
              id="routineId"
              name="routineId"
              required
              value={selectedRoutineId}
              onChange={(e) => setSelectedRoutineId(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="">Selecciona una rutina</option>
              {routines.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label
              htmlFor="date"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Fecha *
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={today}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Notas <span className="font-normal text-zinc-500">(opcional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            placeholder="Cómo te sentiste, etc."
          />
        </div>

        {/* Ejercicios */}
        {selectedRoutine && (
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-400">
              Ejercicios
            </h2>

            {selectedRoutine.exercises.map((re) => {
              const rows = exerciseSets[re.exerciseId] ?? [];
              return (
                <div
                  key={re.exerciseId}
                  className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <p className="mb-3 font-semibold text-white">
                    {re.exercise.name}
                  </p>

                  {/* Cabecera de columnas */}
                  <div className="mb-1.5 flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-zinc-500">
                    <span className="w-5 shrink-0 text-center">#</span>
                    <span className="w-20">Reps</span>
                    <span className="w-24">Peso (kg)</span>
                  </div>

                  {/* Filas de series */}
                  {rows.map((row, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: index is stable here
                    <div key={i} className="mb-2 flex items-center gap-3">
                      <span className="w-5 shrink-0 text-center text-sm text-zinc-500">
                        {i + 1}
                      </span>
                      <input
                        type="number"
                        min="1"
                        value={row.reps}
                        onChange={(e) =>
                          updateSet(re.exerciseId, i, "reps", e.target.value)
                        }
                        className="w-20 rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-center text-sm text-white focus:border-orange-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={row.weightKg}
                        onChange={(e) =>
                          updateSet(
                            re.exerciseId,
                            i,
                            "weightKg",
                            e.target.value,
                          )
                        }
                        className="w-24 rounded-lg border border-zinc-700 bg-zinc-800 px-2 py-2 text-center text-sm text-white focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeRow(re.exerciseId, i)}
                        className="ml-1 text-zinc-600 transition hover:text-red-400"
                        aria-label="Eliminar serie"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addRow(re.exerciseId)}
                    className="mt-1 text-sm text-orange-400 transition hover:text-orange-300"
                  >
                    + Serie
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <input type="hidden" name="setsJson" value={setsJson} />

        {state?.message && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {state.message}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <Link
            href="/logs"
            className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending || !selectedRoutineId}
            className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar entrenamiento"}
          </button>
        </div>

        {routines.length === 0 && (
          <p className="text-center text-sm text-zinc-400">
            No tienes rutinas.{" "}
            <Link
              href="/routines/new"
              className="text-orange-400 hover:text-orange-300"
            >
              Crea una primero →
            </Link>
          </p>
        )}
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { updateRoutine } from "@/actions/routines";
import type { RoutineState } from "@/lib/definitions";

interface Label {
  id: string;
  name: string;
}

interface Exercise {
  id: string;
  name: string;
  labels: { label: Label }[];
}

interface Props {
  routineId: string;
  defaultName: string;
  defaultExerciseIds: string[];
  exercises: Exercise[];
  allLabels: Label[];
}

export default function RoutineEditForm({
  routineId,
  defaultName,
  defaultExerciseIds,
  exercises,
  allLabels,
}: Props) {
  const boundAction = updateRoutine.bind(null, routineId);
  const [state, action, pending] = useActionState(
    boundAction,
    undefined as RoutineState,
  );
  const [selected, setSelected] = useState<string[]>(defaultExerciseIds);
  const [search, setSearch] = useState("");
  const [labelFilter, setLabelFilter] = useState<Set<string>>(new Set());

  function toggleLabel(id: string) {
    setLabelFilter((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchesLabel =
      labelFilter.size === 0 ||
      e.labels.some(({ label }) => labelFilter.has(label.id));
    return matchesSearch && matchesLabel;
  });

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Nombre de la rutina *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultName}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: section heading for the exercise list below */}
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Ejercicios *
          {selected.length > 0 && (
            <span className="ml-2 rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-400">
              {selected.length} seleccionados
            </span>
          )}
        </label>

        {/* Label filter chips */}
        {allLabels.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {allLabels.map((label) => {
              const active = labelFilter.has(label.id);
              return (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggleLabel(label.id)}
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition ${
                    active
                      ? "border-orange-500 bg-orange-500/20 text-orange-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {label.name}
                </button>
              );
            })}
            {labelFilter.size > 0 && (
              <button
                type="button"
                onClick={() => setLabelFilter(new Set())}
                className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-500 transition hover:border-zinc-500 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>
        )}

        <input
          type="text"
          placeholder="Buscar ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
        />

        <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 p-2">
          {filtered.map((exercise) => {
            const isSelected = selected.includes(exercise.id);
            return (
              <button
                key={exercise.id}
                type="button"
                onClick={() => toggle(exercise.id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-orange-500/15 text-orange-300"
                    : "text-zinc-300 hover:bg-zinc-800"
                }`}
              >
                <span
                  className={`text-base ${isSelected ? "text-orange-400" : "text-zinc-600"}`}
                >
                  {isSelected ? "✓" : "○"}
                </span>
                <span className="flex-1">{exercise.name}</span>
                {exercise.labels.length > 0 && (
                  <span className="shrink-0 text-xs text-zinc-600">
                    {exercise.labels.map((l) => l.label.name).join(", ")}
                  </span>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="px-3 py-2 text-sm text-zinc-500">Sin resultados</p>
          )}
        </div>

        {selected.map((id) => (
          <input key={id} type="hidden" name="exerciseIds" value={id} />
        ))}

        {state?.errors?.exerciseIds && (
          <p className="mt-1 text-xs text-red-400">
            {state.errors.exerciseIds[0]}
          </p>
        )}
      </div>

      {state?.message && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {state.message}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href="/routines"
          className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending || selected.length === 0}
          className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

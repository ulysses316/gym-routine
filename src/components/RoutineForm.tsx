"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createRoutine } from "@/actions/routines";
import type { RoutineState } from "@/lib/definitions";

interface Exercise {
  id: string;
  name: string;
}

export default function RoutineForm({ exercises }: { exercises: Exercise[] }) {
  const [state, action, pending] = useActionState(
    createRoutine,
    undefined as RoutineState,
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()),
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link
          href="/routines"
          className="text-sm text-zinc-400 hover:text-white"
        >
          ← Volver a rutinas
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Nueva rutina</h1>
      </div>

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
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            placeholder="Ej: Push A, Pierna, Full body..."
          />
          {state?.errors?.name && (
            <p className="mt-1 text-xs text-red-400">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          {/* biome-ignore lint/a11y/noLabelWithoutControl: section heading for the exercise list below */}
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Selecciona ejercicios *
            {selected.length > 0 && (
              <span className="ml-2 rounded-full bg-orange-500/20 px-2 py-0.5 text-xs text-orange-400">
                {selected.length} seleccionados
              </span>
            )}
          </label>

          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-3 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          />

          {exercises.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No hay ejercicios.{" "}
              <Link
                href="/exercises/new"
                className="text-orange-400 hover:text-orange-300"
              >
                Agrega uno primero
              </Link>
            </p>
          ) : (
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
                    {exercise.name}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="px-3 py-2 text-sm text-zinc-500">
                  Sin resultados
                </p>
              )}
            </div>
          )}

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
            {pending ? "Creando..." : "Crear rutina"}
          </button>
        </div>
      </form>
    </div>
  );
}

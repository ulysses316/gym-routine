"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Label {
  id: string;
  name: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string | null;
  photoUrl: string | null;
  createdBy: { name: string };
  labels: { label: Label }[];
}

interface Props {
  exercises: Exercise[];
  allLabels: Label[];
  canCreate: boolean;
}

export default function ExerciseList({
  exercises,
  allLabels,
  canCreate,
}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const filtered =
    selected.size === 0
      ? exercises
      : exercises.filter((ex) =>
          ex.labels.some(({ label }) => selected.has(label.id)),
        );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ejercicios</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {filtered.length === exercises.length
              ? `${exercises.length} ejercicio${exercises.length !== 1 ? "s" : ""} disponibles`
              : `${filtered.length} de ${exercises.length} ejercicios`}
          </p>
        </div>
        {canCreate && (
          <Link
            href="/exercises/new"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            + Agregar ejercicio
          </Link>
        )}
      </div>

      {/* Label filter chips */}
      {allLabels.length > 0 && (
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {allLabels.map((label) => {
              const active = selected.has(label.id);
              return (
                <button
                  key={label.id}
                  type="button"
                  onClick={() => toggle(label.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    active
                      ? "border-orange-500 bg-orange-500/20 text-orange-400"
                      : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white"
                  }`}
                >
                  {label.name}
                </button>
              );
            })}
            {selected.size > 0 && (
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-500 transition hover:border-zinc-500 hover:text-white"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exercise grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">
            {exercises.length === 0
              ? "No hay ejercicios aún."
              : "Ningún ejercicio coincide con los filtros seleccionados."}
          </p>
          {exercises.length === 0 && canCreate && (
            <Link
              href="/exercises/new"
              className="mt-4 inline-block text-sm font-medium text-orange-400 hover:text-orange-300"
            >
              Agrega el primero →
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((exercise) => (
            <Link
              key={exercise.id}
              href={`/exercises/${exercise.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-600"
            >
              <div className="relative h-44 w-full bg-zinc-800">
                {exercise.photoUrl ? (
                  <Image
                    src={exercise.photoUrl}
                    alt={exercise.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl text-zinc-600">
                    🏋️
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-white">{exercise.name}</h2>
                {exercise.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
                    {exercise.description}
                  </p>
                )}
                {exercise.labels.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {exercise.labels.map(({ label }) => (
                      <span
                        key={label.id}
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          selected.has(label.id)
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-orange-500/10 text-orange-400"
                        }`}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-xs text-zinc-500">
                  Por {exercise.createdBy.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

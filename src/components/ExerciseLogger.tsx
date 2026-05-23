"use client";

import { useState, useTransition } from "react";
import { addSet, deleteSet } from "@/actions/logs";

interface WorkoutSet {
  id: string;
  setNumber: number;
  reps: number;
  weightKg: number;
}

interface Props {
  logId: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export default function ExerciseLogger({
  logId,
  exerciseId,
  exerciseName,
  sets,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [reps, setReps] = useState("10");
  const [weight, setWeight] = useState("0");

  function handleAddSet() {
    const repsNum = Number.parseInt(reps, 10);
    const weightNum = Number.parseFloat(weight);
    if (!repsNum || repsNum <= 0) return;
    startTransition(async () => {
      await addSet(logId, exerciseId, sets.length + 1, repsNum, weightNum);
    });
  }

  function handleDeleteSet(setId: string) {
    startTransition(async () => {
      await deleteSet(setId, logId);
    });
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="mb-3 font-semibold text-white">{exerciseName}</h3>

      {sets.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="grid grid-cols-4 gap-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
            <span>Serie</span>
            <span>Reps</span>
            <span>Peso (kg)</span>
            <span />
          </div>
          {sets.map((set) => (
            <div
              key={set.id}
              className="grid grid-cols-4 items-center gap-2 text-sm"
            >
              <span className="text-zinc-400">#{set.setNumber}</span>
              <span className="text-white">{set.reps}</span>
              <span className="text-white">{set.weightKg} kg</span>
              <button
                type="button"
                onClick={() => handleDeleteSet(set.id)}
                className="text-left text-xs text-zinc-600 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label
            htmlFor={`reps-${exerciseId}`}
            className="mb-1 block text-xs text-zinc-400"
          >
            Reps
          </label>
          <input
            id={`reps-${exerciseId}`}
            type="number"
            min="1"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor={`weight-${exerciseId}`}
            className="mb-1 block text-xs text-zinc-400"
          >
            Peso (kg)
          </label>
          <input
            id={`weight-${exerciseId}`}
            type="number"
            min="0"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleAddSet}
          disabled={isPending}
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {isPending ? "..." : "+ Serie"}
        </button>
      </div>
    </div>
  );
}

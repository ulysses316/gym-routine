"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { createWorkoutLog } from "@/actions/logs";

interface Routine {
  id: string;
  name: string;
}

export default function NewLogForm({ routines }: { routines: Routine[] }) {
  const [state, action, pending] = useActionState(createWorkoutLog, undefined);
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("routineId") ?? "";
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="mx-auto max-w-sm">
      <div className="mb-6">
        <Link href="/logs" className="text-sm text-zinc-400 hover:text-white">
          ← Volver al historial
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Nuevo registro</h1>
      </div>

      <form action={action} className="space-y-5">
        <div>
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
            defaultValue={preselectedId}
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

        <div>
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

        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            placeholder="Cómo te sentiste, etc."
          />
        </div>

        {state?.message && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {state.message}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <Link
            href="/logs"
            className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {pending ? "Creando..." : "Empezar registro"}
          </button>
        </div>
      </form>

      {routines.length === 0 && (
        <p className="mt-6 text-center text-sm text-zinc-400">
          No tienes rutinas.{" "}
          <Link
            href="/routines/new"
            className="text-orange-400 hover:text-orange-300"
          >
            Crea una primero →
          </Link>
        </p>
      )}
    </div>
  );
}

"use client";

import { useActionState, useTransition } from "react";
import { createLabel, deleteLabel, type LabelState } from "@/actions/labels";

interface Label {
  id: string;
  name: string;
  _count: { exercises: number };
}

export default function LabelManager({ labels }: { labels: Label[] }) {
  const [state, action, pending] = useActionState(
    createLabel,
    undefined as LabelState,
  );
  const [isDeleting, startDelete] = useTransition();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-white">Labels</h1>

      <form action={action} className="mb-6 flex gap-3">
        <input
          name="name"
          type="text"
          required
          maxLength={30}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          placeholder="Nombre del label..."
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-orange-500 px-4 py-2.5 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {pending ? "..." : "Agregar"}
        </button>
      </form>

      {state?.error && (
        <p className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="mb-4 rounded-lg bg-green-500/10 px-4 py-2.5 text-sm text-green-400">
          Label creado.
        </p>
      )}

      {labels.length === 0 ? (
        <p className="text-center text-zinc-500">No hay labels todavía.</p>
      ) : (
        <div className="space-y-2">
          {labels.map((label) => (
            <div
              key={label.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
            >
              <div>
                <span className="font-medium text-white">{label.name}</span>
                <span className="ml-2 text-xs text-zinc-500">
                  {label._count.exercises} ejercicio
                  {label._count.exercises !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() =>
                  startDelete(async () => {
                    await deleteLabel(label.id);
                  })
                }
                className="text-sm text-zinc-500 transition hover:text-red-400 disabled:opacity-40"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

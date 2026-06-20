"use client";

import { useActionState, useState } from "react";
import { updateWeekStartDay } from "@/actions/settings";

export default function WeekStartDayForm({
  currentDay,
  dayLabels,
}: {
  currentDay: number;
  dayLabels: string[];
}) {
  const [selected, setSelected] = useState(currentDay);
  const [state, action, pending] = useActionState(updateWeekStartDay, {
    success: false,
  });

  return (
    <form action={action}>
      <div className="flex flex-wrap gap-2">
        {dayLabels.map((label, i) => (
          <label
            key={label}
            className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition ${
              i === selected
                ? "border-orange-500 bg-orange-500/10 text-orange-400"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
            }`}
          >
            <input
              type="radio"
              name="weekStartDay"
              value={i}
              checked={i === selected}
              className="sr-only"
              onChange={(e) => {
                setSelected(i);
                e.target.form?.requestSubmit();
              }}
            />
            {label}
          </label>
        ))}
      </div>

      {pending && <p className="mt-3 text-sm text-zinc-400">Guardando...</p>}
      {state.success && !pending && (
        <p className="mt-3 text-sm text-green-400">Guardado</p>
      )}
      {state.error && (
        <p className="mt-3 text-sm text-red-400">{state.error}</p>
      )}
    </form>
  );
}

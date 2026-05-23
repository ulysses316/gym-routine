"use client";

import { useState } from "react";

interface Label {
  id: string;
  name: string;
}

interface Props {
  labels: Label[];
  defaultSelected?: string[];
}

export default function LabelSelector({ labels, defaultSelected = [] }: Props) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div>
      {labels.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No hay labels aún. Créalos en{" "}
          <a href="/labels" className="text-orange-400 hover:text-orange-300">
            /labels
          </a>
          .
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {labels.map((label) => {
            const isSelected = selected.includes(label.id);
            return (
              <button
                key={label.id}
                type="button"
                onClick={() => toggle(label.id)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  isSelected
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                }`}
              >
                {isSelected && <span className="mr-1">✓</span>}
                {label.name}
              </button>
            );
          })}
        </div>
      )}
      {selected.map((id) => (
        <input key={id} type="hidden" name="labelIds" value={id} />
      ))}
    </div>
  );
}

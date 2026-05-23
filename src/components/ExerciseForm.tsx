"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import LabelSelector from "@/components/LabelSelector";
import type { ExerciseState } from "@/lib/definitions";

interface Label {
  id: string;
  name: string;
}

interface Props {
  action: (state: ExerciseState, formData: FormData) => Promise<ExerciseState>;
  defaultValues?: {
    name: string;
    description?: string | null;
    photoUrl?: string | null;
    videoUrl?: string | null;
    labelIds?: string[];
  };
  labels: Label[];
  backHref: string;
  submitLabel: string;
}

export default function ExerciseForm({
  action,
  defaultValues,
  labels,
  backHref,
  submitLabel,
}: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(
    defaultValues?.photoUrl ?? null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Nombre del ejercicio *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          placeholder="Ej: Press de banca"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-xs text-red-400">{state.errors.name[0]}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Descripción / Instrucciones
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          placeholder="Cómo se realiza el ejercicio..."
        />
      </div>

      <div>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: wraps a group of checkboxes via LabelSelector */}
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Labels
        </label>
        <LabelSelector
          labels={labels}
          defaultSelected={defaultValues?.labelIds ?? []}
        />
      </div>

      <div>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: file input triggered by button below */}
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          Foto de referencia
        </label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full cursor-pointer rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900 p-6 text-center transition hover:border-zinc-500"
        >
          {preview ? (
            <div className="relative mx-auto h-40 w-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded object-contain"
                sizes="100vw"
              />
            </div>
          ) : (
            <div>
              <p className="text-3xl">📷</p>
              <p className="mt-2 text-sm text-zinc-400">
                Click para seleccionar imagen
              </p>
              <p className="text-xs text-zinc-500">JPG, PNG, WEBP</p>
            </div>
          )}
        </button>
        <input
          ref={fileRef}
          name="photo"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div>
        <label
          htmlFor="videoUrl"
          className="mb-1.5 block text-sm font-medium text-zinc-300"
        >
          Video de YouTube{" "}
          <span className="font-normal text-zinc-500">(opcional)</span>
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          defaultValue={defaultValues?.videoUrl ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      {state?.message && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {state.message}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <Link
          href={backHref}
          className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {pending ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

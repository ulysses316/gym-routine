"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createBodyRecord } from "@/actions/body";

interface DefaultValues {
  date?: string;
  weightKg?: number | null;
  heightCm?: number | null;
  bodyFatPct?: number | null;
  muscleMassKg?: number | null;
  waterPct?: number | null;
  boneMassKg?: number | null;
  neck?: number | null;
  shoulders?: number | null;
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  leftArm?: number | null;
  rightArm?: number | null;
  leftThigh?: number | null;
  rightThigh?: number | null;
  leftCalf?: number | null;
  rightCalf?: number | null;
  notes?: string | null;
}

function bmi(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

function bmiCategory(bmiVal: number): { label: string; color: string } {
  if (bmiVal < 18.5) return { label: "Bajo peso", color: "text-blue-400" };
  if (bmiVal < 25) return { label: "Normal", color: "text-green-400" };
  if (bmiVal < 30) return { label: "Sobrepeso", color: "text-yellow-400" };
  return { label: "Obesidad", color: "text-red-400" };
}

function Field({
  label,
  name,
  unit,
  defaultValue,
  min,
  max,
  step = "0.1",
}: {
  label: string;
  name: string;
  unit: string;
  defaultValue?: number | null;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1 block text-xs font-medium text-zinc-400"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          step={step}
          min={min}
          max={max}
          defaultValue={defaultValue ?? ""}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-3 pr-10 text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
          placeholder="—"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
          {unit}
        </span>
      </div>
    </div>
  );
}

export default function BodyForm({ defaults }: { defaults?: DefaultValues }) {
  const [state, action, pending] = useActionState(createBodyRecord, undefined);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [weight, setWeight] = useState(defaults?.weightKg?.toString() ?? "");
  const [height, setHeight] = useState(defaults?.heightCm?.toString() ?? "");

  const today = new Date().toISOString().split("T")[0];
  const bmiVal = weight && height ? bmi(Number(weight), Number(height)) : null;
  const bmiInfo = bmiVal ? bmiCategory(bmiVal) : null;

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link href="/body" className="text-sm text-zinc-400 hover:text-white">
          ← Volver a medidas
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-white">Nueva medición</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Solo rellena los campos que hayas medido hoy.
        </p>
      </div>

      <form action={action} className="space-y-6">
        {/* Fecha */}
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
            defaultValue={defaults?.date ?? today}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Composición corporal */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Composición corporal
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="weightKg"
                className="mb-1 block text-xs font-medium text-zinc-400"
              >
                Peso
              </label>
              <div className="relative">
                <input
                  id="weightKg"
                  name="weightKg"
                  type="number"
                  step="0.1"
                  min="20"
                  max="300"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-3 pr-10 text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                  placeholder="—"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  kg
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="heightCm"
                className="mb-1 block text-xs font-medium text-zinc-400"
              >
                Altura
              </label>
              <div className="relative">
                <input
                  id="heightCm"
                  name="heightCm"
                  type="number"
                  step="0.5"
                  min="100"
                  max="250"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-2 pl-3 pr-10 text-sm text-white placeholder-zinc-600 focus:border-orange-500 focus:outline-none"
                  placeholder="—"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                  cm
                </span>
              </div>
            </div>

            <Field
              label="% Grasa corporal"
              name="bodyFatPct"
              unit="%"
              min="1"
              max="60"
              defaultValue={defaults?.bodyFatPct}
            />
            <Field
              label="Masa muscular"
              name="muscleMassKg"
              unit="kg"
              min="10"
              defaultValue={defaults?.muscleMassKg}
            />
            <Field
              label="% Agua corporal"
              name="waterPct"
              unit="%"
              min="1"
              max="80"
              defaultValue={defaults?.waterPct}
            />
            <Field
              label="Masa ósea"
              name="boneMassKg"
              unit="kg"
              min="0.5"
              max="10"
              defaultValue={defaults?.boneMassKg}
            />
          </div>

          {/* IMC calculado */}
          {bmiVal && bmiInfo && (
            <div className="mt-3 flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5">
              <span className="text-sm text-zinc-400">IMC calculado:</span>
              <span className={`text-sm font-bold ${bmiInfo.color}`}>
                {bmiVal}
              </span>
              <span className={`text-xs ${bmiInfo.color}`}>
                — {bmiInfo.label}
              </span>
            </div>
          )}
        </div>

        {/* Medidas corporales (collapsible) */}
        <div>
          <button
            type="button"
            onClick={() => setShowMeasurements((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-zinc-700 px-4 py-3 text-left text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
          >
            <span>Medidas corporales (cm)</span>
            <span className="text-zinc-500">
              {showMeasurements ? "▲" : "▼"}
            </span>
          </button>

          {showMeasurements && (
            <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <Field
                label="Cuello"
                name="neck"
                unit="cm"
                defaultValue={defaults?.neck}
              />
              <Field
                label="Hombros"
                name="shoulders"
                unit="cm"
                defaultValue={defaults?.shoulders}
              />
              <Field
                label="Pecho"
                name="chest"
                unit="cm"
                defaultValue={defaults?.chest}
              />
              <Field
                label="Cintura"
                name="waist"
                unit="cm"
                defaultValue={defaults?.waist}
              />
              <Field
                label="Cadera"
                name="hips"
                unit="cm"
                defaultValue={defaults?.hips}
              />
              <div className="col-span-2 h-px bg-zinc-800" />
              <Field
                label="Brazo izq."
                name="leftArm"
                unit="cm"
                defaultValue={defaults?.leftArm}
              />
              <Field
                label="Brazo der."
                name="rightArm"
                unit="cm"
                defaultValue={defaults?.rightArm}
              />
              <Field
                label="Muslo izq."
                name="leftThigh"
                unit="cm"
                defaultValue={defaults?.leftThigh}
              />
              <Field
                label="Muslo der."
                name="rightThigh"
                unit="cm"
                defaultValue={defaults?.rightThigh}
              />
              <Field
                label="Pantorrilla izq."
                name="leftCalf"
                unit="cm"
                defaultValue={defaults?.leftCalf}
              />
              <Field
                label="Pantorrilla der."
                name="rightCalf"
                unit="cm"
                defaultValue={defaults?.rightCalf}
              />
            </div>
          )}
        </div>

        {/* Notas */}
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
            defaultValue={defaults?.notes ?? ""}
            className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            placeholder="Cómo te ves, cómo te sientes..."
          />
        </div>

        {state?.message && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {state.message}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <Link
            href="/body"
            className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar medición"}
          </button>
        </div>
      </form>
    </div>
  );
}

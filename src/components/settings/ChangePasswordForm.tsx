"use client";

import { useActionState, useRef } from "react";
import { changePassword } from "@/actions/settings";

export default function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {
    success: false,
  });
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="password" className="mb-1 block text-sm text-zinc-400">
          Nueva contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div>
        <label htmlFor="confirm" className="mb-1 block text-sm text-zinc-400">
          Confirmar contraseña
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          required
          minLength={6}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
          placeholder="Repite la contraseña"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Cambiar contraseña"}
      </button>

      {state.success && !pending && (
        <p className="text-sm text-green-400">Contraseña actualizada</p>
      )}
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
    </form>
  );
}

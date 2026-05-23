import Link from "next/link";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="max-w-xl">
        <div className="mb-6 inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-sm font-medium text-orange-400 ring-1 ring-orange-500/20">
          Registra tu progreso
        </div>
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white">
          Gym Progress
        </h1>
        <p className="mb-10 text-lg text-zinc-400">
          Crea ejercicios, arma tus rutinas y registra cada entrenamiento con
          pesos y repeticiones.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
            >
              Ir al dashboard →
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
              >
                Crear cuenta
              </Link>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              >
                Iniciar sesión
              </Link>
            </>
          )}
          <Link
            href="/exercises"
            className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Ver ejercicios
          </Link>
        </div>
      </div>
    </main>
  );
}

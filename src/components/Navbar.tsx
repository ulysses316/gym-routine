import Link from "next/link";
import { logout } from "@/actions/auth";
import MobileMenu from "@/components/MobileMenu";
import { getSession } from "@/lib/session";

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="relative z-50 border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href={session ? "/dashboard" : "/"}
          className="text-lg font-bold text-orange-400"
        >
          Gym Progress
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-2 text-sm md:flex">
          <Link
            href="/exercises"
            className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
          >
            Ejercicios
          </Link>
          {session ? (
            <>
              <Link
                href="/routines"
                className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
              >
                Rutinas
              </Link>
              <Link
                href="/labels"
                className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
              >
                Labels
              </Link>
              <Link
                href="/logs"
                className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
              >
                Registros
              </Link>
              <Link
                href="/stats"
                className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
              >
                Stats
              </Link>
              <Link
                href="/body"
                className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
              >
                Cuerpo
              </Link>
              <Link
                href="/settings"
                className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
              >
                Config
              </Link>
              <span className="mx-1 text-zinc-600">|</span>
              <span className="text-zinc-400">{session.name}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-red-400"
                >
                  Salir
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-zinc-400 transition hover:text-white"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-orange-500 px-3 py-1.5 font-medium text-white transition hover:bg-orange-600"
              >
                Registro
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <MobileMenu session={session} />
      </div>
    </nav>
  );
}

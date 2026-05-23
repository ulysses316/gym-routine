"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/actions/auth";

interface Props {
  session: { name: string } | null;
}

export default function MobileMenu({ session }: Props) {
  const [open, setOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = hamburgerRef.current;
    if (!btn) return;
    const handler = (e: TouchEvent) => {
      e.preventDefault();
      setOpen((v) => !v);
    };
    btn.addEventListener("touchstart", handler, { passive: false });
    return () => btn.removeEventListener("touchstart", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const btn = overlayRef.current;
    if (!btn) return;
    const handler = (e: TouchEvent) => {
      e.preventDefault();
      setOpen(false);
    };
    btn.addEventListener("touchstart", handler, { passive: false });
    return () => btn.removeEventListener("touchstart", handler);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        ref={hamburgerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú"
        aria-expanded={open}
        className="relative rounded-md p-2 text-zinc-400 transition hover:text-white active:text-white"
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Cerrar menú</title>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Abrir menú</title>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <button
            ref={overlayRef}
            type="button"
            className="fixed inset-0 z-10 cursor-default bg-transparent"
            onClick={close}
            aria-label="Cerrar menú"
            tabIndex={-1}
          />
          <div className="absolute left-0 right-0 z-20 border-b border-zinc-800 bg-zinc-900 px-4 py-3 shadow-xl">
            <nav className="flex flex-col gap-1 text-sm">
              <Link
                href="/exercises"
                onClick={close}
                className="rounded-md px-3 py-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                Ejercicios
              </Link>

              {session ? (
                <>
                  <Link
                    href="/routines"
                    onClick={close}
                    className="rounded-md px-3 py-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Rutinas
                  </Link>
                  <Link
                    href="/labels"
                    onClick={close}
                    className="rounded-md px-3 py-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Labels
                  </Link>
                  <Link
                    href="/logs"
                    onClick={close}
                    className="rounded-md px-3 py-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Registros
                  </Link>
                  <Link
                    href="/stats"
                    onClick={close}
                    className="rounded-md px-3 py-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Stats
                  </Link>
                  <Link
                    href="/body"
                    onClick={close}
                    className="rounded-md px-3 py-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Cuerpo
                  </Link>

                  <div className="my-1 border-t border-zinc-800" />

                  <span className="px-3 py-1 text-xs text-zinc-500">
                    {session.name}
                  </span>
                  <form action={logout}>
                    <button
                      type="submit"
                      className="w-full rounded-md px-3 py-2.5 text-left text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-red-400"
                    >
                      Salir
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <div className="my-1 border-t border-zinc-800" />
                  <Link
                    href="/login"
                    onClick={close}
                    className="rounded-md px-3 py-2.5 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    onClick={close}
                    className="rounded-md bg-orange-500 px-3 py-2.5 font-medium text-white transition hover:bg-orange-600"
                  >
                    Registro
                  </Link>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}

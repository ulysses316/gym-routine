"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
}

export default function ImageLightbox({ src, alt }: Props) {
  const [open, setOpen] = useState(false);
  const expandBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = expandBtnRef.current;
    if (!btn) return;
    const handler = (e: TouchEvent) => {
      e.preventDefault();
      setOpen(true);
    };
    btn.addEventListener("touchstart", handler, { passive: false });
    return () => btn.removeEventListener("touchstart", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <div className="group relative h-64 w-full overflow-hidden bg-zinc-800 sm:h-80">
        {/* biome-ignore lint/performance/noImgElement: natural img needed for cover layout */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition duration-200 group-hover:scale-105 group-hover:brightness-90"
        />
        <button
          ref={expandBtnRef}
          type="button"
          onClick={() => setOpen(true)}
          style={{ touchAction: "manipulation" }}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition active:scale-95"
          aria-label="Ver imagen completa"
        >
          <ExpandIcon />
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          style={{ touchAction: "manipulation" }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{ touchAction: "manipulation" }}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 text-xl text-white transition hover:bg-zinc-700 active:scale-95"
            aria-label="Cerrar"
          >
            ✕
          </button>
          {/* biome-ignore lint/performance/noImgElement: natural img needed for dynamic sizing in modal */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only, not interactive */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90dvh] max-w-[90dvw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

function ExpandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>Expandir imagen</title>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

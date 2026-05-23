"use client";

import { useEffect, useRef } from "react";

interface Props {
  src: string;
  alt: string;
}

export default function ImageLightbox({ src, alt }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.body.style.overflow = "";
    };
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  function openModal() {
    document.body.style.overflow = "hidden";
    dialogRef.current?.showModal();
  }

  function closeModal() {
    dialogRef.current?.close();
  }

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
          type="button"
          onClick={openModal}
          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80 active:scale-95"
          aria-label="Ver imagen completa"
        >
          <ExpandIcon />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="m-0 h-[100dvh] w-[100dvw] max-h-[100dvh] max-w-[100vw] bg-transparent p-0"
        onClick={closeModal}
        onKeyDown={(e) => e.key === "Escape" && closeModal()}
      >
        <div className="flex h-full w-full items-center justify-center p-4">
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800/80 text-xl text-white backdrop-blur-sm transition hover:bg-zinc-700"
            aria-label="Cerrar"
          >
            ✕
          </button>
          {/* biome-ignore lint/performance/noImgElement: natural img needed for dynamic sizing in dialog */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation only, not interactive */}
          <img
            src={src}
            alt={alt}
            className="max-h-[90dvh] max-w-[90dvw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </dialog>
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

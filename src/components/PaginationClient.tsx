"use client";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaginationClient({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-1"
      aria-label="Paginación"
    >
      {currentPage > 1 && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition hover:text-white"
        >
          ← Anterior
        </button>
      )}

      {pages.map((p) =>
        p === "..." ? (
          <span
            key={`dots-${pages.indexOf(p)}`}
            className="px-2 text-sm text-zinc-600"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              p === currentPage
                ? "bg-orange-500 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {currentPage < totalPages && (
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition hover:text-white"
        >
          Siguiente →
        </button>
      )}
    </nav>
  );
}

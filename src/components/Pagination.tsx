import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
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
        <Link
          href={buildHref(currentPage - 1)}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition hover:text-white"
        >
          ← Anterior
        </Link>
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
          <Link
            key={p}
            href={buildHref(p)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              p === currentPage
                ? "bg-orange-500 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="rounded-md px-3 py-1.5 text-sm text-zinc-400 transition hover:text-white"
        >
          Siguiente →
        </Link>
      )}
    </nav>
  );
}

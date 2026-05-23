import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteExercise } from "@/actions/exercises";
import ImageLightbox from "@/components/ImageLightbox";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export default async function ExerciseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [exercise, session] = await Promise.all([
    prisma.exercise.findUnique({
      where: { id },
      include: {
        createdBy: { select: { name: true } },
        labels: { include: { label: true } },
      },
    }),
    getSession(),
  ]);

  if (!exercise) notFound();

  const isOwner = session?.userId === exercise.createdById;
  const embedUrl = exercise.videoUrl
    ? getYouTubeEmbedUrl(exercise.videoUrl)
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/exercises"
        className="text-sm text-zinc-400 hover:text-white"
      >
        ← Volver a ejercicios
      </Link>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        {exercise.photoUrl ? (
          <ImageLightbox src={exercise.photoUrl} alt={exercise.name} />
        ) : (
          <div className="flex h-40 items-center justify-center bg-zinc-800 text-6xl">
            🏋️
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{exercise.name}</h1>
              <p className="mt-1 text-sm text-zinc-400">
                Subido por {exercise.createdBy.name} ·{" "}
                {new Date(exercise.createdAt).toLocaleDateString("es-MX", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <Link
                  href={`/exercises/${id}/edit`}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                >
                  Editar
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteExercise(id);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-400 transition hover:bg-red-500/10"
                  >
                    Eliminar
                  </button>
                </form>
              </div>
            )}
          </div>

          {exercise.labels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {exercise.labels.map(({ label }) => (
                <span
                  key={label.id}
                  className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs text-orange-400"
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}

          {exercise.description && (
            <div className="mt-5">
              <h2 className="mb-2 text-sm font-medium uppercase tracking-wide text-zinc-400">
                Instrucciones
              </h2>
              <p className="whitespace-pre-line text-zinc-300">
                {exercise.description}
              </p>
            </div>
          )}

          {embedUrl && (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-400">
                Video
              </h2>
              <div className="aspect-video w-full overflow-hidden rounded-lg">
                <iframe
                  src={embedUrl}
                  title={`Video: ${exercise.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </div>
          )}

          {exercise.videoUrl && !embedUrl && (
            <div className="mt-5">
              <a
                href={exercise.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300"
              >
                Ver video →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

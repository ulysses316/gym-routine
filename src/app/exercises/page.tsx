import ExerciseList from "@/components/ExerciseList";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function ExercisesPage() {
  const [exercises, allLabels, session] = await Promise.all([
    prisma.exercise.findMany({
      orderBy: { name: "asc" },
      include: {
        createdBy: { select: { name: true } },
        labels: { include: { label: true } },
      },
    }),
    prisma.label.findMany({ orderBy: { name: "asc" } }),
    getSession(),
  ]);

  return (
    <ExerciseList
      exercises={exercises}
      allLabels={allLabels}
      canCreate={!!session}
    />
  );
}

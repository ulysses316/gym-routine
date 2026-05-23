import RoutineForm from "@/components/RoutineForm";
import { prisma } from "@/lib/prisma";

export default async function NewRoutinePage() {
  const [exercises, allLabels] = await Promise.all([
    prisma.exercise.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        labels: { select: { label: { select: { id: true, name: true } } } },
      },
    }),
    prisma.label.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <RoutineForm exercises={exercises} allLabels={allLabels} />;
}

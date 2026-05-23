import RoutineForm from "@/components/RoutineForm";
import { prisma } from "@/lib/prisma";

export default async function NewRoutinePage() {
  const exercises = await prisma.exercise.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return <RoutineForm exercises={exercises} />;
}

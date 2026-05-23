import { Suspense } from "react";
import NewLogForm from "@/components/NewLogForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function NewLogPage() {
  const session = await getSession();
  if (!session) return null;

  const routines = await prisma.routine.findMany({
    where: { userId: session.userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <Suspense>
      <NewLogForm routines={routines} />
    </Suspense>
  );
}

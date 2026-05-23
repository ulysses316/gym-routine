import LabelManager from "@/components/LabelManager";
import { prisma } from "@/lib/prisma";

export default async function LabelsPage() {
  const labels = await prisma.label.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { exercises: true } } },
  });

  return <LabelManager labels={labels} />;
}

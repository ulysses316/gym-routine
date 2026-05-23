import BodyForm from "@/components/body/BodyForm";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export default async function NewBodyRecordPage() {
  const session = await getSession();
  if (!session) return null;

  const last = await prisma.bodyRecord.findFirst({
    where: { userId: session.userId },
    orderBy: { date: "desc" },
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <BodyForm
      defaults={{
        date: today,
        weightKg: last?.weightKg,
        heightCm: last?.heightCm,
        bodyFatPct: last?.bodyFatPct,
        muscleMassKg: last?.muscleMassKg,
        waterPct: last?.waterPct,
        boneMassKg: last?.boneMassKg,
        neck: last?.neck,
        shoulders: last?.shoulders,
        chest: last?.chest,
        waist: last?.waist,
        hips: last?.hips,
        leftArm: last?.leftArm,
        rightArm: last?.rightArm,
        leftThigh: last?.leftThigh,
        rightThigh: last?.rightThigh,
        leftCalf: last?.leftCalf,
        rightCalf: last?.rightCalf,
      }}
    />
  );
}

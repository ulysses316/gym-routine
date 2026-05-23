import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL must be set for seed
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function dateWeeksAgo(weeks: number, dayOffset = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - weeks * 7 - dayOffset);
  d.setHours(7, 30, 0, 0);
  return d;
}

async function main() {
  const user = await prisma.user.findFirstOrThrow({
    select: { id: true, email: true },
  });
  console.log(`Usuario: ${user.email}`);

  await prisma.bodyRecord.deleteMany({ where: { userId: user.id } });

  // 10 semanas de registros semanales, con ligera mejora progresiva
  // Empezamos en 92kg, bajamos ~1.5kg en 10 semanas
  const records = [
    // week 10 ago
    {
      weeks: 10,
      weightKg: 92.0,
      bodyFatPct: 28.5,
      muscleMassKg: 57.2,
      waist: 97,
      chest: 108,
      hips: 106,
      leftArm: 37,
      rightArm: 37.5,
      leftThigh: 58,
      rightThigh: 58.5,
      neck: 40,
      shoulders: 118,
    },
    {
      weeks: 9,
      weightKg: 91.6,
      bodyFatPct: 28.1,
      muscleMassKg: 57.5,
      waist: 96.5,
      chest: 107.5,
      hips: 105.5,
      leftArm: 37.2,
      rightArm: 37.7,
      leftThigh: 57.8,
      rightThigh: 58.3,
      neck: 40,
      shoulders: 118,
    },
    {
      weeks: 8,
      weightKg: 91.2,
      bodyFatPct: 27.8,
      muscleMassKg: 57.8,
      waist: 96,
      chest: 107,
      hips: 105,
      leftArm: 37.4,
      rightArm: 37.9,
      leftThigh: 57.5,
      rightThigh: 58,
      neck: 40.2,
      shoulders: 118.5,
    },
    {
      weeks: 7,
      weightKg: 90.9,
      bodyFatPct: 27.4,
      muscleMassKg: 58.1,
      waist: 95.5,
      chest: 107,
      hips: 105,
      leftArm: 37.5,
      rightArm: 38,
      leftThigh: 57.3,
      rightThigh: 57.8,
      neck: 40.2,
      shoulders: 119,
    },
    {
      weeks: 6,
      weightKg: 90.5,
      bodyFatPct: 27.0,
      muscleMassKg: 58.4,
      waist: 95,
      chest: 106.5,
      hips: 104.5,
      leftArm: 37.7,
      rightArm: 38.2,
      leftThigh: 57,
      rightThigh: 57.5,
      neck: 40.3,
      shoulders: 119,
    },
    {
      weeks: 5,
      weightKg: 90.1,
      bodyFatPct: 26.7,
      muscleMassKg: 58.6,
      waist: 94.5,
      chest: 106,
      hips: 104,
      leftArm: 37.8,
      rightArm: 38.3,
      leftThigh: 56.8,
      rightThigh: 57.3,
      neck: 40.3,
      shoulders: 119.5,
    },
    {
      weeks: 4,
      weightKg: 89.8,
      bodyFatPct: 26.3,
      muscleMassKg: 58.9,
      waist: 94,
      chest: 106,
      hips: 104,
      leftArm: 38,
      rightArm: 38.5,
      leftThigh: 56.5,
      rightThigh: 57,
      neck: 40.5,
      shoulders: 120,
    },
    {
      weeks: 3,
      weightKg: 89.5,
      bodyFatPct: 26.0,
      muscleMassKg: 59.1,
      waist: 93.5,
      chest: 105.5,
      hips: 103.5,
      leftArm: 38.1,
      rightArm: 38.6,
      leftThigh: 56.3,
      rightThigh: 56.8,
      neck: 40.5,
      shoulders: 120,
    },
    {
      weeks: 2,
      weightKg: 89.2,
      bodyFatPct: 25.7,
      muscleMassKg: 59.3,
      waist: 93,
      chest: 105.5,
      hips: 103.5,
      leftArm: 38.2,
      rightArm: 38.7,
      leftThigh: 56,
      rightThigh: 56.5,
      neck: 40.6,
      shoulders: 120.5,
    },
    {
      weeks: 1,
      weightKg: 88.9,
      bodyFatPct: 25.3,
      muscleMassKg: 59.6,
      waist: 92.5,
      chest: 105,
      hips: 103,
      leftArm: 38.4,
      rightArm: 38.9,
      leftThigh: 55.8,
      rightThigh: 56.3,
      neck: 40.6,
      shoulders: 121,
    },
    {
      weeks: 0,
      weightKg: 90.5,
      bodyFatPct: 25.0,
      muscleMassKg: 59.9,
      waist: 92,
      chest: 105,
      hips: 103,
      leftArm: 38.5,
      rightArm: 39,
      leftThigh: 55.5,
      rightThigh: 56,
      neck: 40.7,
      shoulders: 121,
      heightCm: 175,
    },
  ];

  for (const r of records) {
    await prisma.bodyRecord.create({
      data: {
        userId: user.id,
        date: dateWeeksAgo(r.weeks),
        heightCm: r.heightCm ?? null,
        weightKg: r.weightKg,
        bodyFatPct: r.bodyFatPct,
        muscleMassKg: r.muscleMassKg,
        waist: r.waist,
        chest: r.chest,
        hips: r.hips,
        leftArm: r.leftArm,
        rightArm: r.rightArm,
        leftThigh: r.leftThigh,
        rightThigh: r.rightThigh,
        neck: r.neck,
        shoulders: r.shoulders,
      },
    });
  }

  console.log(`✓ ${records.length} registros corporales creados.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

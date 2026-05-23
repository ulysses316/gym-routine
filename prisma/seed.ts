import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL must be set for seed
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const muscles = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Bíceps",
  "Tríceps",
  "Antebrazos",
  "Abdomen",
  "Oblicuos",
  "Lumbares",
  "Trapecio",
  "Serrato",
  "Cuádriceps",
  "Isquiotibiales",
  "Glúteos",
  "Pantorrillas",
  "Aductores",
  "Abductores",
  "Flexores de cadera",
];

async function main() {
  for (const name of muscles) {
    await prisma.label.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log(`✓ ${muscles.length} labels insertados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

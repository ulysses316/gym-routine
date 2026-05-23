import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL must be set for seed
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Exercise IDs from the database
const EX = {
  // Cardio / caminatas
  caminataRapida: "cmpi1a5uv00007ork3dviu0js",
  caminataInclinada: "cmpi1a5wi000k7ork2pw5buba",
  caminataLigera: "cmpi1a5vh00067orkldfexlyd",
  caminataORemSuave: "cmpi1a5vp00097orkgu30ecty",
  caminataAireLibre: "cmpi1a5wl000l7ork84qak155",
  caminataSuave: "cmpi1a5wn000m7orkqvrvsddk",
  bicicletaEstatica: "cmpi1a5v200017orkfhjkw6pa",
  // Movilidad
  movilidadHombrosYBrazos: "cmpi1a5v600027ork49szfu4s",
  rotacionesCuello: "cmpi1a5v900037orki6srp5om",
  movilidadCaderaRodTob: "cmpi1a5vc00047ork1nhwwusp",
  movilidadTorsoYCadera: "cmpi1a5ve00057ork68swc6yf",
  movilidadArticular: "cmpi1a5vk00077orko49q4kj3",
  movilidadGeneral: "cmpi1a5vm00087ork56w4h73l",
  movilidadCadera: "cmpi0vj64000fp6rkz2r8mr42",
  movilidadToracica: "cmpi0vj66000gp6rkg7yhbq52",
  movilidadHombros: "cmpi0vj6b000ip6rk4mcspnpo",
  movilidadEspalda: "cmpi1a5w1000e7orkl4an0n6k",
  movilidadLigera: "cmpi1a5wp000n7ork0s8jjz3x",
  // Estiramientos
  estiramientoPechoHombros: "cmpi1a5vr000a7orkp9bsekrt",
  estiramientoEspalda: "cmpi1a5vu000b7ork9a5x9zsl",
  estiramientoPiernasGlut: "cmpi1a5vw000c7orknrxdpqzz",
  estiramientoLumbarAbd: "cmpi1a5vz000d7orkzi28q0tx",
  estiramientoDinamicoP: "cmpi0vj68000hp6rkce021v85",
  estiramientosGenerales: "cmpi1a5w4000f7orkjz51vgjv",
  estiramientoSuaveCuerpo: "cmpi1a5w8000g7orkrojy3g0z",
  estiramientosSuaves: "cmpi1a5wt000o7orknkj4ktm4",
  // Respiración
  respiracionProfunda: "cmpi1a5wa000h7ork4xcb9jgv",
  respiracionRelajacion: "cmpi1a5wd000i7orkcuc5wk9h",
  respiracionDiafragmatica: "cmpi1a5wg000j7ork3itm5zgq",
  // Tren superior
  pressPecho: "cmphuy1xc0001ulrkyxde3btb",
  remoJalon: "cmphvat4b00007srk2rbbaxsb",
  pressHombros: "cmphya2kx00017srk363anbhy",
  elevacionesLaterales: "cmphyadli00027srkb29n2xew",
  curlBiceps: "cmphyanr100037srk3slf0q6y",
  jalonTriceps: "cmphyayan00047srk36bi2ym1",
  // Tren inferior
  sentadillaGoblet: "cmpi0vj4x0000p6rkyn4rzlbm",
  prensaPiernas: "cmpi0vj530001p6rkmbvil04d",
  pesoMuertoRumano: "cmpi0vj560002p6rk5azu6sy1",
  zancadas: "cmpi0vj590003p6rkk8qd72fs",
  curlFemoral: "cmpi0vj5c0004p6rkddg9452u",
  elevPantorrillas: "cmpi0vj5f0005p6rkckv92bio",
  // Core
  planchaFrontal: "cmpi0vj5h0006p6rkb2zcmna5",
  planchaLateral: "cmpi0vj5k0007p6rk39l42gor",
  crunch: "cmpi0vj5n0008p6rkpw2ncd2c",
  elevPiernas: "cmpi0vj5p0009p6rkmpuwxepl",
  birdDog: "cmpi0vj5r000ap6rkavew2rwt",
  // Cuerpo completo
  pressPechoCC: "cmpi0vj5u000bp6rk3vlwvthx",
  remoSentadoCC: "cmpi0vj5w000cp6rkrmd4e4tb",
  pressHombroCC: "cmpi0vj5y000dp6rkatof20ai",
  farmerWalk: "cmpi0vj61000ep6rkshcdmfeb",
};

const routines: { name: string; exercises: string[] }[] = [
  {
    name: "Día 1 — Fuerza: Tren Superior",
    exercises: [
      EX.caminataRapida,
      EX.movilidadHombrosYBrazos,
      EX.rotacionesCuello,
      EX.pressPecho,
      EX.remoJalon,
      EX.pressHombros,
      EX.elevacionesLaterales,
      EX.curlBiceps,
      EX.jalonTriceps,
      EX.estiramientoPechoHombros,
      EX.estiramientoEspalda,
      EX.respiracionProfunda,
    ],
  },
  {
    name: "Día 2 — Fuerza: Tren Inferior",
    exercises: [
      EX.bicicletaEstatica,
      EX.movilidadCaderaRodTob,
      EX.sentadillaGoblet,
      EX.prensaPiernas,
      EX.pesoMuertoRumano,
      EX.zancadas,
      EX.curlFemoral,
      EX.elevPantorrillas,
      EX.estiramientoPiernasGlut,
      EX.movilidadCadera,
    ],
  },
  {
    name: "Día 3 — Cardio + Core",
    exercises: [
      EX.caminataRapida,
      EX.movilidadTorsoYCadera,
      EX.caminataInclinada,
      EX.planchaFrontal,
      EX.planchaLateral,
      EX.crunch,
      EX.elevPiernas,
      EX.birdDog,
      EX.estiramientoLumbarAbd,
      EX.movilidadEspalda,
    ],
  },
  {
    name: "Día 4 — Fuerza: Cuerpo Completo",
    exercises: [
      EX.caminataORemSuave,
      EX.movilidadGeneral,
      EX.prensaPiernas,
      EX.pressPechoCC,
      EX.remoSentadoCC,
      EX.pressHombroCC,
      EX.pesoMuertoRumano,
      EX.farmerWalk,
      EX.estiramientosGenerales,
      EX.respiracionRelajacion,
    ],
  },
  {
    name: "Día 5 — Cardio + Movilidad",
    exercises: [
      EX.caminataLigera,
      EX.movilidadArticular,
      EX.caminataInclinada,
      EX.movilidadCadera,
      EX.movilidadToracica,
      EX.estiramientoDinamicoP,
      EX.movilidadHombros,
      EX.respiracionDiafragmatica,
      EX.estiramientoSuaveCuerpo,
    ],
  },
  {
    name: "Día 6 — Descanso Activo",
    exercises: [EX.caminataAireLibre, EX.movilidadLigera],
  },
  {
    name: "Día 7 — Descanso Activo",
    exercises: [EX.caminataSuave, EX.estiramientosSuaves],
  },
];

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No hay ningún usuario en la base de datos.");
    process.exit(1);
  }

  const existing = await prisma.routine.findMany({
    where: { userId: user.id },
    select: { name: true },
  });
  const existingNames = new Set(existing.map((r) => r.name));

  let created = 0;
  let skipped = 0;

  for (const r of routines) {
    if (existingNames.has(r.name)) {
      console.log(`⏭  Omitida (ya existe): ${r.name}`);
      skipped++;
      continue;
    }

    await prisma.routine.create({
      data: {
        name: r.name,
        userId: user.id,
        exercises: {
          create: r.exercises.map((exerciseId, order) => ({
            exerciseId,
            order,
          })),
        },
      },
    });

    console.log(`✓ Creada: ${r.name} (${r.exercises.length} ejercicios)`);
    created++;
  }

  console.log(`\n✅ ${created} rutinas creadas, ${skipped} omitidas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

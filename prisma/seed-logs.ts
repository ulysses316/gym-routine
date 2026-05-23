import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL must be set for seed
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(8 + Math.floor(Math.random() * 4), 0, 0, 0);
  return d;
}

// Peso inicial y progresión por ejercicio (kg)
const exerciseConfig: Record<
  string,
  { startWeight: number; weeklyGain: number; reps: number; sets: number }
> = {
  // Tren superior
  cmphuy1xc0001ulrkyxde3btb: {
    startWeight: 30,
    weeklyGain: 1.25,
    reps: 12,
    sets: 3,
  }, // pressPecho
  cmphvat4b00007srk2rbbaxsb: {
    startWeight: 35,
    weeklyGain: 1.25,
    reps: 12,
    sets: 3,
  }, // remoJalon
  cmphya2kx00017srk363anbhy: {
    startWeight: 25,
    weeklyGain: 1.0,
    reps: 10,
    sets: 3,
  }, // pressHombros
  cmphyadli00027srkb29n2xew: {
    startWeight: 6,
    weeklyGain: 0.5,
    reps: 15,
    sets: 3,
  }, // elevacionesLaterales
  cmphyanr100037srk3slf0q6y: {
    startWeight: 10,
    weeklyGain: 0.5,
    reps: 12,
    sets: 3,
  }, // curlBiceps
  cmphyayan00047srk36bi2ym1: {
    startWeight: 12,
    weeklyGain: 0.5,
    reps: 12,
    sets: 3,
  }, // jalonTriceps
  // Tren inferior
  cmpi0vj4x0000p6rkyn4rzlbm: {
    startWeight: 16,
    weeklyGain: 1.0,
    reps: 15,
    sets: 3,
  }, // sentadillaGoblet
  cmpi0vj530001p6rkmbvil04d: {
    startWeight: 60,
    weeklyGain: 2.5,
    reps: 12,
    sets: 3,
  }, // prensaPiernas
  cmpi0vj560002p6rk5azu6sy1: {
    startWeight: 30,
    weeklyGain: 2.5,
    reps: 10,
    sets: 3,
  }, // pesoMuertoRumano
  cmpi0vj590003p6rkk8qd72fs: {
    startWeight: 8,
    weeklyGain: 0.5,
    reps: 12,
    sets: 3,
  }, // zancadas (kg mancuerna)
  cmpi0vj5c0004p6rkddg9452u: {
    startWeight: 25,
    weeklyGain: 1.0,
    reps: 12,
    sets: 3,
  }, // curlFemoral
  cmpi0vj5f0005p6rkckv92bio: {
    startWeight: 30,
    weeklyGain: 1.25,
    reps: 20,
    sets: 3,
  }, // elevPantorrillas
  // Core (peso corporal = 0, reps son repeticiones o segundos)
  cmpi0vj5h0006p6rkb2zcmna5: {
    startWeight: 0,
    weeklyGain: 0,
    reps: 30,
    sets: 3,
  }, // planchaFrontal (seg)
  cmpi0vj5k0007p6rk39l42gor: {
    startWeight: 0,
    weeklyGain: 0,
    reps: 20,
    sets: 3,
  }, // planchaLateral
  cmpi0vj5n0008p6rkpw2ncd2c: {
    startWeight: 0,
    weeklyGain: 0,
    reps: 20,
    sets: 3,
  }, // crunch
  cmpi0vj5p0009p6rkmpuwxepl: {
    startWeight: 0,
    weeklyGain: 0,
    reps: 15,
    sets: 3,
  }, // elevPiernas
  cmpi0vj5r000ap6rkavew2rwt: {
    startWeight: 0,
    weeklyGain: 0,
    reps: 10,
    sets: 3,
  }, // birdDog
  // Cuerpo completo
  cmpi0vj5u000bp6rk3vlwvthx: {
    startWeight: 30,
    weeklyGain: 1.25,
    reps: 12,
    sets: 3,
  }, // pressPechoCC
  cmpi0vj5w000cp6rkrmd4e4tb: {
    startWeight: 30,
    weeklyGain: 1.25,
    reps: 12,
    sets: 3,
  }, // remoSentadoCC
  cmpi0vj5y000dp6rkatof20ai: {
    startWeight: 20,
    weeklyGain: 1.0,
    reps: 10,
    sets: 3,
  }, // pressHombroCC
  cmpi0vj61000ep6rkshcdmfeb: {
    startWeight: 16,
    weeklyGain: 0.5,
    reps: 20,
    sets: 2,
  }, // farmerWalk (distancia ~20m)
};

// Ejercicios de calentamiento/cardio/estiramiento — 1 serie, 0 kg
const warmupExercises = new Set([
  "cmpi1a5uv00007ork3dviu0js", // caminataRapida
  "cmpi1a5wi000k7ork2pw5buba", // caminataInclinada
  "cmpi1a5vh00067orkldfexlyd", // caminataLigera
  "cmpi1a5vp00097orkgu30ecty", // caminataORemSuave
  "cmpi1a5wl000l7ork84qak155", // caminataAireLibre
  "cmpi1a5wn000m7orkqvrvsddk", // caminataSuave
  "cmpi1a5v200017orkfhjkw6pa", // bicicletaEstatica
  "cmpi1a5v600027ork49szfu4s", // movilidadHombrosYBrazos
  "cmpi1a5v900037orki6srp5om", // rotacionesCuello
  "cmpi1a5vc00047ork1nhwwusp", // movilidadCaderaRodTob
  "cmpi1a5ve00057ork68swc6yf", // movilidadTorsoYCadera
  "cmpi1a5vk00077orko49q4kj3", // movilidadArticular
  "cmpi1a5vm00087ork56w4h73l", // movilidadGeneral
  "cmpi0vj64000fp6rkz2r8mr42", // movilidadCadera
  "cmpi0vj66000gp6rkg7yhbq52", // movilidadToracica
  "cmpi0vj6b000ip6rk4mcspnpo", // movilidadHombros
  "cmpi1a5w1000e7orkl4an0n6k", // movilidadEspalda
  "cmpi1a5wp000n7ork0s8jjz3x", // movilidadLigera
  "cmpi1a5vr000a7orkp9bsekrt", // estiramientoPechoHombros
  "cmpi1a5vu000b7ork9a5x9zsl", // estiramientoEspalda
  "cmpi1a5vw000c7orknrxdpqzz", // estiramientoPiernasGlut
  "cmpi1a5vz000d7orkzi28q0tx", // estiramientoLumbarAbd
  "cmpi0vj68000hp6rkce021v85", // estiramientoDinamicoP
  "cmpi1a5w4000f7orkjz51vgjv", // estiramientosGenerales
  "cmpi1a5w8000g7orkrojy3g0z", // estiramientoSuaveCuerpo
  "cmpi1a5wt000o7orknkj4ktm4", // estiramientosSuaves
  "cmpi1a5wa000h7ork4xcb9jgv", // respiracionProfunda
  "cmpi1a5wd000i7orkcuc5wk9h", // respiracionRelajacion
  "cmpi1a5wg000j7ork3itm5zgq", // respiracionDiafragmatica
]);

async function main() {
  const user = await prisma.user.findFirstOrThrow({
    select: { id: true, email: true },
  });
  console.log(`Usando usuario: ${user.email} (${user.id})`);

  const routines = await prisma.routine.findMany({
    include: { exercises: { orderBy: { order: "asc" } } },
    where: { userId: user.id },
  });
  console.log(`Rutinas encontradas: ${routines.length}`);

  // Eliminar logs previos del seed para evitar duplicados
  const deleted = await prisma.workoutLog.deleteMany({
    where: { userId: user.id },
  });
  console.log(`Logs anteriores eliminados: ${deleted.count}`);

  // Calendario de entrenos: 10 semanas atrás, ~4 días por semana
  // Patrón: L-M-J-S (días 1,2,3,4 de cada semana)
  const schedule: { daysAgo: number; routineIndex: number }[] = [];
  const routineOrder = [0, 1, 2, 3, 4, 5, 6]; // 7 rutinas en ciclo
  let routineCursor = 0;

  for (let week = 9; week >= 0; week--) {
    // 4 entrenamientos por semana, con alguna semana de 3
    const sessionsThisWeek = week === 4 || week === 7 ? 3 : 4;
    const dayOffsets = [1, 2, 4, 6]; // L, M, J, S dentro de la semana
    for (let s = 0; s < sessionsThisWeek; s++) {
      schedule.push({
        daysAgo: week * 7 + dayOffsets[s],
        routineIndex: routineOrder[routineCursor % routineOrder.length],
      });
      routineCursor++;
    }
  }

  console.log(`Creando ${schedule.length} entrenamientos...`);

  for (const entry of schedule) {
    const routine = routines[entry.routineIndex];
    if (!routine) continue;

    const weekNumber = Math.floor(entry.daysAgo / 7);
    const date = daysAgo(entry.daysAgo);

    const log = await prisma.workoutLog.create({
      data: {
        userId: user.id,
        routineId: routine.id,
        date,
      },
    });

    const setsData: {
      workoutLogId: string;
      exerciseId: string;
      setNumber: number;
      reps: number;
      weightKg: number;
    }[] = [];

    for (const re of routine.exercises) {
      const exId = re.exerciseId;

      if (warmupExercises.has(exId)) {
        // Calentamiento: 1 serie simbólica
        setsData.push({
          workoutLogId: log.id,
          exerciseId: exId,
          setNumber: 1,
          reps: 1,
          weightKg: 0,
        });
        continue;
      }

      const cfg = exerciseConfig[exId];
      if (!cfg) continue;

      const weeksOfProgress = 9 - weekNumber;
      const baseWeight = cfg.startWeight + weeksOfProgress * cfg.weeklyGain;

      for (let s = 1; s <= cfg.sets; s++) {
        // Variación pequeña por serie (±5%) y ruido aleatorio mínimo
        const variance = 1 + (s === 3 ? -0.05 : s === 1 ? 0.0 : 0.025);
        const weight = Math.round(baseWeight * variance * 4) / 4; // redondea a 0.25
        setsData.push({
          workoutLogId: log.id,
          exerciseId: exId,
          setNumber: s,
          reps: cfg.reps + (s === 3 ? -1 : 0),
          weightKg: Math.max(0, weight),
        });
      }
    }

    await prisma.workoutSet.createMany({ data: setsData });
  }

  console.log("✓ Logs de entrenamiento creados.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL must be set for seed
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const exercises: {
  name: string;
  description: string;
  labels: string[];
}[] = [
  // ── DÍA 2: TREN INFERIOR ──
  {
    name: "Sentadilla goblet",
    description:
      "Sostén una mancuerna verticalmente frente al pecho con ambas manos. Separa los pies al ancho de los hombros, baja flexionando rodillas y cadera hasta que los muslos queden paralelos al suelo, mantén el pecho erguido y el core activo. Sube empujando con los talones.",
    labels: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
  },
  {
    name: "Prensa de piernas",
    description:
      "Siéntate en la máquina de prensa con la espalda y glúteos apoyados en el respaldo. Coloca los pies al ancho de los hombros sobre la plataforma. Suelta los seguros, baja la plataforma flexionando las rodillas hasta ~90° y empuja hasta extender sin bloquear las rodillas.",
    labels: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
  },
  {
    name: "Peso muerto rumano",
    description:
      "De pie con los pies al ancho de la cadera y barra o mancuernas frente a los muslos. Manteniendo la espalda recta y las rodillas levemente flexionadas, inclina el tronco hacia adelante empujando la cadera hacia atrás hasta sentir estiramiento en los isquiotibiales; luego regresa a la posición inicial contrayendo glúteos.",
    labels: ["Isquiotibiales", "Glúteos", "Lumbares"],
  },
  {
    name: "Zancadas asistidas",
    description:
      "Da un paso largo hacia adelante bajando la rodilla trasera hacia el suelo sin tocar; la rodilla delantera no debe sobrepasar la punta del pie. Usa una barra fija o pared de apoyo si necesitas equilibrio. Alterna piernas por el número de repeticiones indicado por lado.",
    labels: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
  },
  {
    name: "Curl femoral",
    description:
      "En la máquina de curl femoral tumbado boca abajo, coloca el rodillo justo por encima de los talones. Flexiona las rodillas llevando los talones hacia los glúteos de forma controlada y baja lentamente. Mantén las caderas pegadas al banco durante todo el movimiento.",
    labels: ["Isquiotibiales"],
  },
  {
    name: "Elevación de pantorrillas",
    description:
      "De pie con la punta de los pies en un escalón o plataforma elevada y los talones en el aire. Sube lo máximo posible sobre la punta de los pies contrayendo las pantorrillas, mantén un segundo arriba y baja lentamente hasta sentir estiramiento. Puedes hacerlo con peso o con el propio cuerpo.",
    labels: ["Pantorrillas"],
  },
  // ── DÍA 3: CORE ──
  {
    name: "Plancha frontal",
    description:
      "Apoya los antebrazos y las puntas de los pies en el suelo, manteniendo el cuerpo en línea recta de cabeza a talones. Contrae el abdomen, glúteos y cuádriceps; evita que la cadera suba o caiga. Aguanta el tiempo indicado respirando de forma continua.",
    labels: ["Abdomen", "Lumbares", "Hombros"],
  },
  {
    name: "Plancha lateral",
    description:
      "Apoya un antebrazo en el suelo con el codo bajo el hombro y los pies apilados o en escalón. Eleva la cadera hasta que el cuerpo forme una línea diagonal. Contrae el oblicuo del lado que trabaja y el core completo. Mantén el tiempo indicado por cada lado.",
    labels: ["Oblicuos", "Abdomen"],
  },
  {
    name: "Crunch abdominal",
    description:
      "Tumbado boca arriba con rodillas flexionadas y pies apoyados, coloca las manos detrás de la cabeza o cruzadas en el pecho. Eleva el tronco contrayendo el abdomen —sin jalar del cuello— hasta despegar los omóplatos del suelo. Baja lentamente sin apoyar del todo la cabeza entre repeticiones.",
    labels: ["Abdomen"],
  },
  {
    name: "Elevación de piernas",
    description:
      "Tumbado boca arriba con las manos bajo los glúteos o agarrado a un banco. Con las rodillas ligeramente flexionadas, eleva las piernas hasta que formen 90° con el suelo contrayendo el abdomen bajo, y baja de forma controlada sin que toquen el suelo.",
    labels: ["Abdomen", "Flexores de cadera"],
  },
  {
    name: "Bird Dog",
    description:
      "En posición de cuadrupedia con las muñecas bajo los hombros y las rodillas bajo la cadera. Extiende simultáneamente el brazo derecho al frente y la pierna izquierda atrás, manteniendo la espalda neutral. Aguanta 2 seg, regresa al centro y alterna lados.",
    labels: ["Lumbares", "Abdomen", "Glúteos"],
  },
  // ── DÍA 4: CUERPO COMPLETO ──
  {
    name: "Press de pecho",
    description:
      "Tumbado en el banco con los pies apoyados en el suelo, agarra la barra o mancuernas al ancho de los hombros. Baja el peso de forma controlada hasta rozar el pecho y empuja hasta la extensión completa sin bloquear los codos. Mantén los omóplatos retraídos y el core activo.",
    labels: ["Pecho", "Tríceps", "Hombros"],
  },
  {
    name: "Remo sentado",
    description:
      "Sentado frente al cable con los pies apoyados y rodillas ligeramente flexionadas, tira del agarre hacia el abdomen retrayendo los omóplatos al final del movimiento. Extiende los brazos de forma controlada para el retorno. Mantén el torso erguido durante todo el recorrido.",
    labels: ["Espalda", "Bíceps"],
  },
  {
    name: "Press de hombro sentado",
    description:
      "Sentado en un banco con respaldo o silla, sostén las mancuernas o barra al nivel de los hombros con los codos a 90°. Empuja verticalmente hasta casi extender los brazos sobre la cabeza y baja lentamente hasta la posición inicial. Mantén la espalda baja pegada al respaldo.",
    labels: ["Hombros", "Tríceps"],
  },
  {
    name: "Farmer walk",
    description:
      "Toma una mancuerna pesada en cada mano (o un objeto de agarre firme), mantén los hombros hacia atrás, el pecho erguido y el core contraído. Camina a pasos cortos y controlados la distancia o el tiempo indicados. Es un ejercicio de carga funcional que trabaja el agarre y la postura.",
    labels: ["Antebrazos", "Trapecio", "Abdomen", "Lumbares"],
  },
  // ── DÍA 5: MOVILIDAD ──
  {
    name: "Movilidad de cadera",
    description:
      "Realiza círculos amplios con la cadera en posición de pie o en cuadrupedia, o ejecuta aperturas laterales de rodilla (clamshell) y rotaciones internas/externas. Mueve cada articulación de forma suave por todo su rango de movimiento disponible.",
    labels: ["Flexores de cadera", "Glúteos", "Aductores"],
  },
  {
    name: "Movilidad torácica",
    description:
      "En cuadrupedia o sentado, rota el tronco suavemente llevando el codo hacia el techo (open book) o hacia el suelo. También puedes apoyar la espalda en un foam roller bajo la zona torácica y extenderte sobre él segmento por segmento.",
    labels: ["Espalda", "Hombros"],
  },
  {
    name: "Estiramiento dinámico de piernas",
    description:
      "Realiza balanceos frontales y laterales de pierna, círculos de rodilla y elevaciones de rodilla al pecho de forma fluida y continua, sin rebotes bruscos. Aumenta gradualmente el rango de movimiento para preparar la articulación para el entrenamiento.",
    labels: ["Cuádriceps", "Isquiotibiales", "Flexores de cadera"],
  },
  {
    name: "Movilidad de hombros",
    description:
      "Efectúa círculos amplios hacia adelante y atrás con los brazos extendidos, balanceos pendulares y rotaciones internas/externas con banda o sin carga. Presta atención a mantener el cuello relajado durante el movimiento.",
    labels: ["Hombros", "Trapecio"],
  },
];

async function main() {
  const allLabels = await prisma.label.findMany();
  const labelMap = new Map(allLabels.map((l) => [l.name, l.id]));

  const allExercises = await prisma.exercise.findMany({
    select: { name: true },
  });
  const existing = new Set(allExercises.map((e) => e.name.toLowerCase()));

  // Need a user to own exercises — get the first user
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error(
      "No hay ningún usuario en la base de datos. Crea uno primero.",
    );
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const ex of exercises) {
    if (existing.has(ex.name.toLowerCase())) {
      console.log(`⏭  Omitido (ya existe): ${ex.name}`);
      skipped++;
      continue;
    }

    const labelIds = ex.labels
      .map((l) => labelMap.get(l))
      .filter((id): id is string => id !== undefined);

    await prisma.exercise.create({
      data: {
        name: ex.name,
        description: ex.description,
        createdById: user.id,
        labels: {
          create: labelIds.map((labelId) => ({ labelId })),
        },
      },
    });

    console.log(`✓ Creado: ${ex.name} [${ex.labels.join(", ")}]`);
    created++;
  }

  console.log(`\n✅ ${created} ejercicios creados, ${skipped} omitidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

// biome-ignore lint/style/noNonNullAssertion: DATABASE_URL must be set for seed
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const exercises: { name: string; description: string; labels: string[] }[] = [
  // ── CALENTAMIENTO ──────────────────────────────────────────────────────────
  {
    name: "Caminata rápida",
    description:
      "Camina a paso ligero (60–70% de tu ritmo máximo) durante el tiempo indicado. Mantén una postura erguida, los brazos en movimiento y una zancada cómoda. Ideal para elevar la temperatura corporal y activar el sistema cardiovascular antes del entrenamiento.",
    labels: ["Cuádriceps", "Pantorrillas", "Isquiotibiales"],
  },
  {
    name: "Bicicleta estática",
    description:
      "Pedalea a cadencia moderada (60–80 rpm) y resistencia baja durante el tiempo indicado. Ajusta el sillín para que la rodilla quede ligeramente flexionada en la extensión máxima. Enfócate en un pedaleo suave y circular para calentar las articulaciones de cadera, rodilla y tobillo.",
    labels: ["Cuádriceps", "Pantorrillas", "Isquiotibiales", "Glúteos"],
  },
  {
    name: "Movilidad de hombros y brazos",
    description:
      "Realiza círculos amplios con los brazos extendidos hacia adelante y hacia atrás, seguidos de balanceos cruzados frente al pecho y rotaciones de muñeca. Ejecuta cada movimiento de forma lenta y progresiva, aumentando el rango conforme el tejido se calienta.",
    labels: ["Hombros"],
  },
  {
    name: "Rotaciones de cuello y espalda",
    description:
      "Inclina suavemente la cabeza de lado a lado y realiza semicírculos hacia los hombros; evita las rotaciones completas de cuello. Complementa con rotaciones del torso sentado o de pie, llevando los hombros de forma alternada hacia adelante y atrás para movilizar la columna torácica.",
    labels: ["Espalda", "Lumbares"],
  },
  {
    name: "Movilidad de cadera, rodillas y tobillos",
    description:
      "Ejecuta círculos de cadera, elevaciones de rodilla al pecho, rotaciones internas y externas de rodilla en cuadrupedia y círculos de tobillo. Trabaja cada articulación de forma individual y progresiva para preparar el tren inferior para el entrenamiento de fuerza.",
    labels: ["Flexores de cadera", "Cuádriceps", "Pantorrillas"],
  },
  {
    name: "Movilidad de torso y cadera",
    description:
      "Combina rotaciones del torso de pie o sentado con balanceos laterales de cadera y apertura de rodillas en posición de sentadilla profunda (squat hold). Mantén cada posición 2–3 segundos para ganar rango de movimiento de forma activa.",
    labels: ["Espalda", "Flexores de cadera", "Oblicuos"],
  },
  {
    name: "Caminata ligera",
    description:
      "Camina a un ritmo tranquilo (40–50% de tu frecuencia cardíaca máxima). El objetivo es activar suavemente el sistema cardiovascular y lubricar las articulaciones sin generar fatiga antes del entrenamiento. Mantén una postura natural y respiración relajada.",
    labels: ["Cuádriceps", "Pantorrillas"],
  },
  {
    name: "Movilidad articular",
    description:
      "Recorre de forma secuencial todas las articulaciones principales: tobillos, rodillas, caderas, columna, hombros, codos y muñecas, realizando 8–10 círculos o rotaciones en cada una. Ideal como calentamiento general antes de cualquier tipo de entrenamiento.",
    labels: ["Hombros", "Flexores de cadera", "Cuádriceps"],
  },
  {
    name: "Movilidad general",
    description:
      "Secuencia breve que combina sentadillas de peso corporal lentas, apertura de caderas, rotaciones de hombros y extensiones de columna. El propósito es preparar el cuerpo completo para el trabajo de fuerza con un único calentamiento integrado.",
    labels: ["Cuádriceps", "Glúteos", "Espalda", "Hombros"],
  },
  {
    name: "Caminata o remo suave",
    description:
      "Camina a paso moderado durante 5 minutos o utiliza la máquina de remo a resistencia mínima. Si eliges el remo, prioriza la técnica: empuja con las piernas primero, luego inclina el torso hacia atrás y finalmente jala los brazos. Mantén la espalda recta en todo momento.",
    labels: ["Espalda", "Cuádriceps", "Pantorrillas"],
  },

  // ── FINAL / VUELTA A LA CALMA ──────────────────────────────────────────────
  {
    name: "Estiramiento de pecho y hombros",
    description:
      "Entrelaza las manos detrás de la espalda, abre el pecho y eleva los brazos suavemente mientras llevas los hombros hacia atrás y abajo. También puedes apoyar el antebrazo en una pared y rotar el tronco hacia el lado contrario para un estiramiento más profundo del pectoral.",
    labels: ["Pecho", "Hombros"],
  },
  {
    name: "Estiramiento de espalda",
    description:
      "Abraza las rodillas al pecho tumbado boca arriba para estirar la zona lumbar; luego lleva los brazos al frente en cuadrupedia (postura del niño extendida) para estirar la espalda alta y el dorsal. Mantén cada posición 30–60 segundos respirando profundamente.",
    labels: ["Espalda", "Lumbares"],
  },
  {
    name: "Estiramiento de piernas y glúteos",
    description:
      "Tumbado boca arriba, lleva una rodilla al pecho y mantenla 30 seg para estirar los flexores; luego cruza el tobillo sobre la rodilla opuesta (figura 4) para el glúteo. En posición de pie puedes hacer la estocada baja para los cuádriceps y el estiramiento de isquiotibiales con pierna extendida.",
    labels: ["Cuádriceps", "Isquiotibiales", "Glúteos", "Flexores de cadera"],
  },
  {
    name: "Estiramiento lumbar y abdomen",
    description:
      "Tumbado boca abajo, apoya las manos bajo los hombros y extiende suavemente los codos para arquear la columna (cobra). Luego pasa a tumbado boca arriba y abraza las rodillas al pecho balanceándote suavemente para movilizar la lumbar. Alterna ambas posturas durante el tiempo indicado.",
    labels: ["Lumbares", "Abdomen"],
  },
  {
    name: "Movilidad de espalda",
    description:
      "Realiza el gato-vaca (cat-cow) en cuadrupedia: arquea y redondea la columna de forma alternada siguiendo el ritmo de la respiración. Complementa con rotaciones del torso sentado y extensiones torácicas sobre foam roller si está disponible.",
    labels: ["Espalda", "Lumbares"],
  },
  {
    name: "Estiramientos generales",
    description:
      "Secuencia de estiramientos estáticos de cuerpo completo: cuádriceps en pie, isquiotibiales sentado, glúteo (figura 4), pectoral en pared, tríceps sobre la cabeza y cuello lateral. Mantén cada posición 20–30 segundos sin rebotar y con respiración pausada.",
    labels: ["Cuádriceps", "Isquiotibiales", "Glúteos", "Pecho", "Hombros"],
  },
  {
    name: "Estiramiento suave cuerpo completo",
    description:
      "Recorre el cuerpo de abajo hacia arriba con estiramientos suaves y sostenidos: pies, pantorrillas, isquiotibiales, cadera, columna, hombros y cuello. Dedica 15–20 segundos a cada zona. El objetivo es bajar la frecuencia cardíaca y reducir la tensión muscular acumulada.",
    labels: [
      "Cuádriceps",
      "Isquiotibiales",
      "Glúteos",
      "Espalda",
      "Hombros",
      "Pantorrillas",
    ],
  },
  {
    name: "Respiración profunda y movilidad suave",
    description:
      "Inhala por la nariz en 4 tiempos, retén 2 y exhala por la boca en 6. Combina cada ciclo con movimientos lentos de brazos (elevación en la inhalación, descenso en la exhalación) o rotaciones suaves del torso. Ideal para activar el sistema nervioso parasimpático y acelerar la recuperación.",
    labels: ["Abdomen"],
  },
  {
    name: "Respiración y relajación",
    description:
      "Tumbado boca arriba o sentado cómodamente, cierra los ojos y realiza respiraciones lentas y profundas con el diafragma. Libera conscientemente la tensión de cada grupo muscular de los pies hacia la cabeza. Finaliza el entrenamiento reduciendo la activación del sistema nervioso.",
    labels: ["Abdomen"],
  },
  {
    name: "Respiración diafragmática",
    description:
      "Coloca una mano en el pecho y otra en el abdomen. Inhala expandiendo el abdomen (la mano baja no debe moverse) durante 4 segundos; exhala vaciando el abdomen en 6 segundos. Practícala sentado o tumbado para mejorar la capacidad pulmonar y reducir la tensión muscular.",
    labels: ["Abdomen"],
  },

  // ── CARDIO PRINCIPAL ───────────────────────────────────────────────────────
  {
    name: "Caminata inclinada",
    description:
      "Camina en cinta con una inclinación del 8–15% a velocidad moderada (5–6 km/h). La inclinación aumenta la demanda cardiovascular y el trabajo de glúteos e isquiotibiales sin el impacto del trote. Mantén una postura erguida y evita agarrarte a las barras.",
    labels: ["Glúteos", "Isquiotibiales", "Pantorrillas", "Cuádriceps"],
  },

  // ── DESCANSO ACTIVO ────────────────────────────────────────────────────────
  {
    name: "Caminata al aire libre",
    description:
      "Camina a paso cómodo en exteriores durante el tiempo indicado. El objetivo es mantener el cuerpo activo en los días de descanso sin generar estrés adicional. Aprovecha para desconectar mentalmente, respirar aire fresco y favorecer la recuperación activa.",
    labels: ["Cuádriceps", "Pantorrillas", "Isquiotibiales"],
  },
  {
    name: "Caminata suave",
    description:
      "Paseo tranquilo a baja intensidad (30–40% de la frecuencia cardíaca máxima). Ideal para los días de descanso activo: mejora la circulación, reduce el dolor muscular tardío (DOMS) y favorece la recuperación sin añadir carga al sistema nervioso.",
    labels: ["Cuádriceps", "Pantorrillas"],
  },
  {
    name: "Movilidad ligera",
    description:
      "Secuencia corta de movimientos articulares y estiramientos dinámicos de baja intensidad: círculos de cadera, balanceos de piernas, rotaciones de hombros y extensiones suaves de columna. No debe generar fatiga; su propósito es mantener la amplitud de movimiento en los días de descanso.",
    labels: ["Hombros", "Flexores de cadera", "Espalda"],
  },
  {
    name: "Estiramientos suaves",
    description:
      "Estiramientos estáticos de baja intensidad para los grandes grupos musculares. Mantén cada posición 20–30 segundos sin forzar ni rebotar. Úsalos en días de descanso para reducir la rigidez y mejorar la flexibilidad de forma progresiva.",
    labels: ["Cuádriceps", "Isquiotibiales", "Espalda", "Hombros"],
  },
];

async function main() {
  const allLabels = await prisma.label.findMany();
  const labelMap = new Map(allLabels.map((l) => [l.name, l.id]));

  const allExercises = await prisma.exercise.findMany({
    select: { name: true },
  });
  const existing = new Set(allExercises.map((e) => e.name.toLowerCase()));

  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No hay ningún usuario en la base de datos.");
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const ex of exercises) {
    if (existing.has(ex.name.toLowerCase())) {
      console.log(`⏭  Omitido: ${ex.name}`);
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
        labels: { create: labelIds.map((labelId) => ({ labelId })) },
      },
    });

    console.log(`✓ Creado: ${ex.name}`);
    created++;
  }

  console.log(`\n✅ ${created} creados, ${skipped} omitidos.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// ─── Types ────────────────────────────────────────────────────────────────────

export type SetData = {
  reps: number;
  weightKg: number;
  exerciseId: string;
  exercise: { name: string; labels: { label: { name: string } }[] };
};

export type LogData = { id: string; date: Date; sets: SetData[] };

export type ExerciseStrength = {
  id: string;
  name: string;
  history: { date: string; e1rm: number; weight: number; reps: number }[];
  latestE1rm: number;
  peakE1rm: number;
  trend: "improving" | "stagnant" | "declining";
  weeksStagnant: number;
  improvementPct: number;
  totalSessions: number;
};

export type MuscleVolume = {
  name: string;
  volume: number;
  sets: number;
  percentage: number;
  category: "push" | "pull" | "legs" | "core" | "other";
};

export type WeeklyVolume = {
  weekKey: string;
  label: string;
  volume: number;
  sets: number;
  workouts: number;
};

export type PR = {
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  e1rm: number;
  date: string;
  isRecent: boolean;
  prevE1rm: number | null;
  improvementPct: number | null;
};

export type Insight = {
  type: "warning" | "success" | "info";
  title: string;
  detail: string;
};

export type HeatmapDay = {
  date: string;
  count: number;
  week: number;
  day: number;
};

export type PeriodStats = { volume: number; workouts: number; sets: number };

export type StatsResult = {
  hasData: boolean;
  totalWorkouts: number;
  currentStreak: number;
  bestStreak: number;
  weeklyFrequency: number;
  totalVolume: number;
  thisWeek: PeriodStats;
  lastWeek: PeriodStats;
  thisMonth: PeriodStats;
  lastMonth: PeriodStats;
  strengthByExercise: ExerciseStrength[];
  muscleVolumes: MuscleVolume[];
  weeklyVolumes: WeeklyVolume[];
  prs: PR[];
  insights: Insight[];
  heatmap: HeatmapDay[];
  mostWorkedMuscle: string | null;
  leastWorkedMuscle: string | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const MUSCLE_CATEGORY: Record<string, MuscleVolume["category"]> = {
  Pecho: "push",
  Hombros: "push",
  Tríceps: "push",
  Espalda: "pull",
  Bíceps: "pull",
  Trapecio: "pull",
  Antebrazos: "pull",
  Serrato: "pull",
  Cuádriceps: "legs",
  Isquiotibiales: "legs",
  Glúteos: "legs",
  Pantorrillas: "legs",
  Aductores: "legs",
  Abductores: "legs",
  "Flexores de cadera": "legs",
  Abdomen: "core",
  Oblicuos: "core",
  Lumbares: "core",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function e1rm(weight: number, reps: number): number {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  if (weight === 0) return 0;
  return Math.round(weight * (1 + reps / 30));
}

function fmtDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function startOfWeekDay(d: Date, weekStartDay: number): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = (day - weekStartDay + 7) % 7;
  date.setDate(date.getDate() - diff);
  return date;
}

function weekKeyFor(d: Date, weekStartDay: number): string {
  return fmtDate(startOfWeekDay(d, weekStartDay));
}

function weekLabelFor(d: Date, weekStartDay: number): string {
  return startOfWeekDay(d, weekStartDay).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(offset = 0): Date {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - offset);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfMonth(offset = 0): Date {
  const d = startOfMonth(offset - 1);
  d.setDate(d.getDate() - 1);
  d.setHours(23, 59, 59, 999);
  return d;
}

// ─── Core computation ─────────────────────────────────────────────────────────

export function computeStats(logs: LogData[], weekStartDay = 1): StatsResult {
  if (logs.length === 0) {
    return emptyStats();
  }

  const now = new Date();
  const workoutDates = logs.map((l) => fmtDate(l.date));

  // ── Streaks ────────────────────────────────────────────────────────────────
  const { currentStreak, bestStreak } = computeStreaks(workoutDates);

  // ── Weekly frequency (last 4 full weeks) ──────────────────────────────────
  const last4WeeksStart = daysAgo(28);
  const recentLogs = logs.filter((l) => l.date >= last4WeeksStart);
  const weeklyFrequency = Math.round((recentLogs.length / 4) * 10) / 10;

  // ── Total volume ──────────────────────────────────────────────────────────
  const totalVolume = logs
    .flatMap((l) => l.sets)
    .reduce((sum, s) => sum + s.weightKg * s.reps, 0);

  // ── Period stats ──────────────────────────────────────────────────────────
  const todayStr = fmtDate(now);
  const thisWeekStart = fmtDate(startOfWeekDay(now, weekStartDay));
  const lastWeekStart = fmtDate(
    new Date(startOfWeekDay(now, weekStartDay).getTime() - 7 * 86400000),
  );
  const thisMonthStart = fmtDate(startOfMonth(0));
  const lastMonthStart = fmtDate(startOfMonth(1));
  const lastMonthEnd = fmtDate(endOfMonth(1));

  const thisWeek = periodStats(logs, thisWeekStart, todayStr);
  const lastWeek = periodStats(logs, lastWeekStart, thisWeekStart);
  const thisMonth = periodStats(logs, thisMonthStart, todayStr);
  const lastMonth = periodStats(logs, lastMonthStart, lastMonthEnd);

  // ── Strength history per exercise ─────────────────────────────────────────
  const strengthByExercise = computeStrengthHistory(logs);

  // ── Muscle volumes ────────────────────────────────────────────────────────
  const muscleVolumes = computeMuscleVolumes(logs);
  const sortedMuscles = [...muscleVolumes].sort((a, b) => b.volume - a.volume);
  const mostWorkedMuscle = sortedMuscles[0]?.name ?? null;
  const leastWorkedMuscle =
    sortedMuscles.filter((m) => m.volume > 0).at(-1)?.name ?? null;

  // ── Weekly volumes (last 16 weeks) ────────────────────────────────────────
  const weeklyVolumes = computeWeeklyVolumes(logs, 16, weekStartDay);

  // ── PRs ───────────────────────────────────────────────────────────────────
  const prs = computePRs(logs);

  // ── Heatmap ───────────────────────────────────────────────────────────────
  const heatmap = computeHeatmap(workoutDates, weekStartDay);

  // ── Insights ──────────────────────────────────────────────────────────────
  const insights = generateInsights({
    logs,
    strengthByExercise,
    muscleVolumes,
    weeklyFrequency,
    currentStreak,
    thisWeek,
    lastWeek,
    thisMonth,
    lastMonth,
    prs,
    weekStartDay,
  });

  return {
    hasData: true,
    totalWorkouts: logs.length,
    currentStreak,
    bestStreak,
    weeklyFrequency,
    totalVolume,
    thisWeek,
    lastWeek,
    thisMonth,
    lastMonth,
    strengthByExercise,
    muscleVolumes,
    weeklyVolumes,
    prs,
    insights,
    heatmap,
    mostWorkedMuscle,
    leastWorkedMuscle,
  };
}

// ─── Streak ───────────────────────────────────────────────────────────────────

function computeStreaks(dates: string[]): {
  currentStreak: number;
  bestStreak: number;
} {
  const unique = [...new Set(dates)].sort().reverse();
  if (unique.length === 0) return { currentStreak: 0, bestStreak: 0 };

  const today = fmtDate(new Date());
  const yesterday = fmtDate(daysAgo(1));

  // Current streak
  let current = 0;
  if (unique[0] === today || unique[0] === yesterday) {
    current = 1;
    for (let i = 1; i < unique.length; i++) {
      const prev = new Date(unique[i - 1]);
      const curr = new Date(unique[i]);
      const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000);
      if (diff === 1) current++;
      else break;
    }
  }

  // Best streak (all-time)
  let best = 1;
  let run = 1;
  const asc = [...unique].reverse();
  for (let i = 1; i < asc.length; i++) {
    const prev = new Date(asc[i - 1]);
    const curr = new Date(asc[i]);
    const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
    if (diff === 1) {
      run++;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }

  return { currentStreak: current, bestStreak: best };
}

// ─── Period stats ─────────────────────────────────────────────────────────────

function periodStats(
  logs: LogData[],
  fromStr: string,
  toStr: string,
): PeriodStats {
  const filtered = logs.filter((l) => {
    const d = fmtDate(l.date);
    return d >= fromStr && d <= toStr;
  });
  return {
    workouts: filtered.length,
    sets: filtered.flatMap((l) => l.sets).length,
    volume: filtered
      .flatMap((l) => l.sets)
      .reduce((s, set) => s + set.weightKg * set.reps, 0),
  };
}

// ─── Strength history ─────────────────────────────────────────────────────────

function computeStrengthHistory(logs: LogData[]): ExerciseStrength[] {
  const byExercise: Record<
    string,
    {
      name: string;
      byDate: Record<string, { e1rm: number; weight: number; reps: number }>;
    }
  > = {};

  for (const log of logs) {
    const dateStr = fmtDate(log.date);
    for (const set of log.sets) {
      const est = e1rm(set.weightKg, set.reps);
      if (!byExercise[set.exerciseId]) {
        byExercise[set.exerciseId] = { name: set.exercise.name, byDate: {} };
      }
      const existing = byExercise[set.exerciseId].byDate[dateStr];
      if (!existing || est > existing.e1rm) {
        byExercise[set.exerciseId].byDate[dateStr] = {
          e1rm: est,
          weight: set.weightKg,
          reps: set.reps,
        };
      }
    }
  }

  return Object.entries(byExercise)
    .map(([id, data]) => {
      const history = Object.entries(data.byDate)
        .map(([date, d]) => ({ date, ...d }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const latest = history.at(-1)?.e1rm ?? 0;
      const peak = Math.max(...history.map((h) => h.e1rm));

      // Trend: compare last 4 weeks vs previous 4 weeks
      const cutoff4w = fmtDate(daysAgo(28));
      const cutoff8w = fmtDate(daysAgo(56));
      const recent = history.filter((h) => h.date >= cutoff4w);
      const older = history.filter(
        (h) => h.date >= cutoff8w && h.date < cutoff4w,
      );
      const recentPeak = recent.length
        ? Math.max(...recent.map((h) => h.e1rm))
        : 0;
      const olderPeak = older.length
        ? Math.max(...older.map((h) => h.e1rm))
        : 0;

      let trend: ExerciseStrength["trend"] = "stagnant";
      if (recentPeak > olderPeak * 1.01) trend = "improving";
      else if (recentPeak < olderPeak * 0.99 && olderPeak > 0)
        trend = "declining";

      // Weeks stagnant: how many weeks since last new PR
      const peakDate =
        history.find((h) => h.e1rm === peak)?.date ?? history[0]?.date;
      const weeksStagnant = Math.floor(
        (Date.now() - new Date(peakDate).getTime()) / (7 * 86400000),
      );

      const firstE1rm = history[0]?.e1rm ?? 0;
      const improvementPct =
        firstE1rm > 0
          ? Math.round(((latest - firstE1rm) / firstE1rm) * 100)
          : 0;

      return {
        id,
        name: data.name,
        history,
        latestE1rm: latest,
        peakE1rm: peak,
        trend,
        weeksStagnant: latest === peak ? 0 : weeksStagnant,
        improvementPct,
        totalSessions: history.length,
      };
    })
    .sort((a, b) => b.totalSessions - a.totalSessions);
}

// ─── Muscle volumes ───────────────────────────────────────────────────────────

function computeMuscleVolumes(logs: LogData[]): MuscleVolume[] {
  const volByMuscle: Record<string, { volume: number; sets: number }> = {};

  for (const log of logs) {
    for (const set of log.sets) {
      const vol = set.weightKg > 0 ? set.weightKg * set.reps : set.reps;
      for (const { label } of set.exercise.labels) {
        if (!volByMuscle[label.name])
          volByMuscle[label.name] = { volume: 0, sets: 0 };
        volByMuscle[label.name].volume += vol;
        volByMuscle[label.name].sets += 1;
      }
    }
  }

  const total =
    Object.values(volByMuscle).reduce((s, v) => s + v.volume, 0) || 1;

  return Object.entries(volByMuscle)
    .map(([name, data]) => ({
      name,
      volume: Math.round(data.volume),
      sets: data.sets,
      percentage: Math.round((data.volume / total) * 100),
      category: MUSCLE_CATEGORY[name] ?? "other",
    }))
    .sort((a, b) => b.volume - a.volume);
}

// ─── Weekly volumes ───────────────────────────────────────────────────────────

function computeWeeklyVolumes(
  logs: LogData[],
  weeks: number,
  weekStartDay: number,
): WeeklyVolume[] {
  const map: Record<string, WeeklyVolume> = {};

  for (const log of logs) {
    const key = weekKeyFor(log.date, weekStartDay);
    if (!map[key]) {
      map[key] = {
        weekKey: key,
        label: weekLabelFor(log.date, weekStartDay),
        volume: 0,
        sets: 0,
        workouts: 0,
      };
    }
    map[key].workouts += 1;
    for (const set of log.sets) {
      map[key].volume += set.weightKg * set.reps;
      map[key].sets += 1;
    }
  }

  const result: WeeklyVolume[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const ws = new Date(
      startOfWeekDay(new Date(), weekStartDay).getTime() - i * 7 * 86400000,
    );
    const key = fmtDate(ws);
    result.push(
      map[key] ?? {
        weekKey: key,
        label: weekLabelFor(ws, weekStartDay),
        volume: 0,
        sets: 0,
        workouts: 0,
      },
    );
  }
  return result;
}

// ─── PRs ─────────────────────────────────────────────────────────────────────

function computePRs(logs: LogData[]): PR[] {
  const byExercise: Record<
    string,
    {
      name: string;
      records: { e1rm: number; weight: number; reps: number; date: string }[];
    }
  > = {};

  for (const log of logs) {
    const dateStr = fmtDate(log.date);
    for (const set of log.sets) {
      if (!byExercise[set.exerciseId]) {
        byExercise[set.exerciseId] = { name: set.exercise.name, records: [] };
      }
      const est = e1rm(set.weightKg, set.reps);
      const prev = byExercise[set.exerciseId].records.at(-1);
      if (!prev || est > prev.e1rm) {
        byExercise[set.exerciseId].records.push({
          e1rm: est,
          weight: set.weightKg,
          reps: set.reps,
          date: dateStr,
        });
      }
    }
  }

  const thirtyDaysAgo = fmtDate(daysAgo(30));

  return Object.entries(byExercise)
    .filter(([, data]) => data.records.length > 0)
    .map(([exerciseId, data]) => {
      const latest = data.records[data.records.length - 1];
      const prev = data.records.at(-2) ?? null;
      const improvementPct = prev
        ? Math.round(((latest.e1rm - prev.e1rm) / prev.e1rm) * 100)
        : null;
      return {
        exerciseId,
        exerciseName: data.name,
        weight: latest.weight,
        reps: latest.reps,
        e1rm: latest.e1rm,
        date: latest.date,
        isRecent: latest.date >= thirtyDaysAgo,
        prevE1rm: prev?.e1rm ?? null,
        improvementPct,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ─── Heatmap ──────────────────────────────────────────────────────────────────

function computeHeatmap(
  workoutDates: string[],
  weekStartDay: number,
): HeatmapDay[] {
  const countMap: Record<string, number> = {};
  for (const d of workoutDates) countMap[d] = (countMap[d] ?? 0) + 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  // Rewind to the nearest weekStartDay
  const diff = (start.getDay() - weekStartDay + 7) % 7;
  start.setDate(start.getDate() - diff);

  const entries: HeatmapDay[] = [];
  for (let w = 0; w < 53; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) continue;
      const dateStr = fmtDate(date);
      entries.push({
        date: dateStr,
        count: countMap[dateStr] ?? 0,
        week: w,
        day: d,
      });
    }
  }
  return entries;
}

// ─── Insights ─────────────────────────────────────────────────────────────────

function generateInsights({
  logs: _logs,
  strengthByExercise,
  muscleVolumes,
  weeklyFrequency,
  currentStreak,
  thisWeek,
  lastWeek,
  thisMonth,
  lastMonth,
  prs,
  weekStartDay,
}: {
  logs: LogData[];
  strengthByExercise: ExerciseStrength[];
  muscleVolumes: MuscleVolume[];
  weeklyFrequency: number;
  currentStreak: number;
  thisWeek: PeriodStats;
  lastWeek: PeriodStats;
  thisMonth: PeriodStats;
  lastMonth: PeriodStats;
  prs: PR[];
  weekStartDay: number;
}): Insight[] {
  const insights: Insight[] = [];

  // Good streak
  if (currentStreak >= 5) {
    insights.push({
      type: "success",
      title: `🔥 Racha de ${currentStreak} días`,
      detail: "Manteniendo la consistencia. ¡Sigue así!",
    });
  }

  // New PR this week
  const thisWeekStart = fmtDate(startOfWeekDay(new Date(), weekStartDay));
  const weekPRs = prs.filter((p) => p.date >= thisWeekStart && p.isRecent);
  if (weekPRs.length > 0) {
    insights.push({
      type: "success",
      title: `🏆 ${weekPRs.length} PR${weekPRs.length > 1 ? "s" : ""} esta semana`,
      detail: weekPRs.map((p) => p.exerciseName).join(", "),
    });
  }

  // Stagnant exercises (4+ weeks no improvement, 5+ sessions)
  const stagnant = strengthByExercise.filter(
    (e) =>
      e.weeksStagnant >= 4 && e.totalSessions >= 5 && e.trend === "stagnant",
  );
  if (stagnant.length > 0) {
    const names = stagnant
      .slice(0, 2)
      .map((e) => e.name)
      .join(", ");
    insights.push({
      type: "warning",
      title: `⚠️ Estancamiento detectado`,
      detail: `${names} llevan ${stagnant[0].weeksStagnant}+ semanas sin mejorar. Considera cambiar el estímulo.`,
    });
  }

  // Muscle imbalance: check push/pull ratio
  const catVol: Record<string, number> = {
    push: 0,
    pull: 0,
    legs: 0,
    core: 0,
    other: 0,
  };
  for (const m of muscleVolumes)
    catVol[m.category] = (catVol[m.category] ?? 0) + m.volume;
  const pushPullTotal = catVol.push + catVol.pull;
  if (pushPullTotal > 0) {
    const pushPct = catVol.push / pushPullTotal;
    if (pushPct > 0.65) {
      insights.push({
        type: "warning",
        title: "⚠️ Desbalance empuje/tirón",
        detail: `Mucho más volumen en push (${Math.round(pushPct * 100)}%) que en pull. Añade más ejercicios de espalda/bíceps.`,
      });
    } else if (pushPct < 0.35) {
      insights.push({
        type: "warning",
        title: "⚠️ Desbalance empuje/tirón",
        detail: `Mucho más volumen en pull (${Math.round((1 - pushPct) * 100)}%) que en push. Balancea con más pecho/hombros/tríceps.`,
      });
    }
  }

  // Low leg volume
  const totalMuscleVol = Object.values(catVol).reduce((s, v) => s + v, 0);
  if (
    totalMuscleVol > 0 &&
    catVol.legs / totalMuscleVol < 0.15 &&
    catVol.legs > 0
  ) {
    insights.push({
      type: "warning",
      title: "🦵 Piernas con poco volumen",
      detail: `Solo el ${Math.round((catVol.legs / totalMuscleVol) * 100)}% del volumen va a piernas. Considera agregar más trabajo de tren inferior.`,
    });
  }

  // Consistency drop this month
  if (
    lastMonth.workouts >= 4 &&
    thisMonth.workouts < lastMonth.workouts * 0.7
  ) {
    const drop = Math.round(
      ((lastMonth.workouts - thisMonth.workouts) / lastMonth.workouts) * 100,
    );
    insights.push({
      type: "warning",
      title: "📉 Consistencia bajó este mes",
      detail: `${drop}% menos entrenamientos que el mes pasado (${thisMonth.workouts} vs ${lastMonth.workouts}).`,
    });
  }

  // Volume drop this week
  if (lastWeek.volume > 0 && thisWeek.volume < lastWeek.volume * 0.6) {
    insights.push({
      type: "info",
      title: "📊 Volumen bajo esta semana",
      detail: `${Math.round(thisWeek.volume)} kg vs ${Math.round(lastWeek.volume)} kg la semana pasada.`,
    });
  }

  // Optimal frequency insight
  if (weeklyFrequency >= 4) {
    insights.push({
      type: "info",
      title: `✅ Frecuencia óptima`,
      detail: `Estás entrenando ${weeklyFrequency} veces/semana en promedio — rango ideal para progreso.`,
    });
  }

  // Most improved exercise (last 30 days)
  const recentCutoff = fmtDate(daysAgo(30));
  const improving = strengthByExercise
    .filter((e) => {
      const recentHistory = e.history.filter((h) => h.date >= recentCutoff);
      return recentHistory.length >= 2;
    })
    .filter((e) => e.trend === "improving")
    .sort((a, b) => b.improvementPct - a.improvementPct);

  if (improving.length > 0) {
    const top = improving[0];
    insights.push({
      type: "success",
      title: `📈 ${top.name} mejorando`,
      detail: `+${top.improvementPct}% en 1RM estimado en el último mes.`,
    });
  }

  return insights.slice(0, 6);
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function emptyStats(): StatsResult {
  return {
    hasData: false,
    totalWorkouts: 0,
    currentStreak: 0,
    bestStreak: 0,
    weeklyFrequency: 0,
    totalVolume: 0,
    thisWeek: { volume: 0, workouts: 0, sets: 0 },
    lastWeek: { volume: 0, workouts: 0, sets: 0 },
    thisMonth: { volume: 0, workouts: 0, sets: 0 },
    lastMonth: { volume: 0, workouts: 0, sets: 0 },
    strengthByExercise: [],
    muscleVolumes: [],
    weeklyVolumes: [],
    prs: [],
    insights: [],
    heatmap: [],
    mostWorkedMuscle: null,
    leastWorkedMuscle: null,
  };
}

import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim(),
  email: z.email("Email inválido").trim(),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .trim(),
});

export const LoginSchema = z.object({
  email: z.email("Email inválido").trim(),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const ExerciseSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim(),
  description: z.string().optional(),
  photoUrl: z.string().optional(),
  videoUrl: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || /youtube\.com|youtu\.be/.test(v),
      "Solo se aceptan links de YouTube",
    )
    .optional(),
});

export const RoutineSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").trim(),
  exerciseIds: z.array(z.string()).min(1, "Agrega al menos un ejercicio"),
});

export const WorkoutLogSchema = z.object({
  routineId: z.string().min(1, "Selecciona una rutina"),
  date: z.string().min(1, "Selecciona una fecha"),
  notes: z.string().optional(),
});

export const WorkoutSetSchema = z.object({
  exerciseId: z.string(),
  setNumber: z.number().int().positive(),
  reps: z.number().int().positive("Las repeticiones deben ser positivas"),
  weightKg: z.number().min(0, "El peso no puede ser negativo"),
});

export type RegisterState =
  | {
      errors?: { name?: string[]; email?: string[]; password?: string[] };
      message?: string;
    }
  | undefined;

export type LoginState =
  | { errors?: { email?: string[]; password?: string[] }; message?: string }
  | undefined;

export type ExerciseState =
  | { errors?: { name?: string[]; description?: string[] }; message?: string }
  | undefined;

export type RoutineState =
  | { errors?: { name?: string[]; exerciseIds?: string[] }; message?: string }
  | undefined;

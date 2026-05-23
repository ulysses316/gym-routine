# Gym Progress — TODOs

## Estado actual

La app compila y tiene todas las rutas funcionando. Las variables de Cloudinary deben
configurarse en `.env.local` para que el upload de fotos funcione.

---

## Pendiente

- [ ] Configurar Cloudinary (llenar variables en `.env.local`)
- [ ] Página de detalle de rutina `/routines/[id]` (ver ejercicios de la rutina)
- [ ] Gráfica de progreso por ejercicio (`/exercises/[id]/progress`)
  - Instalar `recharts`
  - Endpoint que retorna historial de peso máximo por sesión
- [ ] Editar ejercicio (página `/exercises/[id]/edit`)
- [ ] Editar rutina (cambiar nombre / agregar-quitar ejercicios)
- [ ] UI responsive mobile mejorada (navbar colapsable en móvil)
- [ ] Deploy a Vercel + Neon (cambiar DB de local a cloud)
- [ ] Generar `SESSION_SECRET` con `openssl rand -base64 32` para producción

---

## Completado ✓

### Fase 1 — Setup
- [x] Next.js 16.2.6 + TypeScript + Tailwind v4 + Biome + Lefthook
- [x] Prisma v7 + PostgreSQL adapter (`@prisma/adapter-pg`)
- [x] Schema con 6 modelos: User, Exercise, Routine, RoutineExercise, WorkoutLog, WorkoutSet
- [x] Migración inicial ejecutada

### Fase 2 — Infraestructura
- [x] `src/lib/prisma.ts` — cliente Prisma con singleton
- [x] `src/lib/session.ts` — sesiones JWT stateless con `jose`
- [x] `src/lib/definitions.ts` — schemas Zod para todos los formularios
- [x] `src/lib/cloudinary.ts` — upload de imágenes a Cloudinary
- [x] `src/proxy.ts` — protección de rutas (reemplaza middleware deprecado)

### Fase 3 — Auth
- [x] Server Actions: `register`, `login`, `logout`
- [x] Página `/login`
- [x] Página `/register`
- [x] Layout protegido con `getSession()`

### Fase 4 — Ejercicios (públicos)
- [x] `/exercises` — grid público sin auth requerida
- [x] `/exercises/new` — crear con upload de foto
- [x] `/exercises/[id]` — detalle con foto + botón eliminar (solo dueño)

### Fase 5 — Rutinas
- [x] `/routines` — lista de rutinas del usuario
- [x] `/routines/new` — crear rutina con selector de ejercicios + búsqueda

### Fase 6 — Registro diario
- [x] `/logs` — historial de entrenamientos
- [x] `/logs/new` — seleccionar rutina + fecha
- [x] `/logs/[id]` — registrar series (reps + peso) por ejercicio, eliminar series

### Fase 7 — Dashboard
- [x] `/dashboard` — stats (rutinas, entrenamientos, último entreno) + accesos rápidos

---

## Variables de entorno necesarias (`.env.local`)

```
DATABASE_URL=postgresql://...          ← ya configurado
SESSION_SECRET=...                     ← cambiar en producción
CLOUDINARY_CLOUD_NAME=...              ← crear cuenta en cloudinary.com
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

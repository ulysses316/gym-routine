# ── Stage 1: install dependencies ──────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ── Stage 2: build ──────────────────────────────────────────────────────────────
FROM oven/bun:1.2-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# prisma generate only reads the schema — DATABASE_URL is not used yet
ENV DATABASE_URL=postgresql://placeholder/placeholder
RUN bunx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ── Stage 3: production runner ──────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Static assets and standalone server bundle
COPY --from=builder /app/public                    ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Required at runtime:
#   DATABASE_URL  — postgresql://user:pass@host:5432/dbname
#   SESSION_SECRET — random 32+ char string
#   CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET (if using image uploads)
#
# Run migrations before the first deploy:
#   docker run --rm -e DATABASE_URL=... <image> bunx prisma migrate deploy
#
CMD ["node", "server.js"]

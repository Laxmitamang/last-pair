# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile


FROM base AS builder

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN DATABASE_URL="postgresql://build_user:build_password@localhost:5432/build_database" \
    BETTER_AUTH_URL="http://localhost:3000" \
    BETTER_AUTH_SECRET="build-only-placeholder-1234567890123456" \
    pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]

# Stage 1: Build NestJS API
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate

# Copy monorepo configuration & tsconfig
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies allowing build scripts in non-interactive Docker
RUN pnpm install --no-frozen-lockfile --dangerously-allow-all-builds

# Generate Prisma Client
RUN pnpm --filter @omnipost/api db:generate

# Build foundational workspace packages in exact dependency order
RUN pnpm --filter @omnipost/types build
RUN pnpm --filter @omnipost/validation build
RUN pnpm --filter @omnipost/shared build
RUN pnpm --filter @omnipost/platform-core build
RUN pnpm --filter @omnipost/brand-core build
RUN pnpm --filter @omnipost/media-core build
RUN pnpm --filter @omnipost/ai-core build
RUN pnpm --filter @omnipost/publishing-core build
RUN pnpm --filter @omnipost/analytics-core build
RUN pnpm --filter @omnipost/billing-core build

# Build NestJS API
RUN pnpm --filter @omnipost/api build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built workspace packages, root node_modules, and apps/api node_modules
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

WORKDIR /app/apps/api

# Ensure Prisma Client is generated in runner environment
RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3001

CMD ["node", "dist/main.js"]

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

# Build NestJS API with path alias resolution
RUN pnpm --filter @omnipost/api build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy built workspace packages, node_modules, dist, and prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]

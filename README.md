# OmniPost

> **Create once. Adapt everywhere. Publish everywhere.**

OmniPost is a production-grade, multi-tenant SaaS platform that enables creators, businesses, marketing teams, and agencies to upload content once, analyze and adapt it automatically via AI, preview platform-specific versions, and schedule/publish across multiple social and community networks.

---

## Technical Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, React 18, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod.
- **Admin App**: Next.js 15 isolated administration suite (`apps/admin`).
- **Backend**: NestJS, TypeScript, REST API, WebSockets.
- **Database**: PostgreSQL 16 & Prisma ORM.
- **Queue & Async Jobs**: Redis & BullMQ.
- **Media Engine**: FFmpeg transcoding, intelligent framing, aspect ratio presets.
- **AI Engine**: Abstracted AI provider layer supporting OpenAI & Gemini.
- **Infrastructure**: Docker Compose, Vercel (Frontend), AWS / Railway (Backend).

---

## Monorepo Layout

```text
omnipost/
├── apps/
│   ├── web/               # Primary Next.js SaaS Web Application
│   ├── api/               # NestJS API Server & Queue Processor
│   └── admin/             # Isolated Admin Dashboard Application
│
├── packages/
│   ├── ui/                # Shared React Component System
│   ├── types/             # Monorepo TypeScript Type Definitions
│   ├── config/            # TSConfig & Linting Configurations
│   ├── validation/        # Zod Schemas & DTO Validators
│   ├── platform-core/     # PlatformAdapter Core Contracts & Capabilities
│   ├── ai-core/           # OpenAI & Gemini Provider Abstraction Layer
│   ├── media-core/        # FFmpeg Transcoding Presets & Video Specs
│   └── shared/            # Structured Logger & Exception Handling
│
├── infrastructure/        # Docker Compose configuration (Postgres + Redis)
└── docs/                  # Architectural & technical documentation
```

---

## Quick Start

### 1. Requirements

- Node.js `v20.x` or `v24.x`
- pnpm `v9.x` or `v11.x`
- Docker & Docker Compose

### 2. Installation

```bash
pnpm install
```

### 3. Start Local Database & Redis

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

### 4. Database Setup

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Start Development Servers

```bash
pnpm dev
```

- Web App: `http://localhost:3000`
- Admin App: `http://localhost:3001`
- API Server: `http://localhost:4000/api/v1`

---

## Documentation

Full architectural specifications are located in `/docs`:

- [Architecture Overview](docs/architecture.md)
- [Database Schema & Multi-Tenancy](docs/database.md)
- [API Reference](docs/api.md)
- [Platform Integration Architecture](docs/platform-integrations.md)
- [Media Processing Pipeline](docs/media-processing.md)
- [AI Adaptation System](docs/ai-system.md)
- [Publishing Engine & BullMQ Scheduler](docs/publishing-engine.md)
- [Security & Token Encryption](docs/security.md)
- [Deployment Strategy](docs/deployment.md)
- [Testing Strategy](docs/testing.md)

---

## License

MIT License © 2026 OmniPost.

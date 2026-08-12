# OmniPost — Multi-Platform Social Media Automation & Enterprise Admin Portal

OmniPost is an all-in-one social media publishing, scheduling, AI content generation, and multi-channel analytics platform. It features a Next.js customer web portal, a NestJS REST API backend, and a standalone Next.js 15 Enterprise Admin Dashboard for platform operations, workspace governance, subscription management, and security telemetry.

---

## 🚀 Repository Structure

This monorepo contains the following applications and packages:

```text
OmniPost/
├── apps/
│   ├── admin/               # Next.js 15 Standalone Enterprise Admin Dashboard (Port 3002)
│   ├── api/                 # NestJS Core API Gateway & Admin Endpoints (Port 3001)
│   └── web/                 # Customer Web Application (Port 3000)
├── packages/
│   ├── types/               # Shared TypeScript Interfaces & DTO Schemas
│   ├── ui/                  # Shared UI Component Library & Design Tokens
│   └── validation/          # Zod Validation Schemas
├── docs/                    # Architecture Guidelines & Engineering Specs
├── README.md                # Main Project Documentation
└── package.json             # Monorepo Workspace Configuration
```

---

## ⚡ Port Mappings & Local Development

| Application | Framework | Port | Command |
|---|---|---|---|
| **Customer App (`apps/web`)** | Next.js 14 / React 18 | `3000` | `npm run dev --workspace=apps/web` |
| **REST API Backend (`apps/api`)** | NestJS / Prisma ORM | `3001` | `npm run dev --workspace=apps/api` |
| **Admin Dashboard (`apps/admin`)** | Next.js 15 / Tailwind CSS | `3002` | `npm run dev --workspace=apps/admin` |

---

## 🔐 Admin Authentication & Role-Based Access Control (RBAC)

The Admin Dashboard enforces **Server-Side Guard Protection (`AdminJwtGuard`)** on all `/api/v1/admin/*` endpoints. It includes **6-digit TOTP MFA verification** and supports 7 distinct administrative roles:

1. **`SUPER_ADMIN`**: Unrestricted platform access, billing, security, and role management (`*`).
2. **`PLATFORM_ADMIN`**: Manage 13 social networks, publishing queues, and feature flags.
3. **`OPERATIONS_ADMIN`**: Infrastructure health, BullMQ queue switches, FFmpeg transcoding, worker fleet.
4. **`SUPPORT_ADMIN`**: Customer helpdesk tickets, workspace inspection, and official support replies.
5. **`FINANCE_ADMIN`**: Plan tier quotas, customer subscriptions, payment transactions, and audited refunds.
6. **`ANALYST`**: Executive DAU/WAU/MAU metrics, cohort retention, and platform performance graphs.
7. **`MODERATOR`**: Flagged content review, automated keyword/spam filters, and post blocking.

---

## 📊 Complete 20-Phase Admin Build Specification (Phases A–T)

The Enterprise Admin Portal was developed across 20 structured engineering phases:

- **Phase A — Admin Project Initialization**: Built standalone Next.js 15 app in `/apps/admin` (Port 3002), directory architecture, API client (`adminApiFetch`), and Zustand auth store.
- **Phase B — Admin Authentication & RBAC**: Server-enforced `AdminAuthModule` in NestJS, MFA TOTP verification, and password reset flows.
- **Phase C — Admin Layout & Design System**: Dark glassmorphic design system (`AdminSidebar`, `AdminHeader`, global search bar, incident alert pill).
- **Phase D — Executive Dashboard**: Real-time KPI telemetry (Users, Active Workspaces, Published Posts, MRR, AI Tokens, Infrastructure Health Grid).
- **Phase E — User Management**: User directory with status filtering (`ACTIVE`, `SUSPENDED`), profile inspection, force logout, and MFA reset controllers.
- **Phase F — Workspace & Agency Management**: Workspace inspection detail views and Agency White-Label Portfolio Hub.
- **Phase G — Social Platform Matrix**: Telemetry tracking across all 13 social networks (Instagram, TikTok, YouTube, X, LinkedIn, Facebook, Threads, Pinterest, Telegram, Discord, Slack, Reddit, Google Business Profile).
- **Phase H — Social-Account Monitoring**: Token health telemetry (Connected, Token Expiring, Permission Revoked) with secret token masking (`••••••••`).
- **Phase I — Global Publishing Management**: Global activity table and execution stage timeline inspector (Created → Queued → Processing → Uploading → Publishing → Published).
- **Phase J — Failed-Job Center**: Root-cause error categorization (Authentication, Rate Limit, Invalid Media, Permission, Platform API, Network) and `⚡ Bulk Retry` controls.
- **Phase K — Media Monitoring**: Storage usage overview (Video vs Image), top storage workspaces, and FFmpeg transcoding log inspector.
- **Phase L — AI Management & Costs**: Multi-LLM usage tracking (OpenAI, Gemini, Anthropic), feature request distribution, and encrypted API key management (`••••••••8f2a`).
- **Phase M — Executive Product Analytics**: DAU, WAU, MAU retention metrics (`7d`, `30d`, `90d`, `12m`), cohort analysis, and cross-platform comparative performance.
- **Phase N — Billing & Subscriptions**: Subscription directory, Plan Entitlement Manager (Free, Creator, Pro, Agency), multi-gateway payment ledger (Stripe, Paystack, Flutterwave), and finance-audited refunds.
- **Phase O — Support & Moderation**: Helpdesk support ticket center, threaded replies, and flagged content policy enforcement (Approve, Block, Warn, Suspend).
- **Phase P — Security Audit Logs**: Immutable audit log ledger, JSON state diff inspector (Before vs After), and SHA-256 cryptographic non-repudiation verification.
- **Phase Q — System Health & Queue Monitoring**: Infrastructure health checks, BullMQ queue pause/resume controls, and active worker process fleet CPU/RAM telemetry.
- **Phase R — Feature Flags & Settings**: Targeted feature rollout engine (Rollout %, Plan tiers, Workspace whitelist), global maintenance mode switch, and 7-role RBAC matrix.
- **Phase S — Security Hardening**: Admin CIDR IP whitelisting rules, session inactivity timeouts, active session inventory, and instant session revocation.
- **Phase T — Testing & Production Release**: Full NestJS Jest test suite execution (33 passed test suites / 94 tests) and production Next.js 15 build (34 prerendered pages).

---

## 🛠 Setup & Installation

### Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm v10.x` or `pnpm`
- **Database**: PostgreSQL database & Redis server instance

### 1. Install Workspace Dependencies
```bash
npm install
```

### 2. Environment Variables Configuration
Copy `.env.example` to `.env.local` in `apps/admin` and `apps/api`:

```env
# apps/admin/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_ADMIN_PORT=3002

# apps/api/.env
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/omnipost
REDIS_URL=redis://localhost:6379
JWT_SECRET=super-secret-jwt-key
JWT_ADMIN_SECRET=super-secret-admin-jwt-key
```

### 3. Run Applications Locally
```bash
# Start API backend (Port 3001)
npm run dev --workspace=apps/api

# Start Admin Dashboard (Port 3002)
npm run dev --workspace=apps/admin

# Start Customer Web Portal (Port 3000)
npm run dev --workspace=apps/web
```

---

## 🧪 Testing & Production Build

### Run Backend API Unit Tests (`apps/api`)
```bash
cd apps/api
npm run test
# Output: PASS 33/33 test suites (94 passed tests)
```

### Compile Production Admin Build (`apps/admin`)
```bash
cd apps/admin
npm run build
# Output: Compiled 34 static and dynamic prerendered routes cleanly
```

---

## 📄 License & GitHub Repository
- **Repository**: [https://github.com/Omatsulijoshua/OmniPost](https://github.com/Omatsulijoshua/OmniPost)
- **Main Branch**: `main`
- **License**: Enterprise Proprietary License — All Rights Reserved.

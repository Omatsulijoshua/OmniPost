# OmniPost — Dedicated Admin Operations Dashboard

The OmniPost Admin Dashboard is a standalone operational management portal built specifically for OmniPost platform administrators, operators, and support staff.

## Architecture
- **Location**: `/apps/admin` (Port 3002)
- **Framework**: Next.js 15 App Router, React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Backend API Base**: `http://localhost:3001/api/v1/admin`

## Dedicated Admin RBAC Roles
- `SUPER_ADMIN` — Full system control, configuration, and security management.
- `PLATFORM_ADMIN` — Platform integrations, API capabilities, and OAuth health.
- `OPERATIONS_ADMIN` — Publishing queues, job retries, and media transcoding.
- `SUPPORT_ADMIN` — Customer support tickets, user account context, and troubleshooting.
- `FINANCE_ADMIN` — Subscriptions, revenue analytics, plans, and refunds.
- `ANALYST` — Product usage metrics and platform analytics.
- `MODERATOR` — Abuse detection, warnings, suspensions, and account moderation.

## Operational Features & Routes
- `/admin/login` — Dedicated MFA-ready admin login.
- `/admin/dashboard` — Executive overview KPIs & real-time system health status.
- `/admin/users` — User management, suspension, and account inspection.
- `/admin/workspaces` — Workspace & Agency portfolio management.
- `/admin/platforms` — 13 Social Platforms health, status toggle, and capability matrix.
- `/admin/publishing` & `/admin/publishing/failed` — Global publishing queue & Failed Job Center.
- `/admin/media` — Transcoding pipeline & storage management.
- `/admin/ai` — Multi-LLM provider cost monitoring & usage analytics.
- `/admin/billing` — Plans, subscriptions, revenue analytics & refunds.
- `/admin/support` — Support ticket management with user context.
- `/admin/audit-logs` — Append-only security audit trail.
- `/admin/system-health` — Queue depth, latency, Redis & database health.
- `/admin/settings` — Feature flags and system configuration.

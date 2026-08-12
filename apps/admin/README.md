# OmniPost — Enterprise Admin Dashboard (`apps/admin`)

The **OmniPost Admin Dashboard** is a standalone, security-hardened Next.js 15 web application designed for platform administrators, customer operations, finance managers, and support staff. It operates on port `3002` and connects to the NestJS API server (`apps/api`) on port `3001`.

---

## 🎨 Technology Stack & Architecture

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Vanilla CSS tokens, Tailwind CSS, Dark Glassmorphism aesthetics
- **Icons**: Lucide React (`lucide-react`)
- **State Management**: Zustand (`useAdminAuthStore`)
- **API Client**: `adminApiFetch` with automatic JWT bearer header injection
- **Port**: `3002`

---

## 🔑 Key Admin Dashboard Modules

| Feature Module | Route Path | Description |
|---|---|---|
| **Executive Overview** | `/dashboard` | Platform metrics, MRR revenue, published posts, infrastructure status |
| **User Directory** | `/users` & `/users/[id]` | Account lookup, status filters, profile inspection, MFA reset, force logout |
| **Workspaces & Agencies** | `/workspaces` & `/agencies` | Workspace inspection detail & White-label Agency portfolio hub |
| **Social Platform Matrix** | `/platforms` & `/platforms/[id]` | Health telemetry & rate limits across all 13 social networks |
| **Social-Account Telemetry** | `/social-accounts` | Connected accounts & masked token health (`••••••••`) |
| **Publishing Queue** | `/publishing` & `/publishing/[id]` | Global publishing activity & execution timeline inspector |
| **Failed-Job Center** | `/publishing/failed` | Root-cause error categorization & bulk retry execution |
| **Media Monitoring** | `/media` & `/media/jobs` | Storage quotas (Video/Image) & FFmpeg transcoding log inspector |
| **AI Management** | `/ai` & `/ai/providers` | Multi-LLM token usage, cost tracking ($), and encrypted API keys (`••••••••8f2a`) |
| **Executive Analytics** | `/analytics`, `/product`, `/platforms` | DAU/WAU/MAU retention rates, product adoption, and platform comparison |
| **Billing & Subscriptions** | `/billing/subscriptions`, `/plans`, `/payments` | Active subscriptions, plan entitlements, payment ledger & audited refunds |
| **Support & Moderation** | `/support/tickets` & `/moderation` | Helpdesk ticket thread replies & flagged content policy enforcement |
| **Security Audit Logs** | `/audit-logs` & `/audit-logs/[id]` | Security ledger, state diff viewer (Before/After) & SHA-256 hash checks |
| **System & Queues** | `/system/health`, `/queues`, `/workers` | Infrastructure health, BullMQ queue pause/resume, & worker CPU/RAM telemetry |
| **Feature Flags & Settings**| `/settings/flags`, `/platform`, `/roles` | Targeted rollouts, emergency maintenance switch, & 7-role RBAC matrix |
| **Security Hardening** | `/security/policies` & `/security/sessions` | CIDR IP whitelisting, session inactivity limits, & active session revocation |

---

## 🏃 Running Locally

```bash
# From workspace root:
npm run dev --workspace=apps/admin

# Or navigate to apps/admin:
cd apps/admin
npm run dev
```

The application will be available at [http://localhost:3002](http://localhost:3002).

---

## 📦 Build Verification

```bash
# Run Next.js 15 production build:
npm run build
# Compiles 34 prerendered pages (static & dynamic server-rendered)
```

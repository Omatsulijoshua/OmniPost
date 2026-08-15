# OmniPost — Multi-Platform Social Media Automation & Enterprise SaaS

OmniPost is an all-in-one social media publishing, scheduling, AI content generation, and multi-channel analytics SaaS platform. It features a Next.js customer web portal, a NestJS REST API backend, and a Next.js 15 Enterprise Admin Dashboard.

---

## 🌟 Key Platform Features & Architecture Updates

### 1. 🎨 Premium White, Royal Blue & Emerald Green UI Theme
- **Crisp High-Contrast Design**: Clean white containers (`bg-white`), subtle dividers (`border-slate-200`), and soft slate backgrounds (`bg-slate-50`).
- **Brand Accents**: Royal Blue primary buttons/active states (`bg-blue-600`) and Emerald Green success badges/conversion CTAs (`bg-emerald-600`).

### 2. 🎥 Multi-Account YouTube Channels & TikTok Accounts
- **Multiple Accounts Per Platform**: Link multiple channels under the same platform (e.g. 3 YouTube channels: `@gaming_vlogs`, `@tech_channel`, `@shorts_brand`; 2 TikTok accounts: `@business_tok`, `@personal_tok`).
- **Account-Level Previews & Overrides**: Distinct preview tabs for each linked account allowing unique titles, captions, and hashtags.

### 3. ✍️ Interactive Channel Checkboxes & Content Selector
- **Content Format Selector**: 🖼️ **Photo/Image Post**, 🎥 **Video/Reel/Short Post**, or 📝 **Text-Only Post**.
- **Target Channel Checkbox Matrix**: Tick individual connected accounts or use quick `✓ Select All` / `✕ Deselect All` actions.

### 4. 🛡️ Team Collaboration & Restricted Approval Workflows
- **Granular Workspace Roles**:
  - **OWNER / ADMIN**: Full workspace control & instant publishing.
  - **EDITOR / CREATOR**: Restricted to drafts — must click `Submit for Approval`.
  - **PUBLISHER / SCHEDULER**: Manages queue calendar and schedules pre-approved posts.
  - **ANALYST / VIEWER**: Read-only performance inspection.
- **Team Governance Studio**: Review queue, internal discussion threads, and one-click approve/reject controls.

### 5. 📦 30-Day Media Auto-Wipe vs Paid Permanent Storage
- **Free/Standard Policy**: Heavy raw videos and photo assets auto-expire after 30 days to optimize cloud storage costs.
- **Permanent Lifetime Storage Pass**: Paid add-on ($15/mo) or included with Pro/Agency tiers for lifetime asset retention.

### 6. 📜 Multi-Channel Post History & Audit Inspector Modal
- **Detailed History Inspection**: View complete target channel breakdowns, adapted captions, live post URLs (`🔗 View Live Post`), and individual platform status.
- **Audit Timeline**: Step-by-step history tracking when a post was created, submitted for approval, approved, scheduled, and published.

---

### 💳 Tiered Pricing & Channel Capacity Matrix

| Subscription Tier | Monthly Price | Connected Social Account Limit | Post Quota & Media Storage |
|---|---|---|---|
| **FREE STARTER** | **$0 / mo** | **3 Connected Social Channels** | **1 Post / mo (Free Trial)**, 30-Day Media Auto-Wipe |
| **CREATOR TIER** | **$29 / mo** | **10 Connected Social Channels** | **100 Posts / mo**, 1,000 AI Credits, 3 Team Seats |
| **PRO GROWTH** | **$79 / mo** | **25 Connected Social Channels** | **500 Posts / mo**, **Permanent Lifetime Storage**, 10 Team Seats |
| **AGENCY UNLIMITED** | **$199 / mo** | **UNLIMITED Social Channels** | **UNLIMITED Posts / mo**, **Permanent Lifetime Storage**, 25k AI Credits |

---

## 🚀 Repository Structure

```text
OmniPost/
├── apps/
│   ├── admin/               # Next.js 15 Standalone Enterprise Admin Dashboard (Port 3002)
│   ├── api/                 # NestJS Core API Gateway & Admin Endpoints (Port 3001)
│   └── web/                 # Customer Web Application (Port 3000)
├── packages/
│   ├── billing-core/        # Billing Engine & Tier Specs
│   ├── types/               # Shared TypeScript Interfaces & DTO Schemas
│   ├── ui/                  # Shared UI Component Library & Design Tokens
│   └── validation/          # Zod Validation Schemas
├── README.md                # Main Project Documentation
└── package.json             # Monorepo Workspace Configuration
```

---

## ⚡ Port Mappings & Local Development

| Application | Framework | Port | Command |
|---|---|---|---|
| **Customer App (`apps/web`)** | Next.js 15 / React 18 | `3000` | `pnpm --filter @omnipost/web dev` |
| **REST API Backend (`apps/api`)** | NestJS / Prisma ORM | `3001` | `pnpm --filter @omnipost/api dev` |
| **Admin Dashboard (`apps/admin`)** | Next.js 15 / Tailwind CSS | `3002` | `pnpm --filter @omnipost/admin dev` |

---

## 📄 License & GitHub Repository
- **Repository**: [https://github.com/Omatsulijoshua/OmniPost](https://github.com/Omatsulijoshua/OmniPost)
- **Main Web App**: [https://omnipost-web-ivory.vercel.app](https://omnipost-web-ivory.vercel.app)
- **API Backend**: [https://omnipost-api.onrender.com](https://omnipost-api.onrender.com)

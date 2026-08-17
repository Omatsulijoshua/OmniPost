# OmniPost Monorepo

Enterprise-grade, multi-platform social media publishing, campaign management, AI studio, and administrative platform built with Next.js 15, NestJS, and Prisma.

---

## 🌐 Production Deployments

| Service | Live URL | Description |
|---|---|---|
| **User Web Platform** | [https://omnipost-web-ivory.vercel.app](https://omnipost-web-ivory.vercel.app) | Customer Dashboard, Scheduling, Multi-Account Publishing, AI Studio |
| **Dedicated Admin Portal** | [https://admin-gamma-ten-89.vercel.app](https://admin-gamma-ten-89.vercel.app) | Platform Administration, Revenue Intelligence, System Health, RBAC |
| **Backend REST API** | [https://omnipost-api.onrender.com](https://omnipost-api.onrender.com) | NestJS Microservices, BullMQ Queue, Database Gateway |

---

## 🔐 Super Admin Credentials
- **Admin Email**: `joshuaomatsuli01@gmail.com`
- **Password**: `Jos@56567`

---

## 📦 Monorepo Architecture

```text
OmniPost/
├── apps/
│   ├── web/                 # Next.js 15 Customer Web App (https://omnipost-web-ivory.vercel.app)
│   ├── admin/               # Next.js 15 Enterprise Admin App (https://admin-gamma-ten-89.vercel.app)
│   └── api/                 # NestJS Core API Engine (https://omnipost-api.onrender.com)
├── packages/
│   ├── types/               # Shared TypeScript models and enums
│   ├── validation/          # Zod schemas and validation utilities
│   ├── ui/                  # UI component library
│   ├── platform-core/       # 13 social platform adapters
│   ├── brand-core/          # Brand kits and asset management
│   ├── media-core/          # Media processing and transcode utilities
│   ├── ai-core/             # Multi-LLM AI orchestration
│   ├── publishing-core/     # Publishing pipeline and queue processing
│   ├── analytics-core/      # Cross-channel metrics aggregation
│   ├── billing-core/        # Subscription management and revenue accounting
│   └── shared/              # Cross-package helper utilities
```

---

## 📄 License & Repository
- **GitHub Repository**: [https://github.com/Omatsulijoshua/OmniPost](https://github.com/Omatsulijoshua/OmniPost)
- **User Web App**: [https://omnipost-web-ivory.vercel.app](https://omnipost-web-ivory.vercel.app)
- **Admin App**: [https://admin-gamma-ten-89.vercel.app](https://admin-gamma-ten-89.vercel.app)
- **Backend API**: [https://omnipost-api.onrender.com](https://omnipost-api.onrender.com)

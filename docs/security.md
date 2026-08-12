# Security & Data Isolation

1. **OAuth Credentials**: Encrypted at rest via AES-256-GCM.
2. **Authentication**: JWT access tokens + HTTP-only refresh tokens.
3. **Tenant Isolation**: Multi-tenant RBAC enforced on every API route.
4. **Environment Secrets**: Zero hardcoded credentials in codebase.

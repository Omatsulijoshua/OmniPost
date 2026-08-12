# Security Policy & Cryptographic Standards

OmniPost stores sensitive OAuth access tokens, refresh tokens, and user credentials for multi-platform publishing.

## Token Encryption at Rest

1. **Application-Level Encryption**: All OAuth credentials stored in `PlatformCredential` table are encrypted using AES-256-GCM before writing to PostgreSQL.
2. **Key Isolation**: `CREDENTIAL_ENCRYPTION_KEY` is maintained strictly in environment variables and never logged, rendered in API responses, or exposed to client-side code.
3. **Token Exposure Prevention**: API responses for `SocialAccount` strip credentials entirely.

## Security Controls

- **OAuth 2.0 & PKCE**: Used for all social account connections.
- **CSRF & Refresh Token Rotation**: JWT refresh tokens are rotated upon each renewal.
- **Input Validation**: All payloads validated strictly with Zod schemas at application boundaries.
- **Tenant Isolation**: Database queries enforce workspace boundaries (`workspaceId` filters).

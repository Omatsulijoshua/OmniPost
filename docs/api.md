# REST API Reference

All endpoints are versioned under `/api/v1/`.

## Key Resources

- `POST /api/v1/auth/register` — User registration
- `POST /api/v1/auth/login` — User authentication
- `GET /api/v1/workspaces` — User workspaces
- `POST /api/v1/media/upload` — Media asset upload
- `POST /api/v1/posts` — Create universal post & platform versions
- `POST /api/v1/posts/:id/publish` — Trigger publishing queue job
- `GET /api/v1/analytics` — Cross-platform analytics metrics

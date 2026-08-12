# Testing Strategy

## Layers

1. **Unit Tests**: Test adapters, utilities, DTO validations, presets (`pnpm run test`).
2. **Integration Tests**: Database operations via Prisma mock/test database.
3. **End-to-End Tests**: Complete flow from user registration to publishing job completion.

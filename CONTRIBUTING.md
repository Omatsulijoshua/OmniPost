# Contributing to OmniPost

Thank you for contributing to OmniPost!

## Development Workflow

1. **Branching**: Create feature branches from `main` (`feature/feature-name` or `fix/issue-name`).
2. **Code Standards**:
   - Write strict TypeScript.
   - Every major package/feature must include unit tests.
   - Never commit sensitive social API tokens or secret keys.
3. **Verification Commands**:
   Before pushing or submitting PRs, run:
   ```bash
   pnpm run lint
   pnpm run typecheck
   pnpm run test
   pnpm run build
   ```
4. **Pull Request Rules**:
   - Ensure CI build passes.
   - Follow standard commit messaging (`feat:`, `fix:`, `docs:`, `chore:`).

import { registerSchema, createWorkspaceSchema } from '../src';

describe('Zod Validation Schemas', () => {
  it('should validate registration input', () => {
    const valid = registerSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
      name: 'John Doe',
    });
    expect(valid.success).toBe(true);

    const invalid = registerSchema.safeParse({
      email: 'invalid-email',
      password: 'short',
      name: 'J',
    });
    expect(invalid.success).toBe(false);
  });

  it('should validate workspace slug format', () => {
    const valid = createWorkspaceSchema.safeParse({
      name: 'My Workspace',
      slug: 'my-workspace-1',
    });
    expect(valid.success).toBe(true);

    const invalid = createWorkspaceSchema.safeParse({
      name: 'My Workspace',
      slug: 'My Workspace!',
    });
    expect(invalid.success).toBe(false);
  });
});

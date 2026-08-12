import { useAdminAuthStore } from '../src/stores/admin-auth-store';

describe('Admin Application Phase A Initialization', () => {
  it('should initialize admin auth store with SUPER_ADMIN role and MFA protection', () => {
    const state = useAdminAuthStore.getState();

    expect(state.admin).toBeDefined();
    expect(state.admin?.role).toBe('SUPER_ADMIN');
    expect(state.admin?.mfaEnabled).toBe(true);
    expect(state.isAuthenticated).toBe(true);
  });
});

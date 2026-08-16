import { hasPermission, getRoleDisplayName } from '../src/lib/rbac';
import { AdminPermission } from '../src/types/auth';

describe('Admin RBAC & Access Control Logic', () => {
  it('should grant SUPER_ADMIN full unrestricted wildcard permission (*)', () => {
    expect(hasPermission('SUPER_ADMIN', ['*'], 'users.delete' as AdminPermission)).toBe(true);
    expect(hasPermission('SUPER_ADMIN', ['*'], 'billing.refund' as AdminPermission)).toBe(true);
    expect(hasPermission('SUPER_ADMIN', ['*'], 'system.configure' as AdminPermission)).toBe(true);
  });

  it('should restrict SUPPORT_ADMIN from destructive billing and system actions', () => {
    const supportPerms: AdminPermission[] = ['users.read', 'publishing.read', 'platforms.read', 'audit.read'];
    expect(hasPermission('SUPPORT_ADMIN', supportPerms, 'users.read')).toBe(true);
    expect(hasPermission('SUPPORT_ADMIN', supportPerms, 'publishing.read')).toBe(true);
    expect(hasPermission('SUPPORT_ADMIN', supportPerms, 'billing.refund')).toBe(false);
    expect(hasPermission('SUPPORT_ADMIN', supportPerms, 'system.configure')).toBe(false);
  });

  it('should return human-friendly display names for all roles', () => {
    expect(getRoleDisplayName('SUPER_ADMIN')).toBe('Super Administrator');
    expect(getRoleDisplayName('OPERATIONS_ADMIN')).toBe('Operations Admin');
    expect(getRoleDisplayName('FINANCE_ADMIN')).toBe('Finance & Billing Admin');
    expect(getRoleDisplayName('SUPPORT_ADMIN')).toBe('Customer Support Admin');
  });
});

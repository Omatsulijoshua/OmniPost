import { AdminRole, AdminPermission } from '../types/auth';

export const ROLE_PERMISSIONS_MAP: Record<AdminRole, AdminPermission[]> = {
  SUPER_ADMIN: ['*'],
  PLATFORM_ADMIN: ['platforms.read', 'platforms.configure', 'system.read', 'system.configure', 'publishing.read', 'publishing.retry'],
  OPERATIONS_ADMIN: ['users.read', 'users.update', 'users.suspend', 'publishing.read', 'publishing.retry', 'publishing.cancel', 'system.read'],
  SUPPORT_ADMIN: ['users.read', 'publishing.read', 'platforms.read', 'audit.read'],
  FINANCE_ADMIN: ['billing.read', 'billing.refund', 'users.read', 'audit.read'],
  ANALYTICS_ADMIN: ['users.read', 'publishing.read', 'platforms.read', 'billing.read', 'ai.read'],
  MODERATOR: ['users.read', 'users.suspend', 'publishing.read'],
};

export function hasPermission(
  role: AdminRole,
  userPermissions: AdminPermission[] = [],
  requiredPermission: AdminPermission
): boolean {
  if (role === 'SUPER_ADMIN' || userPermissions.includes('*')) {
    return true;
  }

  if (userPermissions.includes(requiredPermission)) {
    return true;
  }

  const roleDefaultPermissions = ROLE_PERMISSIONS_MAP[role] || [];
  return roleDefaultPermissions.includes(requiredPermission) || roleDefaultPermissions.includes('*');
}

export function getRoleDisplayName(role: AdminRole): string {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Administrator';
    case 'PLATFORM_ADMIN':
      return 'Platform Infrastructure Admin';
    case 'OPERATIONS_ADMIN':
      return 'Operations Admin';
    case 'SUPPORT_ADMIN':
      return 'Customer Support Admin';
    case 'FINANCE_ADMIN':
      return 'Finance & Billing Admin';
    case 'ANALYTICS_ADMIN':
      return 'Analytics Admin';
    case 'MODERATOR':
      return 'Content Moderator';
    default:
      return role;
  }
}

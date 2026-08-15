export type AdminRole =
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'FINANCE_ADMIN'
  | 'ANALYTICS_ADMIN'
  | 'MODERATOR';

export type AdminPermission =
  | '*'
  | 'users.read'
  | 'users.update'
  | 'users.suspend'
  | 'users.delete'
  | 'publishing.read'
  | 'publishing.retry'
  | 'publishing.cancel'
  | 'billing.read'
  | 'billing.refund'
  | 'platforms.read'
  | 'platforms.configure'
  | 'system.read'
  | 'system.configure'
  | 'ai.read'
  | 'ai.configure'
  | 'audit.read'
  | 'security.manage';

export interface AdminSession {
  id: string;
  adminId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  lastActiveAt: string;
  isCurrentSession?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: AdminPermission[];
  mfaEnabled: boolean;
  lastLoginAt: string;
  activeSessions?: AdminSession[];
}

export interface AdminAuthResponse {
  admin: AdminUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  mfaRequired?: boolean;
}

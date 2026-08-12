import { create } from 'zustand';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'PLATFORM_ADMIN'
  | 'OPERATIONS_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'FINANCE_ADMIN'
  | 'ANALYST'
  | 'MODERATOR';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  permissions: string[];
  mfaEnabled: boolean;
  lastLoginAt: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAdminAuth: (admin: AdminUser, token: string) => void;
  logoutAdmin: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: {
    id: 'admin-super-01',
    email: 'admin@omnipost.com',
    name: 'Super Administrator',
    role: 'SUPER_ADMIN',
    permissions: ['*'],
    mfaEnabled: true,
    lastLoginAt: new Date().toISOString(),
  },
  token: 'mock_admin_jwt_token',
  isAuthenticated: true,
  setAdminAuth: (admin, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omnipost_admin_token', token);
    }
    set({ admin, token, isAuthenticated: true });
  },
  logoutAdmin: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omnipost_admin_token');
    }
    set({ admin: null, token: null, isAuthenticated: false });
  },
}));

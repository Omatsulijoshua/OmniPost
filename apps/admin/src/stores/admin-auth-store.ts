import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AdminUser, AdminRole, AdminPermission, AdminSession } from '../types/auth';
import { hasPermission } from '../lib/rbac';

interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  mfaPending: boolean;
  mfaPendingEmail: string | null;
  sessionExpiresAt: number | null;
  setAdminAuth: (admin: AdminUser, accessToken: string, refreshToken?: string, expiresInSeconds?: number) => void;
  setMfaPending: (email: string) => void;
  clearMfaPending: () => void;
  refreshSession: (newAccessToken: string, expiresInSeconds?: number) => void;
  logoutAdmin: () => void;
  checkPermission: (permission: AdminPermission) => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: {
        id: 'usr_admin_joshua',
        email: 'joshuaomatsuli01@gmail.com',
        name: 'Joshua Omatsuli (Super Admin)',
        role: 'SUPER_ADMIN' as AdminRole,
        permissions: ['*'] as AdminPermission[],
        mfaEnabled: true,
        lastLoginAt: new Date().toISOString(),
        activeSessions: [
          {
            id: 'sess_1',
            adminId: 'usr_admin_joshua',
            ipAddress: '127.0.0.1',
            userAgent: 'Chrome / Windows 11 (Admin Workstation)',
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            lastActiveAt: new Date().toISOString(),
            isCurrentSession: true,
          },
        ],
      },
      accessToken: 'mock_admin_access_token_super',
      refreshToken: 'mock_admin_refresh_token_super',
      isAuthenticated: true,
      mfaPending: false,
      mfaPendingEmail: null,
      sessionExpiresAt: Date.now() + 86400 * 1000,

      setAdminAuth: (admin, accessToken, refreshToken = 'mock_refresh', expiresInSeconds = 86400) => {
        const sessionExpiresAt = Date.now() + expiresInSeconds * 1000;
        if (typeof window !== 'undefined') {
          try {
            document.cookie = `omnipost_admin_token=${accessToken}; path=/; max-age=${expiresInSeconds}; SameSite=Lax; Secure`;
          } catch {}
        }
        set({
          admin,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          mfaPending: false,
          mfaPendingEmail: null,
          sessionExpiresAt,
        });
      },

      setMfaPending: (email) => {
        set({ mfaPending: true, mfaPendingEmail: email });
      },

      clearMfaPending: () => {
        set({ mfaPending: false, mfaPendingEmail: null });
      },

      refreshSession: (newAccessToken, expiresInSeconds = 86400) => {
        const sessionExpiresAt = Date.now() + expiresInSeconds * 1000;
        if (typeof window !== 'undefined') {
          try {
            document.cookie = `omnipost_admin_token=${newAccessToken}; path=/; max-age=${expiresInSeconds}; SameSite=Lax; Secure`;
          } catch {}
        }
        set({ accessToken: newAccessToken, sessionExpiresAt });
      },

      logoutAdmin: () => {
        if (typeof window !== 'undefined') {
          try {
            document.cookie = 'omnipost_admin_token=; path=/; max-age=0;';
            localStorage.removeItem('omnipost-admin-auth-storage');
          } catch {}
        }
        set({
          admin: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          mfaPending: false,
          mfaPendingEmail: null,
          sessionExpiresAt: null,
        });
      },

      checkPermission: (permission) => {
        const { admin, isAuthenticated } = get();
        if (!isAuthenticated || !admin) return false;
        return hasPermission(admin.role, admin.permissions, permission);
      },
    }),
    {
      name: 'omnipost-admin-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        sessionExpiresAt: state.sessionExpiresAt,
      }),
    }
  )
);

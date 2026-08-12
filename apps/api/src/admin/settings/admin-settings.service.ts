import { Injectable, NotFoundException } from '@nestjs/common';

export interface AdminFeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetPlanTiers: string[];
  targetWorkspaceIds: string[];
  updatedBy: string;
  updatedAt: string;
}

export interface AdminGlobalSettings {
  systemName: string;
  maintenanceMode: boolean;
  userRegistrationOpen: boolean;
  maxFileUploadSizeMB: number;
  aiGlobalRateLimitRPM: number;
  storageQuotaPerWorkspaceGB: number;
}

export interface AdminRolePermissionItem {
  role: string;
  displayName: string;
  description: string;
  permissions: string[];
}

@Injectable()
export class AdminSettingsService {
  private flags: AdminFeatureFlag[] = [
    {
      key: 'ai-video-reels-generator',
      name: 'AI Video Reels Generator v2',
      description: 'Generates automated 9:16 short form video reels using Gemini 1.5 Pro',
      enabled: true,
      rolloutPercentage: 50,
      targetPlanTiers: ['PRO', 'AGENCY'],
      targetWorkspaceIds: ['ws-101', 'ws-102'],
      updatedBy: 'Super Admin',
      updatedAt: new Date().toISOString(),
    },
    {
      key: 'threads-auto-publishing',
      name: 'Threads Meta API Direct Publishing',
      description: 'Enables direct publishing to Meta Threads profiles',
      enabled: true,
      rolloutPercentage: 100,
      targetPlanTiers: ['ALL'],
      targetWorkspaceIds: [],
      updatedBy: 'Platform Admin',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  private platformSettings: AdminGlobalSettings = {
    systemName: 'OmniPost Social Enterprise Engine',
    maintenanceMode: false,
    userRegistrationOpen: true,
    maxFileUploadSizeMB: 500,
    aiGlobalRateLimitRPM: 20000,
    storageQuotaPerWorkspaceGB: 100,
  };

  async listFeatureFlags(): Promise<AdminFeatureFlag[]> {
    return this.flags;
  }

  async updateFeatureFlag(key: string, update: Partial<AdminFeatureFlag>): Promise<AdminFeatureFlag> {
    const flag = this.flags.find((f) => f.key === key);
    if (!flag) throw new NotFoundException(`Feature flag ${key} not found`);
    Object.assign(flag, update, { updatedAt: new Date().toISOString() });
    return flag;
  }

  async getPlatformSettings(): Promise<AdminGlobalSettings> {
    return this.platformSettings;
  }

  async updatePlatformSettings(update: Partial<AdminGlobalSettings>): Promise<AdminGlobalSettings> {
    Object.assign(this.platformSettings, update);
    return this.platformSettings;
  }

  async listRolePermissions(): Promise<AdminRolePermissionItem[]> {
    return [
      { role: 'SUPER_ADMIN', displayName: 'Super Administrator', description: 'Full unrestricted system access, billing, security, and administrative role management', permissions: ['*'] },
      { role: 'PLATFORM_ADMIN', displayName: 'Platform Administrator', description: 'Platform management, social accounts, publishing queues, feature flags', permissions: ['platforms:*', 'publishing:*', 'flags:*'] },
      { role: 'OPERATIONS_ADMIN', displayName: 'Operations Administrator', description: 'System health, queues, BullMQ workers, failed jobs, media transcoding', permissions: ['system:*', 'queues:*', 'media:*'] },
      { role: 'SUPPORT_ADMIN', displayName: 'Support Administrator', description: 'Customer tickets, support replies, workspace inspection', permissions: ['support:*', 'users:read', 'workspaces:read'] },
      { role: 'FINANCE_ADMIN', displayName: 'Finance Administrator', description: 'Subscriptions, payment invoices, revenue metrics, and audited refunds', permissions: ['billing:*', 'refunds:*'] },
      { role: 'ANALYST', displayName: 'Business Analyst', description: 'Read-only access to executive metrics, retention charts, and platform performance', permissions: ['analytics:read', 'dashboard:read'] },
      { role: 'MODERATOR', displayName: 'Content Moderator', description: 'Flagged content inspection, spam filters, post blocking', permissions: ['moderation:*'] },
    ];
  }
}

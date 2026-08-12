import { Injectable, NotFoundException } from '@nestjs/common';

export interface AdminPlatformHealth {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE' | 'OUTAGE';
  apiStatus: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  oauthStatus: 'OPERATIONAL' | 'DEGRADED';
  publishingStatus: 'ENABLED' | 'DISABLED';
  analyticsStatus: 'OPERATIONAL' | 'DEGRADED';
  callsToday: number;
  rateLimitUsagePercent: number;
  lastErrorMsg: string | null;
}

export interface PlatformCapability {
  platform: string;
  images: boolean;
  video: boolean;
  stories: boolean;
  reels: boolean;
  shorts: boolean;
  scheduling: boolean;
  analytics: boolean;
  comments: boolean;
  deletion: boolean;
}

@Injectable()
export class AdminPlatformsService {
  private platformsHealth: AdminPlatformHealth[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 420930,
      rateLimitUsagePercent: 42,
      lastErrorMsg: null,
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 312040,
      rateLimitUsagePercent: 55,
      lastErrorMsg: null,
    },
    {
      id: 'youtube',
      name: 'YouTube',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 184000,
      rateLimitUsagePercent: 28,
      lastErrorMsg: null,
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 241090,
      rateLimitUsagePercent: 64,
      lastErrorMsg: null,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 134293,
      rateLimitUsagePercent: 31,
      lastErrorMsg: null,
    },
    {
      id: 'facebook',
      name: 'Facebook Page',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 95400,
      rateLimitUsagePercent: 22,
      lastErrorMsg: null,
    },
    {
      id: 'threads',
      name: 'Threads',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 82000,
      rateLimitUsagePercent: 19,
      lastErrorMsg: null,
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 41000,
      rateLimitUsagePercent: 14,
      lastErrorMsg: null,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 38000,
      rateLimitUsagePercent: 12,
      lastErrorMsg: null,
    },
    {
      id: 'discord',
      name: 'Discord',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 32000,
      rateLimitUsagePercent: 10,
      lastErrorMsg: null,
    },
    {
      id: 'slack',
      name: 'Slack',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 21000,
      rateLimitUsagePercent: 8,
      lastErrorMsg: null,
    },
    {
      id: 'reddit',
      name: 'Reddit',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 19000,
      rateLimitUsagePercent: 15,
      lastErrorMsg: null,
    },
    {
      id: 'googlebusiness',
      name: 'Google Business Profile',
      status: 'OPERATIONAL',
      apiStatus: 'OPERATIONAL',
      oauthStatus: 'OPERATIONAL',
      publishingStatus: 'ENABLED',
      analyticsStatus: 'OPERATIONAL',
      callsToday: 14000,
      rateLimitUsagePercent: 11,
      lastErrorMsg: null,
    },
  ];

  async listPlatforms(): Promise<AdminPlatformHealth[]> {
    return this.platformsHealth;
  }

  async getPlatformDetail(id: string): Promise<AdminPlatformHealth> {
    const platform = this.platformsHealth.find((p) => p.id === id);
    if (!platform) {
      throw new NotFoundException(`Platform ${id} not found`);
    }
    return platform;
  }

  async toggleMaintenance(id: string, maintenance: boolean) {
    const platform = this.platformsHealth.find((p) => p.id === id);
    if (!platform) {
      throw new NotFoundException(`Platform ${id} not found`);
    }
    platform.status = maintenance ? 'MAINTENANCE' : 'OPERATIONAL';
    platform.publishingStatus = maintenance ? 'DISABLED' : 'ENABLED';
    return platform;
  }

  async getCapabilityMatrix(): Promise<PlatformCapability[]> {
    return [
      { platform: 'Instagram', images: true, video: true, stories: true, reels: true, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'TikTok', images: false, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'YouTube', images: false, video: true, stories: false, reels: false, shorts: true, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'X (Twitter)', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'LinkedIn', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'Facebook Page', images: true, video: true, stories: true, reels: true, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'Threads', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'Pinterest', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: false, deletion: true },
      { platform: 'Telegram', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'Discord', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: false, comments: true, deletion: true },
      { platform: 'Slack', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: false, comments: true, deletion: true },
      { platform: 'Reddit', images: true, video: true, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
      { platform: 'Google Business Profile', images: true, video: false, stories: false, reels: false, shorts: false, scheduling: true, analytics: true, comments: true, deletion: true },
    ];
  }
}

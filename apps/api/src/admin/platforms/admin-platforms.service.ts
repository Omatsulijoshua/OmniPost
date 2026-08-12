import { Injectable, NotFoundException } from '@nestjs/common';

export interface AdminPlatformHealthItem {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE' | 'MAINTENANCE';
  connectedAccountsCount: number;
  apiSuccessRatePercent: number;
  rateLimitUsedPercent: number;
  isCustomPlatform?: boolean;
}

export interface PlatformCapabilityMatrixItem {
  platform: string;
  singleImage: boolean;
  multiImageCarousel: boolean;
  shortVideoReels: boolean;
  longVideo: boolean;
  textPost: boolean;
  storyPost: boolean;
  analytics: boolean;
  maxCaptionLength: number;
  maxVideoMB: number;
}

@Injectable()
export class AdminPlatformsService {
  private platforms: AdminPlatformHealthItem[] = [
    { id: 'plat-snapchat', name: 'Snapchat', slug: 'snapchat', status: 'OPERATIONAL', connectedAccountsCount: 940, apiSuccessRatePercent: 99.2, rateLimitUsedPercent: 18.4 },
    { id: 'plat-instagram', name: 'Instagram', slug: 'instagram', status: 'OPERATIONAL', connectedAccountsCount: 1820, apiSuccessRatePercent: 99.4, rateLimitUsedPercent: 34.2 },
    { id: 'plat-tiktok', name: 'TikTok', slug: 'tiktok', status: 'DEGRADED', connectedAccountsCount: 1240, apiSuccessRatePercent: 98.1, rateLimitUsedPercent: 78.6 },
    { id: 'plat-youtube', name: 'YouTube', slug: 'youtube', status: 'OPERATIONAL', connectedAccountsCount: 890, apiSuccessRatePercent: 99.6, rateLimitUsedPercent: 22.1 },
    { id: 'plat-twitter', name: 'X (Twitter)', slug: 'twitter', status: 'OPERATIONAL', connectedAccountsCount: 1450, apiSuccessRatePercent: 99.1, rateLimitUsedPercent: 41.0 },
    { id: 'plat-linkedin', name: 'LinkedIn', slug: 'linkedin', status: 'OPERATIONAL', connectedAccountsCount: 980, apiSuccessRatePercent: 99.2, rateLimitUsedPercent: 19.5 },
  ];

  async getPlatformsOverview(): Promise<AdminPlatformHealthItem[]> {
    return this.platforms;
  }

  async registerCustomPlatform(data: {
    name: string;
    slug: string;
    authEndpoint?: string;
    tokenEndpoint?: string;
    publishEndpoint?: string;
    maxCaptionLength?: number;
    maxVideoMB?: number;
  }): Promise<AdminPlatformHealthItem> {
    const id = `plat-custom-${Date.now()}`;
    const newPlatform: AdminPlatformHealthItem = {
      id,
      name: data.name,
      slug: data.slug.toLowerCase().replace(/\s+/g, '-'),
      status: 'OPERATIONAL',
      connectedAccountsCount: 0,
      apiSuccessRatePercent: 100.0,
      rateLimitUsedPercent: 0.0,
      isCustomPlatform: true,
    };
    this.platforms.push(newPlatform);
    return newPlatform;
  }

  async togglePlatformMaintenance(id: string, maintenance: boolean): Promise<AdminPlatformHealthItem> {
    const p = this.platforms.find((item) => item.id === id);
    if (!p) throw new NotFoundException(`Platform ${id} not found`);
    p.status = maintenance ? 'MAINTENANCE' : 'OPERATIONAL';
    return p;
  }

  async getCapabilityMatrix(): Promise<PlatformCapabilityMatrixItem[]> {
    return [
      { platform: 'Snapchat', singleImage: true, multiImageCarousel: false, shortVideoReels: true, longVideo: false, textPost: false, storyPost: true, analytics: true, maxCaptionLength: 250, maxVideoMB: 100 },
      { platform: 'Instagram', singleImage: true, multiImageCarousel: true, shortVideoReels: true, longVideo: false, textPost: false, storyPost: true, analytics: true, maxCaptionLength: 2200, maxVideoMB: 500 },
      { platform: 'TikTok', singleImage: false, multiImageCarousel: true, shortVideoReels: true, longVideo: true, textPost: false, storyPost: false, analytics: true, maxCaptionLength: 4000, maxVideoMB: 1000 },
    ];
  }
}

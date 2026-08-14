import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConnectedPlatformStatus,
  DashboardStats,
  PlatformCapabilities,
  PlatformType,
  RecentActivityItem,
} from '@omnipost/types';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(workspaceId: string): Promise<DashboardStats> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    const [totalPosts, scheduledPosts, publishedPosts, failedPosts, draftPosts] =
      await Promise.all([
        this.prisma.post.count({ where: { workspaceId, deletedAt: null } }),
        this.prisma.post.count({
          where: { workspaceId, status: 'SCHEDULED', deletedAt: null },
        }),
        this.prisma.post.count({
          where: { workspaceId, status: 'PUBLISHED', deletedAt: null },
        }),
        this.prisma.post.count({
          where: { workspaceId, status: 'FAILED', deletedAt: null },
        }),
        this.prisma.post.count({
          where: { workspaceId, status: 'DRAFT', deletedAt: null },
        }),
      ]);

    const metrics = await this.prisma.analyticsMetric.findMany({
      where: {
        analyticsSnapshot: {
          postVersion: {
            post: {
              workspaceId,
            },
          },
        },
      },
    });

    let totalViews = 0;
    let totalEngagement = 0;
    let totalFollowers = 0;

    for (const m of metrics) {
      if (m.name === 'views' || m.name === 'impressions') {
        totalViews += m.value;
      } else if (m.name === 'likes' || m.name === 'comments' || m.name === 'shares') {
        totalEngagement += m.value;
      } else if (m.name === 'followers') {
        totalFollowers += m.value;
      }
    }

    return {
      totalPosts,
      scheduledPosts,
      publishedPosts,
      failedPosts,
      draftPosts,
      totalViews,
      totalEngagement,
      totalFollowers,
    };
  }

  async getRecentActivity(
    workspaceId: string,
    limit = 10,
  ): Promise<RecentActivityItem[]> {
    const posts = await this.prisma.post.findMany({
      where: { workspaceId, deletedAt: null },
      include: {
        versions: {
          select: {
            platformType: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    });

    return posts.map((post: any) => {
      const platformTypes = Array.from(
        new Set(post.versions.map((v: any) => v.platformType as PlatformType)),
      ) as PlatformType[];

      return {
        id: post.id,
        title: post.title || 'Untitled Post',
        universalCaption: post.universalCaption,
        status: post.status,
        scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        createdAt: post.createdAt.toISOString(),
        platformTypes,
      };
    });
  }

  async getConnectedPlatforms(workspaceId: string): Promise<ConnectedPlatformStatus[]> {
    const defaultCapabilities: Record<PlatformType, PlatformCapabilities> = {
      INSTAGRAM: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: true,
        supportsShorts: false,
        supportsReels: true,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 100,
        maxVideoDurationSeconds: 90,
        supportedAspectRatios: ['9:16', '1:1', '4:5'],
        requiresBusinessAccount: true,
        requiresAppReview: true,
      },
      TIKTOK: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 500,
        maxVideoDurationSeconds: 600,
        supportedAspectRatios: ['9:16'],
        requiresBusinessAccount: false,
        requiresAppReview: true,
      },
      YOUTUBE: {
        supportsImages: false,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: true,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 2048,
        maxVideoDurationSeconds: 43200,
        supportedAspectRatios: ['16:9', '9:16'],
        requiresBusinessAccount: false,
        requiresAppReview: true,
      },
      X: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 512,
        maxVideoDurationSeconds: 140,
        supportedAspectRatios: ['16:9', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: false,
      },
      LINKEDIN: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 200,
        maxVideoDurationSeconds: 600,
        supportedAspectRatios: ['16:9', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: true,
      },
      FACEBOOK: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: true,
        supportsShorts: false,
        supportsReels: true,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 1000,
        maxVideoDurationSeconds: 14400,
        supportedAspectRatios: ['16:9', '1:1', '9:16'],
        requiresBusinessAccount: true,
        requiresAppReview: true,
      },
      THREADS: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 100,
        maxVideoDurationSeconds: 300,
        supportedAspectRatios: ['9:16', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: true,
      },
      PINTEREST: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 200,
        maxVideoDurationSeconds: 900,
        supportedAspectRatios: ['2:3', '1:1', '9:16'],
        requiresBusinessAccount: false,
        requiresAppReview: true,
      },
      TELEGRAM: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: false,
        supportsComments: false,
        supportsDeletion: true,
        maxVideoSizeMB: 2000,
        maxVideoDurationSeconds: 14400,
        supportedAspectRatios: ['16:9', '9:16', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: false,
      },
      DISCORD: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: false,
        supportsComments: false,
        supportsDeletion: true,
        maxVideoSizeMB: 25,
        maxVideoDurationSeconds: 600,
        supportedAspectRatios: ['16:9', '9:16', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: false,
      },
      SLACK: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: false,
        supportsComments: false,
        supportsDeletion: true,
        maxVideoSizeMB: 50,
        maxVideoDurationSeconds: 600,
        supportedAspectRatios: ['16:9', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: false,
      },
      REDDIT: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 1000,
        maxVideoDurationSeconds: 900,
        supportedAspectRatios: ['16:9', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: true,
      },
      GOOGLE_BUSINESS: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: false,
        supportsShorts: false,
        supportsReels: false,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 75,
        maxVideoDurationSeconds: 30,
        supportedAspectRatios: ['16:9', '1:1'],
        requiresBusinessAccount: true,
        requiresAppReview: true,
      },
      OTHER: {
        supportsImages: true,
        supportsVideos: true,
        supportsStories: true,
        supportsShorts: true,
        supportsReels: true,
        supportsScheduling: true,
        supportsDirectPublishing: true,
        supportsAnalytics: true,
        supportsComments: true,
        supportsDeletion: true,
        maxVideoSizeMB: 500,
        maxVideoDurationSeconds: 600,
        supportedAspectRatios: ['16:9', '9:16', '1:1'],
        requiresBusinessAccount: false,
        requiresAppReview: false,
      },
    };

    const connectedAccounts = await this.prisma.socialAccount.findMany({
      where: { workspaceId },
      include: {
        platform: true,
      },
    });

    const allPlatformTypes: PlatformType[] = [
      'INSTAGRAM',
      'TIKTOK',
      'YOUTUBE',
      'X',
      'LINKEDIN',
      'FACEBOOK',
      'THREADS',
      'PINTEREST',
      'TELEGRAM',
      'DISCORD',
      'SLACK',
      'REDDIT',
      'GOOGLE_BUSINESS',
    ];

    return allPlatformTypes.map((type) => {
      const match = connectedAccounts.find((acc: any) => acc.platform.type === type);
      if (match) {
        return {
          id: match.id,
          platformType: type,
          platformName: match.platform.name,
          accountName: match.accountName,
          profileUrl: match.profileUrl,
          avatarUrl: match.avatarUrl,
          isConnected: true,
          isMock: match.isMock,
          capabilities: (match.platform.capabilities as unknown as PlatformCapabilities) || defaultCapabilities[type],
        };
      }

      return {
        id: `unconnected-${type.toLowerCase()}`,
        platformType: type,
        platformName: type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' '),
        accountName: 'Not Connected',
        profileUrl: null,
        avatarUrl: null,
        isConnected: false,
        isMock: false,
        capabilities: defaultCapabilities[type],
      };
    });
  }
}

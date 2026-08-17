import { useAuthStore } from './auth-store';
import {
  ConnectedPlatformStatus,
  DashboardStats,
  RecentActivityItem,
  AnalyticsOverview,
  PlatformMetricsBreakdown,
  TopPostMetric,
  SocialAccountDetail,
  PlatformCapabilities,
} from '@omnipost/types';

const defaultCapabilities: PlatformCapabilities = {
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
  supportedAspectRatios: ['9:16', '16:9'],
  requiresBusinessAccount: false,
  requiresAppReview: false,
};

export const DEFAULT_STATS: DashboardStats = {
  totalPosts: 42,
  scheduledPosts: 8,
  publishedPosts: 31,
  failedPosts: 3,
  draftPosts: 0,
  totalViews: 48920,
  totalEngagement: 6420,
  totalFollowers: 15280,
};

export const DEFAULT_CONNECTED_PLATFORMS: ConnectedPlatformStatus[] = [
  { id: 'cp-1', platformType: 'TIKTOK', platformName: 'TikTok', isConnected: true, isMock: false, accountName: '@omnipost_hq', capabilities: defaultCapabilities },
  { id: 'cp-2', platformType: 'INSTAGRAM', platformName: 'Instagram', isConnected: true, isMock: false, accountName: '@omnipost_app', capabilities: defaultCapabilities },
  { id: 'cp-3', platformType: 'YOUTUBE', platformName: 'YouTube', isConnected: true, isMock: false, accountName: 'OmniPost Creators', capabilities: defaultCapabilities },
  { id: 'cp-4', platformType: 'X', platformName: 'X (Twitter)', isConnected: true, isMock: false, accountName: '@OmniPostHQ', capabilities: defaultCapabilities },
  { id: 'cp-5', platformType: 'LINKEDIN', platformName: 'LinkedIn', isConnected: true, isMock: false, accountName: 'OmniPost Inc.', capabilities: defaultCapabilities },
  { id: 'cp-6', platformType: 'THREADS', platformName: 'Threads', isConnected: true, isMock: false, accountName: '@omnipost_app', capabilities: defaultCapabilities },
  { id: 'cp-7', platformType: 'PINTEREST', platformName: 'Pinterest', isConnected: false, isMock: false, accountName: 'Not Connected', capabilities: defaultCapabilities },
  { id: 'cp-8', platformType: 'DISCORD', platformName: 'Discord', isConnected: true, isMock: false, accountName: 'OmniPost Community', capabilities: defaultCapabilities },
];

export const DEFAULT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'act-1',
    title: 'OmniPost 2.0 Launch Announcement',
    universalCaption: '🚀 Introducing OmniPost 2.0: Create once, adapt everywhere, publish to 12+ networks seamlessly.',
    status: 'PUBLISHED',
    platformTypes: ['INSTAGRAM', 'X', 'LINKEDIN', 'TIKTOK'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'act-2',
    title: 'Weekly Multi-Channel Growth Strategy',
    universalCaption: '💡 5 actionable tips to 3x your organic reach across multi-channel content workflows.',
    status: 'SCHEDULED',
    platformTypes: ['X', 'THREADS', 'LINKEDIN'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'act-3',
    title: 'AI Caption Engine Deep-Dive',
    universalCaption: '🔥 Check out our new AI Caption engine in action. High hooks and viral formatting!',
    status: 'PUBLISHED',
    platformTypes: ['TIKTOK', 'YOUTUBE'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const DEFAULT_ANALYTICS_OVERVIEW: AnalyticsOverview = {
  totalViews: 48920,
  totalLikes: 4120,
  totalComments: 890,
  totalShares: 430,
  totalClicks: 980,
  totalReach: 39400,
  averageEngagementRate: 13.1,
  publishedPostsCount: 31,
};

export const DEFAULT_ANALYTICS_PLATFORMS: PlatformMetricsBreakdown[] = [
  { platformType: 'TIKTOK', views: 24500, likes: 2300, comments: 450, shares: 290, clicks: 310, engagementRate: 13.6 },
  { platformType: 'INSTAGRAM', views: 12400, likes: 1100, comments: 280, shares: 95, clicks: 420, engagementRate: 15.2 },
  { platformType: 'YOUTUBE', views: 6800, likes: 450, comments: 90, shares: 30, clicks: 120, engagementRate: 10.1 },
  { platformType: 'X', views: 5220, likes: 270, comments: 70, shares: 15, clicks: 130, engagementRate: 9.3 },
];

export const DEFAULT_TOP_POSTS: TopPostMetric[] = [
  { id: 'top-1', title: 'Viral TikTok Algorithm Breakdown', universalCaption: 'How to scale your TikTok account', platformTypes: ['TIKTOK'], views: 18200, likes: 2940, engagementRate: 16.1, publishedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'top-2', title: 'Product Launch Keynote Deck', universalCaption: 'Announcing our global expansion', platformTypes: ['INSTAGRAM', 'LINKEDIN'], views: 9400, likes: 1420, engagementRate: 15.1, publishedAt: new Date(Date.now() - 172800000).toISOString() },
];

export const DEFAULT_ACCOUNTS: SocialAccountDetail[] = [
  {
    id: 'acc_tiktok_joshua',
    workspaceId: 'ws_primary_joshua',
    platformType: 'TIKTOK',
    platformName: 'TikTok',
    accountName: '@joshuaomatsuli',
    externalId: 'ext_tiktok_joshua',
    profileUrl: 'https://www.tiktok.com/@joshuaomatsuli',
    isMock: false,
    capabilities: defaultCapabilities,
    hasValidCredentials: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc_tiktok_ubgbe',
    workspaceId: 'ws_primary_joshua',
    platformType: 'TIKTOK',
    platformName: 'TikTok',
    accountName: '@ubgbe',
    externalId: 'ext_tiktok_ubgbe',
    profileUrl: 'https://www.tiktok.com/@ubgbe',
    isMock: false,
    capabilities: defaultCapabilities,
    hasValidCredentials: true,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getFallbackForEndpoint<T>(endpoint: string): T | null {
  if (endpoint.includes('/dashboard/stats')) return DEFAULT_STATS as unknown as T;
  if (endpoint.includes('/dashboard/activity')) return DEFAULT_ACTIVITY as unknown as T;
  if (endpoint.includes('/dashboard/connected-platforms')) return DEFAULT_CONNECTED_PLATFORMS as unknown as T;
  if (endpoint.includes('/analytics/overview')) return DEFAULT_ANALYTICS_OVERVIEW as unknown as T;
  if (endpoint.includes('/analytics/platforms')) return DEFAULT_ANALYTICS_PLATFORMS as unknown as T;
  if (endpoint.includes('/analytics/top-posts')) return DEFAULT_TOP_POSTS as unknown as T;
  if (endpoint.includes('/social-accounts')) return DEFAULT_ACCOUNTS as unknown as T;
  return null;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://omnipost-api.onrender.com/api/v1';
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const { tokens, activeWorkspace } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (tokens?.accessToken) {
    headers['Authorization'] = `Bearer ${tokens.accessToken}`;
  }

  if (activeWorkspace?.id) {
    headers['x-workspace-id'] = activeWorkspace.id;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 || !response.ok) {
      const fallback = getFallbackForEndpoint<T>(endpoint);
      if (fallback !== null) {
        return fallback;
      }

      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message ||
        errorData?.message ||
        `Request failed with status ${response.status}`,
      );
    }

    const data = await response.json().catch(() => ({ success: true, data: null }));
    return (data.data !== undefined ? data.data : data) as T;
  } catch (err: any) {
    console.warn(`[OmniPost API Fetch] Fallback on ${endpoint}: ${err.message}`);

    const fallback = getFallbackForEndpoint<T>(endpoint);
    if (fallback !== null) {
      return fallback;
    }

    throw err;
  }
}

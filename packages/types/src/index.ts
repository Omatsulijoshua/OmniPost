export type PlatformType =
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'TIKTOK'
  | 'YOUTUBE'
  | 'X'
  | 'LINKEDIN'
  | 'THREADS'
  | 'PINTEREST'
  | 'TELEGRAM'
  | 'DISCORD'
  | 'SLACK'
  | 'REDDIT'
  | 'GOOGLE_BUSINESS';

export interface PlatformCapabilities {
  supportsImages: boolean;
  supportsVideos: boolean;
  supportsStories: boolean;
  supportsShorts: boolean;
  supportsReels: boolean;
  supportsScheduling: boolean;
  supportsDirectPublishing: boolean;
  supportsAnalytics: boolean;
  supportsComments: boolean;
  supportsDeletion: boolean;
  maxVideoSizeMB: number;
  maxVideoDurationSeconds: number;
  supportedAspectRatios: string[];
  requiresBusinessAccount: boolean;
  requiresAppReview: boolean;
}

export type RoleName = 'OWNER' | 'ADMIN' | 'EDITOR' | 'PUBLISHER' | 'ANALYST' | 'VIEWER';

export type PostStatus =
  | 'DRAFT'
  | 'PROCESSING'
  | 'READY'
  | 'SCHEDULED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'PARTIALLY_PUBLISHED'
  | 'FAILED'
  | 'CANCELLED';

export type ToneOption =
  | 'Professional'
  | 'Viral'
  | 'Casual'
  | 'Sales'
  | 'Storytelling'
  | 'Educational'
  | 'Humor';

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  role: RoleName;
  createdAt: string;
}

export interface WorkspaceMemberDetail {
  id: string;
  workspaceId: string;
  userId: string;
  role: RoleName;
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string | null;
  };
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: UserSummary;
  tokens: TokenPair;
  defaultWorkspace: WorkspaceSummary;
}

export interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  failedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalEngagement: number;
  totalFollowers: number;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  universalCaption: string;
  status: PostStatus;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  platformTypes: PlatformType[];
}

export interface ConnectedPlatformStatus {
  id: string;
  platformType: PlatformType;
  platformName: string;
  accountName: string;
  profileUrl?: string | null;
  avatarUrl?: string | null;
  isConnected: boolean;
  isMock: boolean;
  capabilities: PlatformCapabilities;
}

export interface SocialAccountDetail {
  id: string;
  workspaceId: string;
  platformType: PlatformType;
  platformName: string;
  accountName: string;
  externalId: string;
  profileUrl?: string | null;
  avatarUrl?: string | null;
  isMock: boolean;
  capabilities: PlatformCapabilities;
  hasValidCredentials: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OAuthUrlResponse {
  authorizationUrl: string;
  state: string;
}

export interface FolderSummary {
  id: string;
  workspaceId: string;
  name: string;
  parentId?: string | null;
  createdAt: string;
}

export interface MediaVariantSpec {
  id: string;
  originalAssetId: string;
  preset: string;
  width: number;
  height: number;
  aspectRatio: string;
  url: string;
  format: string;
}

export interface MediaAssetDetail {
  id: string;
  workspaceId: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  originalUrl: string;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  metadata?: Record<string, any> | null;
  variants?: MediaVariantSpec[];
  createdAt: string;
  updatedAt: string;
}

export interface MediaFilterQuery {
  search?: string;
  type?: 'all' | 'video' | 'image' | 'audio';
  folderId?: string;
  sort?: 'newest' | 'oldest' | 'name' | 'size';
  page?: number;
  limit?: number;
}

export interface PostVersionDetail {
  id: string;
  postId: string;
  socialAccountId: string;
  platformType: PlatformType;
  caption: string;
  title?: string | null;
  description?: string | null;
  status: PostStatus;
  externalPostId?: string | null;
  externalPostUrl?: string | null;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostDetail {
  id: string;
  workspaceId: string;
  authorId: string;
  authorName: string;
  folderId?: string | null;
  title?: string | null;
  universalCaption: string;
  status: PostStatus;
  scheduledAt?: string | null;
  publishedAt?: string | null;
  versions: PostVersionDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformValidationError {
  platformType: PlatformType;
  field: string;
  message: string;
}

export interface AICaptionAdaptResult {
  platformType: PlatformType;
  adaptedCaption: string;
  tone: ToneOption;
  hashtags: string[];
}

export interface ContentAuditResult {
  score: number; // 0 - 100
  rating: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'POOR';
  strengths: string[];
  improvements: string[];
}

export interface BestTimeRecommendation {
  platformType: PlatformType;
  bestDay: string;
  bestHour: string;
  timezone: string;
  confidenceScore: number;
}

export interface AIJobSummary {
  id: string;
  workspaceId: string;
  type: string;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

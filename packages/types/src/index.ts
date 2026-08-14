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
  | 'GOOGLE_BUSINESS'
  | 'OTHER';

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

export type TranscodingPresetName =
  | 'VERTICAL_SHORT_VIDEO'
  | 'LANDSCAPE_VIDEO'
  | 'SQUARE_VIDEO'
  | 'INSTAGRAM_REEL'
  | 'TIKTOK_VIDEO'
  | 'YOUTUBE_SHORT'
  | 'SQUARE_IMAGE'
  | 'STORY_IMAGE';

export type SubscriptionTier = 'FREE' | 'CREATOR' | 'PRO' | 'AGENCY';

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

export interface TranscodingPresetSpec {
  preset: TranscodingPresetName;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  mediaType: 'video' | 'image';
}

export interface TranscodingJobDetail {
  id: string;
  mediaAssetId: string;
  presets: TranscodingPresetName[];
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  generatedVariants: MediaVariantSpec[];
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

export interface CalendarPostItem {
  id: string;
  title: string;
  universalCaption: string;
  status: PostStatus;
  scheduledAt: string;
  publishedAt?: string | null;
  platformTypes: PlatformType[];
  versionCount: number;
}

export interface ScheduleConflict {
  postId: string;
  conflictingPostId: string;
  socialAccountId: string;
  platformType: PlatformType;
  scheduledAt: string;
  conflictingScheduledAt: string;
  diffMinutes: number;
}

export interface PublishingResult {
  success: boolean;
  externalPostId?: string;
  externalPostUrl?: string;
  errorMessage?: string;
  retryCount: number;
}

export interface PublishingLogItem {
  id: string;
  postVersionId: string;
  platformType: PlatformType;
  status: PostStatus;
  responsePayload?: any;
  errorMessage?: string | null;
  executedAt: string;
}

export interface AnalyticsOverview {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalClicks: number;
  totalReach: number;
  averageEngagementRate: number;
  publishedPostsCount: number;
}

export interface PlatformMetricsBreakdown {
  platformType: PlatformType;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagementRate: number;
}

export interface TopPostMetric {
  id: string;
  title: string;
  universalCaption: string;
  platformTypes: PlatformType[];
  views: number;
  likes: number;
  engagementRate: number;
  publishedAt: string;
}

export interface ApprovalRequestDetail {
  id: string;
  postId: string;
  postTitle: string;
  universalCaption: string;
  authorName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface ApprovalCommentDetail {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  action: string;
  entity: string;
  createdAt: string;
}

export interface BrandKitDetail {
  id: string;
  workspaceId: string;
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  fontFamily?: string | null;
  watermarkUrl?: string | null;
  defaultCta?: string | null;
  defaultHashtags: string[];
  voiceTone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContentTemplateDetail {
  id: string;
  workspaceId?: string | null;
  name: string;
  category: string;
  templateData: {
    title?: string;
    caption: string;
    recommendedPlatforms: PlatformType[];
    suggestedTone?: ToneOption;
  };
  isGlobal: boolean;
  createdAt: string;
}

export interface UsageQuotaDetail {
  postsThisMonth: number;
  maxPostsPerMonth: number;
  aiCreditsUsed: number;
  maxAiCredits: number;
  connectedAccounts: number;
  maxConnectedAccounts: number;
  teamSeats: number;
  maxTeamSeats: number;
  storageUsedMB: number;
  maxStorageMB: number;
}

export interface SubscriptionPlanDetail {
  id: string;
  workspaceId: string;
  tier: SubscriptionTier;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
  monthlyPriceUSD: number;
  quota: UsageQuotaDetail;
  renewsAt: string;
}

export interface InvoiceItem {
  id: string;
  amountUSD: number;
  status: 'PAID' | 'OPEN' | 'FAILED';
  pdfUrl: string;
  createdAt: string;
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
  score: number;
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

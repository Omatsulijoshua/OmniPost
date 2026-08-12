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

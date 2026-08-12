import { PlatformCapabilities, PlatformType } from '@omnipost/types';

export interface PostPayload {
  postId: string;
  versionId: string;
  caption: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  hashtags?: string[];
  scheduledAt?: string;
  metadata?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  externalPostId?: string;
  externalPostUrl?: string;
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

export interface AnalyticsQuery {
  startDate: string;
  endDate: string;
  metrics: string[];
}

export interface PlatformAdapter {
  platformType: PlatformType;
  connect(credentials: Record<string, any>): Promise<{ accountId: string; accountName: string; tokenData: Record<string, any> }>;
  refreshToken(tokenData: Record<string, any>): Promise<Record<string, any>>;
  validateContent(payload: PostPayload): Promise<{ valid: boolean; errors?: string[] }>;
  getCapabilities(): PlatformCapabilities;
  prepareMedia(mediaUrls: string[]): Promise<string[]>;
  publish(payload: PostPayload, credentials: Record<string, any>): Promise<PublishResult>;
  schedule(payload: PostPayload, credentials: Record<string, any>): Promise<PublishResult>;
  getPublishStatus(externalPostId: string, credentials: Record<string, any>): Promise<PublishResult>;
  deletePost(externalPostId: string, credentials: Record<string, any>): Promise<boolean>;
  getAnalytics(externalPostId: string, query: AnalyticsQuery, credentials: Record<string, any>): Promise<Record<string, any>>;
}

export abstract class BasePlatformAdapter implements PlatformAdapter {
  abstract platformType: PlatformType;

  abstract connect(credentials: Record<string, any>): Promise<{ accountId: string; accountName: string; tokenData: Record<string, any> }>;
  abstract refreshToken(tokenData: Record<string, any>): Promise<Record<string, any>>;
  abstract validateContent(payload: PostPayload): Promise<{ valid: boolean; errors?: string[] }>;
  abstract getCapabilities(): PlatformCapabilities;
  abstract prepareMedia(mediaUrls: string[]): Promise<string[]>;
  abstract publish(payload: PostPayload, credentials: Record<string, any>): Promise<PublishResult>;
  abstract schedule(payload: PostPayload, credentials: Record<string, any>): Promise<PublishResult>;
  abstract getPublishStatus(externalPostId: string, credentials: Record<string, any>): Promise<PublishResult>;
  abstract deletePost(externalPostId: string, credentials: Record<string, any>): Promise<boolean>;
  abstract getAnalytics(externalPostId: string, query: AnalyticsQuery, credentials: Record<string, any>): Promise<Record<string, any>>;
}

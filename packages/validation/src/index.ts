import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const confirmPasswordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
});

export const addWorkspaceMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['ADMIN', 'EDITOR', 'PUBLISHER', 'ANALYST', 'VIEWER']),
});

export const updateWorkspaceMemberRoleSchema = z.object({
  role: z.enum(['ADMIN', 'EDITOR', 'PUBLISHER', 'ANALYST', 'VIEWER']),
});

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required'),
  parentId: z.string().uuid().nullable().optional(),
});

export const updateMediaAssetSchema = z.object({
  filename: z.string().min(1).optional(),
  folderId: z.string().uuid().nullable().optional(),
});

export const bulkDeleteMediaSchema = z.object({
  assetIds: z.array(z.string().uuid()).min(1, 'At least one asset ID is required'),
});

export const bulkMoveMediaSchema = z.object({
  assetIds: z.array(z.string().uuid()).min(1, 'At least one asset ID is required'),
  folderId: z.string().uuid().nullable(),
});

export const connectMockAccountSchema = z.object({
  platformType: z.enum([
    'INSTAGRAM',
    'FACEBOOK',
    'TIKTOK',
    'YOUTUBE',
    'X',
    'LINKEDIN',
    'THREADS',
    'PINTEREST',
    'TELEGRAM',
    'DISCORD',
    'SLACK',
    'REDDIT',
    'GOOGLE_BUSINESS',
  ]),
  accountName: z.string().min(1, 'Account name is required'),
  profileUrl: z.string().url().optional(),
  avatarUrl: z.string().url().optional(),
});

export const oauthCallbackSchema = z.object({
  platformType: z.enum([
    'INSTAGRAM',
    'FACEBOOK',
    'TIKTOK',
    'YOUTUBE',
    'X',
    'LINKEDIN',
    'THREADS',
    'PINTEREST',
    'TELEGRAM',
    'DISCORD',
    'SLACK',
    'REDDIT',
    'GOOGLE_BUSINESS',
  ]),
  code: z.string().min(1, 'OAuth code is required'),
  state: z.string().optional(),
});

export const postVersionOverrideSchema = z.object({
  socialAccountId: z.string().uuid(),
  caption: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
});

export const createPostSchema = z.object({
  title: z.string().optional(),
  universalCaption: z.string().min(1, 'Universal caption is required'),
  socialAccountIds: z.array(z.string().uuid()).min(1, 'Select at least one social account'),
  folderId: z.string().uuid().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  isDraft: z.boolean().optional(),
  publishNow: z.boolean().optional(),
  overrides: z.array(postVersionOverrideSchema).optional(),
});

export const updatePostSchema = z.object({
  title: z.string().optional(),
  universalCaption: z.string().min(1).optional(),
  folderId: z.string().uuid().nullable().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED']).optional(),
  overrides: z.array(postVersionOverrideSchema).optional(),
});

export const reschedulePostSchema = z.object({
  scheduledAt: z.string().datetime('Invalid schedule ISO date string'),
});

export const createTranscodingJobSchema = z.object({
  mediaAssetId: z.string().uuid('Invalid media asset ID'),
  presets: z.array(
    z.enum([
      'VERTICAL_SHORT_VIDEO',
      'LANDSCAPE_VIDEO',
      'SQUARE_VIDEO',
      'INSTAGRAM_REEL',
      'TIKTOK_VIDEO',
      'YOUTUBE_SHORT',
      'SQUARE_IMAGE',
      'STORY_IMAGE',
    ]),
  ).min(1, 'Select at least one transcoding preset'),
});

export const adaptCaptionSchema = z.object({
  caption: z.string().min(1, 'Caption is required'),
  platformType: z.enum([
    'INSTAGRAM',
    'FACEBOOK',
    'TIKTOK',
    'YOUTUBE',
    'X',
    'LINKEDIN',
    'THREADS',
    'PINTEREST',
    'TELEGRAM',
    'DISCORD',
    'SLACK',
    'REDDIT',
    'GOOGLE_BUSINESS',
  ]),
  tone: z.enum([
    'Professional',
    'Viral',
    'Casual',
    'Sales',
    'Storytelling',
    'Educational',
    'Humor',
  ]),
});

export const generateHashtagsSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  platformType: z.enum([
    'INSTAGRAM',
    'FACEBOOK',
    'TIKTOK',
    'YOUTUBE',
    'X',
    'LINKEDIN',
    'THREADS',
    'PINTEREST',
    'TELEGRAM',
    'DISCORD',
    'SLACK',
    'REDDIT',
    'GOOGLE_BUSINESS',
  ]),
});

export const scoreContentSchema = z.object({
  caption: z.string().min(1, 'Caption is required'),
  platformType: z.enum([
    'INSTAGRAM',
    'FACEBOOK',
    'TIKTOK',
    'YOUTUBE',
    'X',
    'LINKEDIN',
    'THREADS',
    'PINTEREST',
    'TELEGRAM',
    'DISCORD',
    'SLACK',
    'REDDIT',
    'GOOGLE_BUSINESS',
  ]),
});

export const repurposeContentSchema = z.object({
  sourceText: z.string().min(10, 'Source text must be at least 10 characters'),
  targetPlatforms: z.array(
    z.enum([
      'INSTAGRAM',
      'FACEBOOK',
      'TIKTOK',
      'YOUTUBE',
      'X',
      'LINKEDIN',
      'THREADS',
      'PINTEREST',
      'TELEGRAM',
      'DISCORD',
      'SLACK',
      'REDDIT',
      'GOOGLE_BUSINESS',
    ]),
  ).min(1, 'Select at least one target platform'),
});

export const generateImagePromptSchema = z.object({
  concept: z.string().min(1, 'Concept description is required'),
  style: z.string().optional(),
});

export const testPublishingConnectionSchema = z.object({
  socialAccountId: z.string().uuid('Invalid social account ID'),
});

export const retryPublishingSchema = z.object({
  postVersionId: z.string().uuid('Invalid post version ID'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;
export type ConfirmPasswordResetInput = z.infer<typeof confirmPasswordResetSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
export type UpdateWorkspaceMemberRoleInput = z.infer<typeof updateWorkspaceMemberRoleSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateMediaAssetInput = z.infer<typeof updateMediaAssetSchema>;
export type BulkDeleteMediaInput = z.infer<typeof bulkDeleteMediaSchema>;
export type BulkMoveMediaInput = z.infer<typeof bulkMoveMediaSchema>;
export type ConnectMockAccountInput = z.infer<typeof connectMockAccountSchema>;
export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>;
export type PostVersionOverrideInput = z.infer<typeof postVersionOverrideSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type ReschedulePostInput = z.infer<typeof reschedulePostSchema>;
export type CreateTranscodingJobInput = z.infer<typeof createTranscodingJobSchema>;
export type AdaptCaptionInput = z.infer<typeof adaptCaptionSchema>;
export type GenerateHashtagsInput = z.infer<typeof generateHashtagsSchema>;
export type ScoreContentInput = z.infer<typeof scoreContentSchema>;
export type RepurposeContentInput = z.infer<typeof repurposeContentSchema>;
export type GenerateImagePromptInput = z.infer<typeof generateImagePromptSchema>;
export type TestPublishingConnectionInput = z.infer<typeof testPublishingConnectionSchema>;
export type RetryPublishingInput = z.infer<typeof retryPublishingSchema>;

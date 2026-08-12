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

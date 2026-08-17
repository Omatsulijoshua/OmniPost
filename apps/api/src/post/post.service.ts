import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlatformValidatorService } from './platform-validator.service';
import {
  PostDetail,
  PostStatus,
  PlatformType,
  PlatformValidationError,
} from '@omnipost/types';
import { CreatePostInput, UpdatePostInput } from '@omnipost/validation';

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validator: PlatformValidatorService,
  ) {}

  async createPost(
    workspaceId: string,
    authorId: string,
    input: CreatePostInput,
  ): Promise<{ post: PostDetail; validationErrors: PlatformValidationError[] }> {
    const socialAccounts = await this.prisma.socialAccount.findMany({
      where: { id: { in: input.socialAccountIds }, workspaceId },
      include: { platform: true },
    });

    if (socialAccounts.length === 0) {
      throw new BadRequestException('At least one valid social account must be selected');
    }

    const validationErrors: PlatformValidationError[] = [];
    for (const acc of socialAccounts) {
      const pType = acc.platform.type as PlatformType;
      const override = input.overrides?.find((o) => o.socialAccountId === acc.id);
      const finalCaption = override?.caption || input.universalCaption;
      const finalTitle = override?.title || input.title;

      const errs = this.validator.validatePostVersion(pType, finalCaption, finalTitle);
      validationErrors.push(...errs);
    }

    let status: PostStatus = 'DRAFT';
    if (input.isDraft) {
      status = 'DRAFT';
    } else if (input.publishNow) {
      status = 'PUBLISHING';
    } else if (input.scheduledAt) {
      status = 'SCHEDULED';
    }

    const post = await this.prisma.post.create({
      data: {
        workspaceId,
        authorId,
        folderId: input.folderId || null,
        title: input.title || null,
        universalCaption: input.universalCaption,
        status,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        publishedAt: input.publishNow ? new Date() : null,
        versions: {
          create: socialAccounts.map((acc: any) => {
            const pType = acc.platform.type as PlatformType;
            const override = input.overrides?.find((o: any) => o.socialAccountId === acc.id);
            return {
              socialAccount: {
                connect: { id: acc.id },
              },
              platformType: pType,
              caption: override?.caption || input.universalCaption,
              title: override?.title || input.title || null,
              description: override?.description || null,
              status,
              hashtags: {
                create: (override?.hashtags || []).map((h: any) => ({
                  tag: h.startsWith('#') ? h : `#${h}`,
                })),
              },
            };
          }),
        },
      },
      include: {
        author: true,
        versions: {
          include: {
            hashtags: true,
          },
        },
      },
    });

    return {
      post: this.mapPostDetail(post),
      validationErrors,
    };
  }

  async getPosts(
    workspaceId: string,
    status?: PostStatus,
    folderId?: string,
  ): Promise<PostDetail[]> {
    const where: any = { workspaceId, deletedAt: null };
    if (status) where.status = status;
    if (folderId) where.folderId = folderId;

    const posts = await this.prisma.post.findMany({
      where,
      include: {
        author: true,
        versions: {
          include: {
            hashtags: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return posts.map((p: any) => this.mapPostDetail(p));
  }

  async getPostById(workspaceId: string, id: string): Promise<PostDetail> {
    const post = await this.prisma.post.findFirst({
      where: { id, workspaceId, deletedAt: null },
      include: {
        author: true,
        versions: {
          include: {
            hashtags: true,
          },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return this.mapPostDetail(post);
  }

  async updatePost(
    workspaceId: string,
    id: string,
    input: UpdatePostInput,
  ): Promise<PostDetail> {
    const existing = await this.prisma.post.findFirst({
      where: { id, workspaceId, deletedAt: null },
    });

    if (!existing) throw new NotFoundException('Post not found');

    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.universalCaption !== undefined
          ? { universalCaption: input.universalCaption }
          : {}),
        ...(input.folderId !== undefined ? { folderId: input.folderId } : {}),
        ...(input.scheduledAt !== undefined
          ? { scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: {
        author: true,
        versions: {
          include: {
            hashtags: true,
          },
        },
      },
    });

    return this.mapPostDetail(updated);
  }

  async deletePost(workspaceId: string, id: string): Promise<void> {
    const existing = await this.prisma.post.findFirst({
      where: { id, workspaceId, deletedAt: null },
    });

    if (!existing) throw new NotFoundException('Post not found');

    await this.prisma.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async publishNow(workspaceId: string, id: string): Promise<PostDetail> {
    const post = await this.prisma.post.findFirst({
      where: { id, workspaceId, deletedAt: null },
      include: { versions: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    const updated = await this.prisma.post.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        versions: {
          updateMany: {
            where: { postId: id },
            data: { status: 'PUBLISHED' },
          },
        },
      },
      include: {
        author: true,
        versions: {
          include: { hashtags: true },
        },
      },
    });

    return this.mapPostDetail(updated);
  }

  private mapPostDetail(post: any): PostDetail {
    return {
      id: post.id,
      workspaceId: post.workspaceId,
      authorId: post.authorId,
      authorName: post.author?.name || 'Unknown Author',
      folderId: post.folderId,
      title: post.title,
      universalCaption: post.universalCaption,
      status: post.status as PostStatus,
      scheduledAt: post.scheduledAt ? post.scheduledAt.toISOString() : null,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      versions: post.versions.map((v: any) => ({
        id: v.id,
        postId: v.postId,
        socialAccountId: v.socialAccountId,
        platformType: v.platformType as PlatformType,
        caption: v.caption,
        title: v.title,
        description: v.description,
        status: v.status as PostStatus,
        externalPostId: v.externalPostId,
        externalPostUrl: v.externalPostUrl,
        hashtags: v.hashtags ? v.hashtags.map((h: any) => h.tag) : [],
        createdAt: v.createdAt.toISOString(),
        updatedAt: v.updatedAt.toISOString(),
      })),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}

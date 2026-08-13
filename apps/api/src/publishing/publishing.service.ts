import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PublisherFactory,
  PublishingRetryEngine,
} from '@omnipost/publishing-core';
import {
  PlatformType,
  PublishingLogItem,
  PublishingResult,
} from '@omnipost/types';

@Injectable()
export class PublishingService {
  constructor(private readonly prisma: PrismaService) {}

  async testConnection(
    workspaceId: string,
    socialAccountId: string,
  ): Promise<{ connected: boolean; message: string }> {
    const account = await this.prisma.socialAccount.findFirst({
      where: { id: socialAccountId, workspaceId },
      include: { platform: true },
    });

    if (!account) throw new NotFoundException('Social account not found');

    const platformType = account.platform.type as PlatformType;
    const publisher = PublisherFactory.getPublisher(platformType);

    const testRes = await publisher.publish({
      caption: 'Connection Test Post',
      isMock: account.isMock,
    });

    return {
      connected: testRes.success,
      message: testRes.success
        ? `Successfully connected to ${account.platform.name}`
        : testRes.errorMessage || 'Connection test failed',
    };
  }

  async publishPostVersion(
    workspaceId: string,
    postVersionId: string,
  ): Promise<PublishingResult> {
    const version = await this.prisma.postVersion.findFirst({
      where: { id: postVersionId },
      include: {
        socialAccount: { include: { platform: true } },
        post: true,
        hashtags: true,
      },
    });

    if (!version) throw new NotFoundException('Post version not found');

    await this.prisma.postVersion.update({
      where: { id: postVersionId },
      data: { status: 'PUBLISHING' },
    });

    const publisher = PublisherFactory.getPublisher(
      version.platformType as PlatformType,
    );

    const hashtagStrings = version.hashtags.map((h: any) => h.tag);

    const result = await PublishingRetryEngine.executeWithRetry(publisher, {
      caption: version.caption,
      title: version.title || undefined,
      hashtags: hashtagStrings,
      isMock: version.socialAccount?.isMock,
    });

    if (result.success) {
      await this.prisma.postVersion.update({
        where: { id: postVersionId },
        data: {
          status: 'PUBLISHED',
          externalPostId: result.externalPostId,
          externalPostUrl: result.externalPostUrl,
        },
      });

      await this.prisma.post.update({
        where: { id: version.postId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });
    } else {
      await this.prisma.postVersion.update({
        where: { id: postVersionId },
        data: { status: 'FAILED' },
      });

      await this.prisma.post.update({
        where: { id: version.postId },
        data: { status: 'FAILED' },
      });
    }

    return result;
  }

  async getLogs(workspaceId: string): Promise<PublishingLogItem[]> {
    const versions = await this.prisma.postVersion.findMany({
      where: {
        post: { workspaceId },
        status: { in: ['PUBLISHED', 'FAILED', 'PUBLISHING'] },
      },
      orderBy: { updatedAt: 'desc' },
      take: 30,
    });

    return versions.map((v: any) => ({
      id: `log-${v.id}`,
      postVersionId: v.id,
      platformType: v.platformType as PlatformType,
      status: v.status as any,
      executedAt: v.updatedAt.toISOString(),
      errorMessage: v.status === 'FAILED' ? 'Publishing attempt failed' : null,
    }));
  }
}

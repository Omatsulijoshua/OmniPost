import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CalendarPostItem,
  PlatformType,
  PostDetail,
  ScheduleConflict,
} from '@omnipost/types';

@Injectable()
export class SchedulerService {
  constructor(private readonly prisma: PrismaService) {}

  async getCalendarPosts(
    workspaceId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<CalendarPostItem[]> {
    const where: any = {
      workspaceId,
      deletedAt: null,
      scheduledAt: { not: null },
    };

    if (startDate && endDate) {
      where.scheduledAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const posts = await this.prisma.post.findMany({
      where,
      include: {
        versions: {
          select: { platformType: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return posts.map((post) => {
      const platformTypes = Array.from(
        new Set(post.versions.map((v) => v.platformType as PlatformType)),
      );

      return {
        id: post.id,
        title: post.title || 'Untitled Post',
        universalCaption: post.universalCaption,
        status: post.status as any,
        scheduledAt: post.scheduledAt!.toISOString(),
        publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
        platformTypes,
        versionCount: post.versions.length,
      };
    });
  }

  async reschedulePost(
    workspaceId: string,
    postId: string,
    newScheduledAt: string,
  ): Promise<CalendarPostItem> {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, workspaceId, deletedAt: null },
    });

    if (!post) throw new NotFoundException('Post not found');

    const updated = await this.prisma.post.update({
      where: { id: postId },
      data: {
        scheduledAt: new Date(newScheduledAt),
        status: 'SCHEDULED',
      },
      include: {
        versions: { select: { platformType: true } },
      },
    });

    const platformTypes = Array.from(
      new Set(updated.versions.map((v) => v.platformType as PlatformType)),
    );

    return {
      id: updated.id,
      title: updated.title || 'Untitled Post',
      universalCaption: updated.universalCaption,
      status: updated.status as any,
      scheduledAt: updated.scheduledAt!.toISOString(),
      publishedAt: updated.publishedAt ? updated.publishedAt.toISOString() : null,
      platformTypes,
      versionCount: updated.versions.length,
    };
  }

  async detectConflicts(workspaceId: string): Promise<ScheduleConflict[]> {
    const scheduledPosts = await this.prisma.post.findMany({
      where: {
        workspaceId,
        status: 'SCHEDULED',
        deletedAt: null,
        scheduledAt: { not: null },
      },
      include: {
        versions: {
          select: { socialAccountId: true, platformType: true },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    const conflicts: ScheduleConflict[] = [];

    for (let i = 0; i < scheduledPosts.length; i++) {
      for (let j = i + 1; j < scheduledPosts.length; j++) {
        const p1 = scheduledPosts[i];
        const p2 = scheduledPosts[j];

        const t1 = p1.scheduledAt!.getTime();
        const t2 = p2.scheduledAt!.getTime();
        const diffMinutes = Math.abs(t2 - t1) / (1000 * 60);

        if (diffMinutes <= 5) {
          for (const v1 of p1.versions) {
            for (const v2 of p2.versions) {
              if (v1.socialAccountId === v2.socialAccountId) {
                conflicts.push({
                  postId: p1.id,
                  conflictingPostId: p2.id,
                  socialAccountId: v1.socialAccountId,
                  platformType: v1.platformType as PlatformType,
                  scheduledAt: p1.scheduledAt!.toISOString(),
                  conflictingScheduledAt: p2.scheduledAt!.toISOString(),
                  diffMinutes,
                });
              }
            }
          }
        }
      }
    }

    return conflicts;
  }
}

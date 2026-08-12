import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('SchedulerService', () => {
  let service: SchedulerService;

  const mockPrismaService = {
    post: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
    jest.clearAllMocks();
  });

  it('should return scheduled posts for date range', async () => {
    const mockScheduledPost = {
      id: 'post-sched-1',
      title: 'Promo Video',
      universalCaption: 'Watch our promo',
      status: 'SCHEDULED',
      scheduledAt: new Date('2026-08-15T10:00:00Z'),
      publishedAt: null,
      versions: [{ platformType: 'INSTAGRAM' }, { platformType: 'TIKTOK' }],
    };

    mockPrismaService.post.findMany.mockResolvedValue([mockScheduledPost]);

    const posts = await service.getCalendarPosts(
      'ws-1',
      '2026-08-01T00:00:00Z',
      '2026-08-31T23:59:59Z',
    );

    expect(posts.length).toBe(1);
    expect(posts[0].id).toBe('post-sched-1');
    expect(posts[0].platformTypes).toContain('INSTAGRAM');
    expect(posts[0].platformTypes).toContain('TIKTOK');
  });

  it('should detect schedule conflicts when 2 posts overlap within 5 minutes on the same account', async () => {
    const time1 = new Date('2026-08-15T10:00:00Z');
    const time2 = new Date('2026-08-15T10:03:00Z'); // 3 mins diff

    mockPrismaService.post.findMany.mockResolvedValue([
      {
        id: 'post-1',
        scheduledAt: time1,
        versions: [{ socialAccountId: 'acc-insta', platformType: 'INSTAGRAM' }],
      },
      {
        id: 'post-2',
        scheduledAt: time2,
        versions: [{ socialAccountId: 'acc-insta', platformType: 'INSTAGRAM' }],
      },
    ]);

    const conflicts = await service.detectConflicts('ws-1');

    expect(conflicts.length).toBe(1);
    expect(conflicts[0].postId).toBe('post-1');
    expect(conflicts[0].conflictingPostId).toBe('post-2');
    expect(conflicts[0].diffMinutes).toBe(3);
  });

  it('should reschedule post to new timestamp', async () => {
    mockPrismaService.post.findFirst.mockResolvedValue({
      id: 'post-1',
      workspaceId: 'ws-1',
    });

    const newDate = new Date('2026-08-20T14:00:00Z');
    mockPrismaService.post.update.mockResolvedValue({
      id: 'post-1',
      title: 'Rescheduled Post',
      universalCaption: 'Updated caption',
      status: 'SCHEDULED',
      scheduledAt: newDate,
      publishedAt: null,
      versions: [{ platformType: 'X' }],
    });

    const result = await service.reschedulePost(
      'ws-1',
      'post-1',
      '2026-08-20T14:00:00Z',
    );

    expect(result.id).toBe('post-1');
    expect(result.scheduledAt).toBe(newDate.toISOString());
  });
});

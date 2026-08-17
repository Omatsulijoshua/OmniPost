import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockPrismaService = {
    workspace: {
      findUnique: jest.fn(),
    },
    post: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    analyticsMetric: {
      findMany: jest.fn(),
    },
    socialAccount: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    jest.clearAllMocks();
  });

  it('should return aggregated stats for a valid workspace', async () => {
    mockPrismaService.workspace.findUnique.mockResolvedValue({ id: 'ws-1' });
    mockPrismaService.post.count
      .mockResolvedValueOnce(15) // totalPosts
      .mockResolvedValueOnce(3)  // scheduledPosts
      .mockResolvedValueOnce(10) // publishedPosts
      .mockResolvedValueOnce(1)  // failedPosts
      .mockResolvedValueOnce(1); // draftPosts

    mockPrismaService.analyticsMetric.findMany.mockResolvedValue([
      { name: 'views', value: 1200 },
      { name: 'likes', value: 150 },
      { name: 'comments', value: 30 },
      { name: 'followers', value: 500 },
    ]);

    const stats = await service.getDashboardStats('ws-1');

    expect(stats.totalPosts).toBe(15);
    expect(stats.scheduledPosts).toBe(3);
    expect(stats.publishedPosts).toBe(10);
    expect(stats.totalViews).toBe(1200);
    expect(stats.totalEngagement).toBe(180);
    expect(stats.totalFollowers).toBe(500);
  });

  it('should throw NotFoundException if workspace does not exist', async () => {
    mockPrismaService.workspace.findUnique.mockResolvedValue(null);

    await expect(service.getDashboardStats('invalid-ws')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return connected platform statuses', async () => {
    mockPrismaService.socialAccount.findMany.mockResolvedValue([
      {
        id: 'acc-1',
        accountName: '@omnipost_official',
        profileUrl: 'https://instagram.com/omnipost_official',
        avatarUrl: null,
        isMock: false,
        platform: {
          type: 'INSTAGRAM',
          name: 'Instagram',
          capabilities: {},
        },
      },
    ]);

    const platforms = await service.getConnectedPlatforms('ws-1');

    expect(platforms.length).toBe(15);
    const insta = platforms.find((p) => p.platformType === 'INSTAGRAM');
    expect(insta?.isConnected).toBe(true);
    expect(insta?.accountName).toBe('@omnipost_official');

    const tiktok = platforms.find((p) => p.platformType === 'TIKTOK');
    expect(tiktok?.isConnected).toBe(false);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AdminAnalyticsService } from './admin-analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminAnalyticsService', () => {
  let service: AdminAnalyticsService;

  const mockPrismaService = {
    user: { count: jest.fn() },
    post: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminAnalyticsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AdminAnalyticsService>(AdminAnalyticsService);
    jest.clearAllMocks();
  });

  it('should return executive DAU/MAU retention metrics', async () => {
    mockPrismaService.user.count.mockResolvedValue(25000);

    const exec = await service.getExecutiveAnalytics('30d');

    expect(exec.mau).toBe(25000);
    expect(exec.retention30dPercent).toBeGreaterThan(80);
  });

  it('should return product feature usage metrics', async () => {
    mockPrismaService.post.count.mockResolvedValue(1300000);

    const product = await service.getProductAnalytics();

    expect(product.postsCreated).toBeGreaterThan(0);
    expect(product.aiGenerations).toBeGreaterThan(0);
  });

  it('should return cross-platform performance comparison', async () => {
    const platforms = await service.getPlatformComparison();

    expect(platforms.length).toBeGreaterThan(0);
    expect(platforms[0].successRatePercent).toBeGreaterThan(95);
  });
});
